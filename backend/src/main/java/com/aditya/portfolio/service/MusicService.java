package com.aditya.portfolio.service;

import com.aditya.portfolio.dto.*;
import com.aditya.portfolio.entity.Song;
import com.aditya.portfolio.exception.ResourceNotFoundException;
import com.aditya.portfolio.repository.SongRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.HtmlUtils;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MusicService {

    private static final Logger log = LoggerFactory.getLogger(MusicService.class);

    private final SongRepository songRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MusicService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    /**
     * Top Default preference:
     * 1. Chhath Puja songs
     * 2. Bhojpuri / Bihari classic songs
     * 3. Enabled songs
     */
    public List<SongResponse> getDefaultPreferenceSongs() {

        // 1. First priority: Chhath Puja songs
        List<Song> chhathSongs = songRepository.findAll((root, query, cb) ->
                cb.and(
                        cb.isTrue(root.get("enabled")),
                        cb.or(
                                cb.like(cb.lower(root.get("genre")), "%chhath%"),
                                cb.like(cb.lower(root.get("tags")), "%chhath%"),
                                cb.like(cb.lower(root.get("title")), "%chhath%"),
                                cb.like(cb.lower(root.get("title")), "%baans%"),
                                cb.like(cb.lower(root.get("title")), "%suraj%"),
                                cb.like(cb.lower(root.get("title")), "%sugwa%"),
                                cb.like(cb.lower(root.get("title")), "%dinanath%")
                        )
                )
        );

        if (!chhathSongs.isEmpty()) {
            return chhathSongs.stream()
                    .map(SongResponse::new)
                    .collect(Collectors.toList());
        }

        // 2. Secondary priority: Classic Bhojpuri songs
        List<Song> preferred =
                songRepository.findDefaultPreferredSongs("Bhojpuri");

        if (!preferred.isEmpty()) {
            return preferred.stream()
                    .map(SongResponse::new)
                    .collect(Collectors.toList());
        }

        // 3. Fallback: all enabled songs
        return songRepository.findByEnabledTrueOrderByIdAsc()
                .stream()
                .map(SongResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get Song of the Day.
     */
    public SongResponse getSongOfTheDay() {

        List<Song> all =
                songRepository.findByEnabledTrueOrderByIdAsc();

        if (all.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No active songs in library"
            );
        }

        int dayOfYear = LocalDate.now().getDayOfYear();
        int index = dayOfYear % all.size();

        return new SongResponse(all.get(index));
    }

    /**
     * Flexible multi-criteria search with fallbacks.
     */
    public List<SongResponse> searchMusic(MusicSearchRequest request) {

        if (request == null) {
            return getDefaultPreferenceSongs();
        }

        boolean hasLang = isNotBlank(request.getLanguage());
        boolean hasGenre = isNotBlank(request.getGenre());
        boolean hasEra = isNotBlank(request.getEra());
        boolean hasMood = isNotBlank(request.getMood());
        boolean hasArtist = isNotBlank(request.getArtist());
        boolean hasQuery = isNotBlank(request.getQuery());

        // No criteria -> default preference
        if (!hasLang
                && !hasGenre
                && !hasEra
                && !hasMood
                && !hasArtist
                && !hasQuery) {

            return getDefaultPreferenceSongs();
        }

        // Chhath query -> default preference
        if (hasQuery
                && request.getQuery()
                .toLowerCase(Locale.ROOT)
                .contains("chhath")) {

            return getDefaultPreferenceSongs();
        }

        // Keyword-only search
        if (hasQuery
                && !hasLang
                && !hasGenre
                && !hasEra
                && !hasMood
                && !hasArtist) {

            List<Song> results =
                    songRepository.searchByKeyword(
                            request.getQuery().trim()
                    );

            if (!results.isEmpty()) {
                return results.stream()
                        .map(SongResponse::new)
                        .collect(Collectors.toList());
            }
        }

        // Tier 1: exact match
        Specification<Song> exactSpec =
                buildSpecification(request, true);

        List<Song> tier1Results =
                songRepository.findAll(exactSpec);

        if (!tier1Results.isEmpty()) {
            return tier1Results.stream()
                    .map(SongResponse::new)
                    .collect(Collectors.toList());
        }

        // Tier 2: relaxed match
        Specification<Song> relaxedSpec =
                buildSpecification(request, false);

        List<Song> tier2Results =
                songRepository.findAll(relaxedSpec);

        if (!tier2Results.isEmpty()) {
            return tier2Results.stream()
                    .map(SongResponse::new)
                    .collect(Collectors.toList());
        }

        // Tier 3: keyword + online fallback
        if (hasQuery) {

            List<Song> queryResults =
                    songRepository.searchByKeyword(
                            request.getQuery().trim()
                    );

            if (!queryResults.isEmpty()) {
                return queryResults.stream()
                        .map(SongResponse::new)
                        .collect(Collectors.toList());
            }

            List<SongResponse> onlineResults =
                    searchOnlineMusicApi(
                            request.getQuery().trim()
                    );

            if (!onlineResults.isEmpty()) {
                return onlineResults;
            }
        }

        return Collections.emptyList();
    }

    /**
     * Find song by ID.
     */
    public SongResponse getSongById(Long id) {

        Song song = songRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Song not found with ID: " + id
                        )
                );

        return new SongResponse(song);
    }

    /**
     * Get next song.
     */
    public SongResponse getNextSong(Long currentSongId) {

        if (currentSongId != null) {

            Optional<Song> next =
                    songRepository
                            .findFirstByEnabledTrueAndIdGreaterThanOrderByIdAsc(
                                    currentSongId
                            );

            if (next.isPresent()) {
                return new SongResponse(next.get());
            }
        }

        Song first =
                songRepository
                        .findFirstByEnabledTrueOrderByIdAsc()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No songs available in the library"
                                )
                        );

        return new SongResponse(first);
    }

    /**
     * Get previous song.
     */
    public SongResponse getPreviousSong(Long currentSongId) {

        if (currentSongId != null) {

            Optional<Song> previous =
                    songRepository
                            .findFirstByEnabledTrueAndIdLessThanOrderByIdDesc(
                                    currentSongId
                            );

            if (previous.isPresent()) {
                return new SongResponse(previous.get());
            }
        }

        Song last =
                songRepository
                        .findFirstByEnabledTrueOrderByIdDesc()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No songs available in the library"
                                )
                        );

        return new SongResponse(last);
    }

    /**
     * Get all enabled songs.
     */
    public List<SongResponse> getAllEnabledSongs() {

        return songRepository.findByEnabledTrueOrderByIdAsc()
                .stream()
                .map(SongResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * AI-friendly natural language command handler.
     */
    public MusicCommandResponse processCommand(String commandText) {

        if (commandText == null || commandText.trim().isEmpty()) {

            List<SongResponse> defaults =
                    getDefaultPreferenceSongs();

            return MusicCommandResponse.of(
                    "PLAY",
                    "Playing Chhath Puja geet (top preference).",
                    defaults
            );
        }

        String raw = commandText.trim();
        String lower = raw.toLowerCase(Locale.ROOT);

        // ============================================================
        // 1. CONTROL ACTIONS
        // ============================================================

        if (lower.equals("pause")
                || lower.equals("stop")
                || lower.contains("pause song")
                || lower.contains("stop music")) {

            return MusicCommandResponse.actionOnly(
                    "PAUSE",
                    "Audio playback paused."
            );
        }

        if (lower.equals("resume")
                || lower.equals("continue")
                || lower.contains("resume song")
                || lower.contains("unpause")) {

            return MusicCommandResponse.actionOnly(
                    "RESUME",
                    "Audio playback resumed."
            );
        }

        if (lower.equals("next")
                || lower.contains("next song")
                || lower.contains("skip")) {

            return MusicCommandResponse.actionOnly(
                    "NEXT",
                    "Skipping to next song."
            );
        }

        if (lower.equals("prev")
                || lower.equals("previous")
                || lower.contains("previous song")
                || lower.contains("go back")) {

            return MusicCommandResponse.actionOnly(
                    "PREVIOUS",
                    "Returning to previous song."
            );
        }

        // ============================================================
        // 2. CHHATH PUJA INTENT
        // ============================================================

        if (lower.contains("chhath")
                || lower.contains("puja")
                || lower.contains("sharda sinha")
                || lower.contains("dinanath")
                || lower.contains("suruj")
                || lower.contains("arghya")) {

            List<SongResponse> chhathSongs =
                    getDefaultPreferenceSongs();

            return MusicCommandResponse.of(
                    "PLAY",
                    "Playing authentic Chhath Puja geet by Sharda Sinha.",
                    chhathSongs
            );
        }

        // ============================================================
        // 3. CLEAN SEARCH QUERY
        // ============================================================

        String cleanQuery =
                cleanQueryForSearch(raw);

        // ============================================================
        // 3A. GENERIC PLAY REQUEST
        //
        // Examples:
        // play
        // play music
        // play song
        // play something
        // play anything
        // play some music
        // play any song
        // gaana bajaao
        // gaana chalao
        // kuch bhi bajao
        // ============================================================

        if (cleanQuery.isEmpty()
                || isPurelyGenericPlay(lower)) {

            List<SongResponse> defaults =
                    getDefaultPreferenceSongs();

            return MusicCommandResponse.of(
                    "PLAY",
                    "Playing Chhath Puja geet (top preference).",
                    defaults
            );
        }

        // ============================================================
        // 4. CATEGORY / FILTER DETECTION
        // ============================================================

        String language = null;

        if (lower.contains("bhojpuri")
                || lower.contains("bihari")) {

            language = "Bhojpuri";

        } else if (lower.contains("haryanvi")
                || lower.contains("haryana")) {

            language = "Haryanvi";

        } else if (lower.contains("hindi")) {

            language = "Hindi";

        } else if (lower.contains("punjabi")) {

            language = "Punjabi";
        }

        String era = null;

        if (lower.contains("upcoming")
                || lower.contains("teaser")
                || lower.contains("preview")) {

            era = "Upcoming";

        } else if (lower.contains("new song")
                || lower.contains("new")
                || lower.contains("trending")
                || lower.contains("latest")) {

            era = "Modern";

        } else if (lower.contains("old")
                || lower.contains("classic")
                || lower.contains("retro")
                || lower.contains("purana")
                || lower.contains("purane")) {

            era = "Old";
        }

        String mood = null;

        if (lower.contains("romantic")
                || lower.contains("love")) {

            mood = "Romantic";

        } else if (lower.contains("energetic")
                || lower.contains("party")
                || lower.contains("dance")
                || lower.contains("upbeat")) {

            mood = "Energetic";

        } else if (lower.contains("calm")
                || lower.contains("peaceful")
                || lower.contains("relax")
                || lower.contains("soothing")) {

            mood = "Calm";

        } else if (lower.contains("sad")
                || lower.contains("emotional")
                || lower.contains("dard")
                || lower.contains("heartbreak")
                || lower.contains("breakup")
                || lower.contains("rona")
                || lower.contains("dukhi")
                || lower.contains("gham")) {

            mood = "Sad";

        } else if (lower.contains("devotional")
                || lower.contains("bhakti")
                || lower.contains("bhajan")
                || lower.contains("aarti")) {

            mood = "Devotional";
        }

        String artist = null;

        if (lower.contains("nusrat")
                || lower.contains("nushrat")
                || lower.contains("fateh ali")) {

            artist = "Nusrat Fateh Ali Khan";

        } else if (lower.contains("kishore kumar")
                || lower.contains("kishore")) {

            artist = "Kishore Kumar";

        } else if (lower.contains("lata mangeshkar")
                || lower.contains("lata")) {

            artist = "Lata Mangeshkar";

        } else if (lower.contains("sharda sinha")) {

            artist = "Sharda Sinha";

        } else if (lower.contains("pawan singh")) {

            artist = "Pawan Singh";

        } else if (lower.contains("khesari lal")
                || lower.contains("khesari")) {

            artist = "Khesari Lal";

        } else if (lower.contains("arijit singh")
                || lower.contains("arijit")) {

            artist = "Arijit Singh";

        } else if (lower.contains("mukesh")) {

            artist = "Mukesh";

        } else if (lower.contains("mohd rafi")
                || lower.contains("mohammad rafi")
                || lower.contains("rafi")) {

            artist = "Mohammed Rafi";

        } else if (lower.contains("renuka panwar")
                || lower.contains("renuka")) {

            artist = "Renuka Panwar";
        }

        // ============================================================
        // SPECIAL INTENT: SAD SONGS
        // ============================================================

        if ("Sad".equalsIgnoreCase(mood)) {

            List<Song> sadSongs =
                    songRepository
                            .findByEnabledTrueAndMoodIgnoreCaseOrderByIdAsc(
                                    "Sad"
                            );

            if (!sadSongs.isEmpty()) {

                return MusicCommandResponse.of(
                        "PLAY",
                        "Playing emotional sad song: "
                                + sadSongs.get(0).getTitle()
                                + ".",
                        sadSongs.stream()
                                .map(SongResponse::new)
                                .collect(Collectors.toList())
                );
            }
        }

        // ============================================================
        // SPECIAL INTENT: NUSRAT FATEH ALI KHAN
        // ============================================================

        if ("Nusrat Fateh Ali Khan"
                .equalsIgnoreCase(artist)) {

            List<Song> nusratSongs =
                    songRepository.searchByKeyword("Nusrat");

            if (!nusratSongs.isEmpty()) {

                return MusicCommandResponse.of(
                        "PLAY",
                        "Playing Ustad Nusrat Fateh Ali Khan: "
                                + nusratSongs.get(0).getTitle()
                                + ".",
                        nusratSongs.stream()
                                .map(SongResponse::new)
                                .collect(Collectors.toList())
                );
            }
        }

        // ============================================================
        // 5. LOCAL MYSQL KEYWORD SEARCH
        // ============================================================

        List<Song> localKeywordMatches =
                songRepository.searchByKeyword(cleanQuery);

        if (!localKeywordMatches.isEmpty()) {

            Song firstMatch =
                    localKeywordMatches.get(0);

            List<SongResponse> results =
                    localKeywordMatches.stream()
                            .map(SongResponse::new)
                            .collect(Collectors.toList());

            return MusicCommandResponse.of(
                    "PLAY",
                    "Playing "
                            + firstMatch.getTitle()
                            + " by "
                            + firstMatch.getArtist()
                            + ".",
                    results
            );
        }

        // ============================================================
        // LOCAL MULTI-CRITERIA SEARCH
        // ============================================================

        if (language != null
                || era != null
                || mood != null
                || artist != null) {

            MusicSearchRequest searchReq =
                    new MusicSearchRequest(
                            language,
                            null,
                            era,
                            mood,
                            artist,
                            cleanQuery
                    );

            List<SongResponse> filterResults =
                    searchMusic(searchReq);

            if (!filterResults.isEmpty()) {

                SongResponse first =
                        filterResults.get(0);

                return MusicCommandResponse.of(
                        "PLAY",
                        "Playing "
                                + first.getTitle()
                                + " by "
                                + first.getArtist()
                                + ".",
                        filterResults
                );
            }
        }

        // ============================================================
        // 6. ONLINE MUSIC API
        // ============================================================

        log.info(
                "Searching online music API for query: {}",
                cleanQuery
        );

        List<SongResponse> onlineResults =
                searchOnlineMusicApi(cleanQuery);

        if (onlineResults.isEmpty()
                && !cleanQuery.equalsIgnoreCase(raw)) {

            onlineResults =
                    searchOnlineMusicApi(raw);
        }

        if (onlineResults.isEmpty()
                && artist != null) {

            onlineResults =
                    searchOnlineMusicApi(artist);
        }

        if (onlineResults.isEmpty()
                && language != null) {

            onlineResults =
                    searchOnlineMusicApi(
                            language + " songs"
                    );
        }

        if (!onlineResults.isEmpty()) {

            SongResponse first =
                    onlineResults.get(0);

            return MusicCommandResponse.of(
                    "PLAY",
                    "Playing "
                            + first.getTitle()
                            + " by "
                            + first.getArtist()
                            + " (live stream).",
                    onlineResults
            );
        }

        // ============================================================
        // 7. COMPLETE SONG DOWNLOAD ENGINE
        // ============================================================

        SongResponse downloadedSong =
                downloadCompleteSong(cleanQuery);

        if (downloadedSong != null) {

            return MusicCommandResponse.of(
                    "PLAY",
                    "Playing complete song: "
                            + downloadedSong.getTitle()
                            + ".",
                    List.of(downloadedSong)
            );
        }

        // ============================================================
        // 8. FINAL FALLBACK
        // ============================================================

        List<SongResponse> fallbacks =
                getDefaultPreferenceSongs();

        return MusicCommandResponse.of(
                "PLAY",
                "Could not find \""
                        + cleanQuery
                        + "\". Playing preferred Chhath Puja geet.",
                fallbacks
        );
    }

    /**
     * Detect generic play commands.
     *
     * This includes commands such as:
     *
     * play
     * play music
     * play song
     * play something
     * play anything
     * play some music
     * play any music
     * play some song
     * play any song
     * play some songs
     * play any songs
     * gaana bajaao
     * gaana chalao
     * kuch bhi bajao
     * kuch bhi chalao
     */
    private boolean isPurelyGenericPlay(String text) {

        if (text == null || text.trim().isEmpty()) {
            return true;
        }

        String t = text.trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", " ");

        return t.matches(
                "^(play|bajaao|bajao|chalaao|chalao|gaana|geet|music|song|songs|start|suno|sunao)"
                        + "(\\s+(something|anything|some music|any music|some song|any song|"
                        + "some songs|any songs|kuch|kuch bhi|koi song|koi gaana|"
                        + "koi bhi gaana|koi bhi song))?$"
                        + "|^(play music|play song|play songs|play something|play anything|"
                        + "play some music|play any music|play some song|play any song|"
                        + "play some songs|play any songs|gaana bajaao|gaana chalao|"
                        + "kuch bhi bajao|kuch bhi chalao)$"
        );
    }

    /**
     * Create new song record.
     */
    @Transactional
    public SongResponse createSong(SongRequest request) {

        Song song = new Song(
                request.getTitle().trim(),
                request.getArtist() != null
                        ? request.getArtist().trim()
                        : null,
                request.getAlbum() != null
                        ? request.getAlbum().trim()
                        : null,
                request.getLanguage().trim(),
                request.getGenre() != null
                        ? request.getGenre().trim()
                        : null,
                request.getEra() != null
                        ? request.getEra().trim()
                        : null,
                request.getMood() != null
                        ? request.getMood().trim()
                        : null,
                request.getTags() != null
                        ? request.getTags().trim()
                        : null,
                request.getAudioUrl().trim(),
                request.getCoverUrl() != null
                        ? request.getCoverUrl().trim()
                        : null,
                request.getDurationSeconds(),
                request.getEnabled()
        );

        Song saved =
                songRepository.save(song);

        return new SongResponse(saved);
    }

    /**
     * Update existing song record.
     */
    @Transactional
    public SongResponse updateSong(
            Long id,
            SongRequest request
    ) {

        Song song =
                songRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Song not found with ID: " + id
                                )
                        );

        if (request.getTitle() != null
                && !request.getTitle().isBlank()) {

            song.setTitle(
                    request.getTitle().trim()
            );
        }

        if (request.getArtist() != null) {
            song.setArtist(
                    request.getArtist().trim()
            );
        }

        if (request.getAlbum() != null) {
            song.setAlbum(
                    request.getAlbum().trim()
            );
        }

        if (request.getLanguage() != null
                && !request.getLanguage().isBlank()) {

            song.setLanguage(
                    request.getLanguage().trim()
            );
        }

        if (request.getGenre() != null) {
            song.setGenre(
                    request.getGenre().trim()
            );
        }

        if (request.getEra() != null) {
            song.setEra(
                    request.getEra().trim()
            );
        }

        if (request.getMood() != null) {
            song.setMood(
                    request.getMood().trim()
            );
        }

        if (request.getTags() != null) {
            song.setTags(
                    request.getTags().trim()
            );
        }

        if (request.getAudioUrl() != null
                && !request.getAudioUrl().isBlank()) {

            song.setAudioUrl(
                    request.getAudioUrl().trim()
            );
        }

        if (request.getCoverUrl() != null) {
            song.setCoverUrl(
                    request.getCoverUrl().trim()
            );
        }

        if (request.getDurationSeconds() != null) {
            song.setDurationSeconds(
                    request.getDurationSeconds()
            );
        }

        if (request.getEnabled() != null) {
            song.setEnabled(
                    request.getEnabled()
            );
        }

        Song updated =
                songRepository.save(song);

        return new SongResponse(updated);
    }

    /**
     * Upload real user audio file.
     */
    @Transactional
    public SongResponse uploadSongFile(
            MultipartFile file,
            String title,
            String artist,
            String language,
            String era,
            String mood
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Cannot upload empty audio file"
            );
        }

        String orig =
                file.getOriginalFilename();

        String safeName =
                (orig != null && !orig.isBlank())
                        ? orig.replaceAll(
                                "[^a-zA-Z0-9.-]",
                                "_"
                        )
                        : "uploaded_"
                                + System.currentTimeMillis()
                                + ".mp3";

        Path backendPath =
                Paths.get(
                        "src/main/resources/static/music"
                ).resolve(safeName);

        Path targetPath =
                Paths.get(
                        "target/classes/static/music"
                ).resolve(safeName);

        Path frontendPath =
                Paths.get(
                        "../frontend/public/music"
                ).resolve(safeName);

        Files.createDirectories(
                backendPath.getParent()
        );

        Files.createDirectories(
                targetPath.getParent()
        );

        byte[] bytes =
                file.getBytes();

        Files.write(
                backendPath,
                bytes
        );

        Files.write(
                targetPath,
                bytes
        );

        try {

            if (Files.exists(
                    Paths.get("../frontend/public")
            )) {

                Files.createDirectories(
                        frontendPath.getParent()
                );

                Files.write(
                        frontendPath,
                        bytes
                );
            }

        } catch (Exception ignored) {
            // Frontend copy is optional.
        }

        String songTitle =
                (title != null && !title.isBlank())
                        ? title.trim()
                        : (orig != null
                                ? orig.replaceFirst(
                                        "[.][^.]+$",
                                        ""
                                )
                                : "Custom Track");

        Song song = new Song(
                songTitle,
                (artist != null && !artist.isBlank())
                        ? artist.trim()
                        : "Aditya's Music",
                "User Collection",
                (language != null && !language.isBlank())
                        ? language.trim()
                        : "Bhojpuri",
                "Chhath / Folk",
                (era != null && !era.isBlank())
                        ? era.trim()
                        : "Classic",
                (mood != null && !mood.isBlank())
                        ? mood.trim()
                        : "Devotional",
                "custom, uploaded, chhath",
                "/music/" + safeName,
                "/images/music/custom.jpg",
                240,
                true
        );

        Song saved =
                songRepository.save(song);

        return new SongResponse(saved);
    }

    /**
     * Build dynamic search specification.
     */
    private Specification<Song> buildSpecification(
            MusicSearchRequest req,
            boolean strict
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates =
                    new ArrayList<>();

            predicates.add(
                    cb.isTrue(root.get("enabled"))
            );

            if (isNotBlank(req.getLanguage())) {

                predicates.add(
                        cb.like(
                                cb.lower(
                                        root.get("language")
                                ),
                                "%"
                                        + req.getLanguage()
                                        .trim()
                                        .toLowerCase()
                                        + "%"
                        )
                );
            }

            if (isNotBlank(req.getGenre())) {

                predicates.add(
                        cb.like(
                                cb.lower(
                                        root.get("genre")
                                ),
                                "%"
                                        + req.getGenre()
                                        .trim()
                                        .toLowerCase()
                                        + "%"
                        )
                );
            }

            if (isNotBlank(req.getEra())) {

                predicates.add(
                        cb.like(
                                cb.lower(
                                        root.get("era")
                                ),
                                "%"
                                        + req.getEra()
                                        .trim()
                                        .toLowerCase()
                                        + "%"
                        )
                );
            }

            if (isNotBlank(req.getMood())) {

                predicates.add(
                        cb.like(
                                cb.lower(
                                        root.get("mood")
                                ),
                                "%"
                                        + req.getMood()
                                        .trim()
                                        .toLowerCase()
                                        + "%"
                        )
                );
            }

            if (isNotBlank(req.getArtist())) {

                predicates.add(
                        cb.like(
                                cb.lower(
                                        root.get("artist")
                                ),
                                "%"
                                        + req.getArtist()
                                        .trim()
                                        .toLowerCase()
                                        + "%"
                        )
                );
            }

            if (strict || predicates.size() <= 2) {

                return cb.and(
                        predicates.toArray(
                                new Predicate[0]
                        )
                );

            } else {

                Predicate enabled =
                        cb.isTrue(
                                root.get("enabled")
                        );

                List<Predicate> criteria =
                        predicates.subList(
                                1,
                                predicates.size()
                        );

                return cb.and(
                        enabled,
                        cb.or(
                                criteria.toArray(
                                        new Predicate[0]
                                )
                        )
                );
            }
        };
    }

    private boolean isNotBlank(String str) {
        return str != null
                && !str.trim().isEmpty();
    }

    /**
     * Search live online music API on demand.
     *
     * Newly discovered songs are saved into MySQL.
     */
    @Transactional
    public List<SongResponse> searchOnlineMusicApi(
            String query
    ) {

        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }

        try {

            String cleanQuery =
                    cleanQueryForSearch(query);

            if (cleanQuery.isBlank()) {
                cleanQuery = query.trim();
            }

            String encodedQuery =
                    URLEncoder.encode(
                            cleanQuery,
                            StandardCharsets.UTF_8
                    );

            String url =
                    "https://www.jiosaavn.com/api.php"
                            + "?__call=autocomplete.get"
                            + "&_marker=0"
                            + "&query="
                            + encodedQuery
                            + "&ctx=web6dot0";

            HttpHeaders headers =
                    new HttpHeaders();

            headers.set(
                    "User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                            + "AppleWebKit/537.36 "
                            + "(KHTML, like Gecko) "
                            + "Chrome/120.0.0.0 "
                            + "Safari/537.36"
            );

            headers.set(
                    "Accept",
                    "application/json, text/plain, */*"
            );

            HttpEntity<String> entity =
                    new HttpEntity<>(headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            String.class
                    );

            if (response.getStatusCode().is2xxSuccessful()
                    && response.getBody() != null) {

                JsonNode root =
                        objectMapper.readTree(
                                response.getBody()
                        );

                List<Song> fetchedSongs =
                        new ArrayList<>();

                Set<String> seenUrls =
                        new HashSet<>();

                // 1. topquery.data
                JsonNode topqueryNode =
                        root.path("topquery")
                                .path("data");

                if (topqueryNode.isArray()
                        && topqueryNode.size() > 0) {

                    for (JsonNode item :
                            topqueryNode) {

                        Song s =
                                parseSaavnSong(item);

                        if (s != null
                                && s.getAudioUrl() != null
                                && seenUrls.add(
                                        s.getAudioUrl()
                                )) {

                            fetchedSongs.add(s);
                        }
                    }
                }

                // 2. songs.data
                JsonNode songsNode =
                        root.path("songs")
                                .path("data");

                if (songsNode.isArray()
                        && songsNode.size() > 0) {

                    for (JsonNode item :
                            songsNode) {

                        Song s =
                                parseSaavnSong(item);

                        if (s != null
                                && s.getAudioUrl() != null
                                && seenUrls.add(
                                        s.getAudioUrl()
                                )) {

                            fetchedSongs.add(s);
                        }
                    }
                }

                if (!fetchedSongs.isEmpty()) {

                    List<Song> savedList =
                            new ArrayList<>();

                    for (Song s :
                            fetchedSongs) {

                        Optional<Song> existing =
                                songRepository
                                        .findByAudioUrl(
                                                s.getAudioUrl()
                                        );

                        if (existing.isPresent()) {

                            savedList.add(
                                    existing.get()
                            );

                        } else {

                            try {

                                savedList.add(
                                        songRepository.save(s)
                                );

                            } catch (Exception ex) {

                                log.warn(
                                        "Failed saving online song {}: {}",
                                        s.getTitle(),
                                        ex.getMessage()
                                );

                                savedList.add(s);
                            }
                        }
                    }

                    return savedList.stream()
                            .map(SongResponse::new)
                            .collect(Collectors.toList());
                }
            }

        } catch (Exception e) {

            log.warn(
                    "Online music API search error for query {}: {}",
                    query,
                    e.getMessage()
            );
        }

        return Collections.emptyList();
    }

    /**
     * Parse JioSaavn song response.
     */
    private Song parseSaavnSong(
            JsonNode item
    ) {

        try {

            JsonNode moreInfo =
                    item.path("more_info");

            String vlink =
                    moreInfo.path("vlink")
                            .asText(null);

            if (vlink == null
                    || vlink.isBlank()
                    || !vlink.startsWith("http")) {

                return null;
            }

            String title =
                    HtmlUtils.htmlUnescape(
                            item.path("title")
                                    .asText("Unknown Title")
                    );

            String album =
                    HtmlUtils.htmlUnescape(
                            item.path("album")
                                    .asText("Single")
                    );

            String artist =
                    HtmlUtils.htmlUnescape(
                            moreInfo.path("primary_artists")
                                    .asText("Various Artists")
                    );

            String language =
                    HtmlUtils.htmlUnescape(
                            moreInfo.path("language")
                                    .asText("Hindi")
                    );

            if (language != null
                    && !language.isEmpty()) {

                language =
                        language.substring(0, 1)
                                .toUpperCase()
                                + language.substring(1)
                                .toLowerCase();
            }

            String image =
                    item.path("image")
                            .asText("");

            if (image.contains("-50x50.jpg")) {

                image =
                        image.replace(
                                "-50x50.jpg",
                                "-500x500.jpg"
                        );
            }

            String genre = "Trending";
            String era = "Modern";
            String mood = "Energetic";

            String lowerTitle =
                    (title
                            + " "
                            + album
                            + " "
                            + artist)
                            .toLowerCase(Locale.ROOT);

            if (lowerTitle.contains("chhath")
                    || lowerTitle.contains("puja")) {

                genre = "Chhath Puja";
                mood = "Devotional";
                era = "Classic";

            } else if (lowerTitle.contains("chalisa")
                    || lowerTitle.contains("bhajan")
                    || lowerTitle.contains("aarti")
                    || lowerTitle.contains("shiva")
                    || lowerTitle.contains("ram")
                    || lowerTitle.contains("krishna")) {

                genre = "Bhajan / Devotional";
                mood = "Devotional";

            } else if (lowerTitle.contains("dj")
                    || lowerTitle.contains("remix")
                    || lowerTitle.contains("dance")) {

                genre = "DJ Remix";
                mood = "Energetic";

            } else if ("Bhojpuri"
                    .equalsIgnoreCase(language)) {

                genre = "Bhojpuri Trending";

            } else if ("Haryanvi"
                    .equalsIgnoreCase(language)) {

                genre = "Haryanvi Hits";
            }

            String tags =
                    (
                            title
                                    + ", "
                                    + artist
                                    + ", "
                                    + language
                                    + ", "
                                    + genre
                                    + ", online, saavn"
                    ).toLowerCase(Locale.ROOT);

            return new Song(
                    title,
                    artist,
                    album,
                    language,
                    genre,
                    era,
                    mood,
                    tags,
                    vlink,
                    image,
                    240,
                    true
            );

        } catch (Exception e) {

            return null;
        }
    }

    /**
     * Download complete MP3 song using yt-dlp.
     */
    @Transactional
    public SongResponse downloadCompleteSong(
            String query
    ) {

        if (query == null || query.isBlank()) {
            return null;
        }

        try {

            String cleanQuery =
                    cleanQueryForSearch(query);

            if (cleanQuery.isBlank()) {
                cleanQuery = query.trim();
            }

            String cleanName =
                    cleanQuery
                            .toLowerCase(Locale.ROOT)
                            .replaceAll(
                                    "[^a-z0-9]+",
                                    "-"
                            )
                            .replaceAll(
                                    "^-|-$",
                                    ""
                            );

            if (cleanName.length() > 40) {
                cleanName =
                        cleanName.substring(
                                0,
                                40
                        );
            }

            String filename =
                    cleanName + ".mp3";

            Path staticMusicDir =
                    Paths.get(
                            "src/main/resources/static/music"
                    );

            Files.createDirectories(
                    staticMusicDir
            );

            Path targetStatic =
                    staticMusicDir.resolve(
                            filename
                    );

            Path targetClasses =
                    Paths.get(
                            "target/classes/static/music"
                    ).resolve(filename);

            if (!Files.exists(targetStatic)) {

                log.info(
                        "Downloading complete full song via yt-dlp: {}",
                        cleanQuery
                );

                ProcessBuilder pb =
                        new ProcessBuilder(
                                "python",
                                "-m",
                                "yt_dlp",
                                "--extract-audio",
                                "--audio-format",
                                "mp3",
                                "--audio-quality",
                                "0",
                                "ytsearch1:" + cleanQuery,
                                "-o",
                                targetStatic
                                        .toAbsolutePath()
                                        .toString()
                                        .replace(
                                                ".mp3",
                                                ".%(ext)s"
                                        )
                        );

                pb.redirectErrorStream(true);

                Process process =
                        pb.start();

                boolean finished =
                        process.waitFor(
                                25,
                                java.util.concurrent.TimeUnit.SECONDS
                        );

                if (!finished
                        || process.exitValue() != 0
                        || !Files.exists(targetStatic)) {

                    log.warn(
                            "yt-dlp download failed or timed out for query: {}",
                            cleanQuery
                    );

                    return null;
                }
            }

            if (Files.exists(targetStatic)
                    && Files.exists(
                            targetClasses.getParent()
                    )) {

                Files.copy(
                        targetStatic,
                        targetClasses,
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING
                );
            }

            String audioUrl =
                    "/music/" + filename;

            Optional<Song> existing =
                    songRepository.findByAudioUrl(
                            audioUrl
                    );

            if (existing.isPresent()) {
                return new SongResponse(
                        existing.get()
                );
            }

            Song newSong =
                    new Song(
                            cleanQuery,
                            "Various Artists",
                            "Complete Hits",
                            "Hindi",
                            "Complete Song",
                            "Modern",
                            "Energetic",
                            cleanQuery.toLowerCase(Locale.ROOT)
                                    + ", complete, full",
                            audioUrl,
                            "/images/music/retro-romance.jpg",
                            260,
                            true
                    );

            Song saved =
                    songRepository.save(newSong);

            return new SongResponse(saved);

        } catch (Exception e) {

            log.warn(
                    "Complete song on-demand download error for {}: {}",
                    query,
                    e.getMessage()
            );

            return null;
        }
    }

    /**
     * Clean natural-language command before database/API search.
     */
    private String cleanQueryForSearch(
            String command
    ) {

        if (command == null) {
            return "";
        }

        return command
                .replaceAll(
                        "(?i)\\bnushrat\\b",
                        "nusrat"
                )
                .replaceAll(
                        "(?i)\\b(play|song|songs|gaana|geet|music|please|karo|bajaao|bajao|chalaao|chalao|suno|sunao|search|find|dhoondho|baja|chala|sunaye)\\b",
                        ""
                )
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }
}