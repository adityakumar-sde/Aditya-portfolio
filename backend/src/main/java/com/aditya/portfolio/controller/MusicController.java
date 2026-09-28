package com.aditya.portfolio.controller;

import com.aditya.portfolio.dto.*;
import com.aditya.portfolio.service.MusicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/music")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MusicController {

    private final MusicService musicService;

    public MusicController(MusicService musicService) {
        this.musicService = musicService;
    }

    /**
     * GET /api/music/default
     * Returns top default preference songs (First priority: Chhath Puja geet).
     */
    @GetMapping("/default")
    public ResponseEntity<MusicListResponse> getDefaultMusic() {
        List<SongResponse> songs = musicService.getDefaultPreferenceSongs();
        return ResponseEntity.ok(new MusicListResponse(songs, "Default preference: Sharda Sinha Chhath Puja Classics"));
    }

    /**
     * GET /api/music/today
     * Returns dynamically rotated Song of the Day (updates day-by-day).
     */
    @GetMapping("/today")
    public ResponseEntity<SongResponse> getSongOfTheDay() {
        SongResponse song = musicService.getSongOfTheDay();
        return ResponseEntity.ok(song);
    }

    /**
     * GET /api/music/search
     * Flexible search by language, genre, era, mood, artist, query.
     */
    @GetMapping("/search")
    public ResponseEntity<MusicListResponse> searchMusic(
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String era,
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) String artist,
            @RequestParam(required = false) String query) {

        MusicSearchRequest request = new MusicSearchRequest(language, genre, era, mood, artist, query);
        List<SongResponse> songs = musicService.searchMusic(request);
        return ResponseEntity.ok(new MusicListResponse(songs, "Found " + songs.size() + " matching songs"));
    }

    /**
     * GET /api/music/online
     * Dynamically search online music API, stream preview MP3s, and auto-save into MySQL.
     */
    @GetMapping("/online")
    public ResponseEntity<MusicListResponse> searchOnline(@RequestParam String query) {
        List<SongResponse> songs = musicService.searchOnlineMusicApi(query);
        return ResponseEntity.ok(new MusicListResponse(songs, "Online query results for: " + query));
    }

    /**
     * GET /api/music/{id}
     * Returns single song metadata by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SongResponse> getSongById(@PathVariable Long id) {
        SongResponse song = musicService.getSongById(id);
        return ResponseEntity.ok(song);
    }

    /**
     * GET /api/music/next
     * Returns next song in catalog.
     */
    @GetMapping("/next")
    public ResponseEntity<SongResponse> getNextSong(@RequestParam(required = false) Long currentId) {
        SongResponse song = musicService.getNextSong(currentId);
        return ResponseEntity.ok(song);
    }

    /**
     * GET /api/music/previous
     * Returns previous song in catalog.
     */
    @GetMapping("/previous")
    public ResponseEntity<SongResponse> getPreviousSong(@RequestParam(required = false) Long currentId) {
        SongResponse song = musicService.getPreviousSong(currentId);
        return ResponseEntity.ok(song);
    }

    /**
     * GET /api/music/all
     * Returns all enabled songs.
     */
    @GetMapping("/all")
    public ResponseEntity<MusicListResponse> getAllSongs() {
        List<SongResponse> songs = musicService.getAllEnabledSongs();
        return ResponseEntity.ok(new MusicListResponse(songs, "All active library tracks"));
    }

    /**
     * POST /api/music/command
     * Natural language command interpretation for AI assistant & UI.
     */
    @PostMapping("/command")
    public ResponseEntity<MusicCommandResponse> processCommand(@Valid @RequestBody MusicCommandRequest request) {
        MusicCommandResponse response = musicService.processCommand(request.getCommand());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/music
     * Add new track to catalog.
     */
    @PostMapping
    public ResponseEntity<SongResponse> createSong(@Valid @RequestBody SongRequest request) {
        SongResponse response = musicService.createSong(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /api/music/{id}
     * Update existing song record.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SongResponse> updateSong(@PathVariable Long id, @Valid @RequestBody SongRequest request) {
        SongResponse response = musicService.updateSong(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/music/upload
     * Upload an actual MP3/audio file and immediately make it available to play.
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SongResponse> uploadSong(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "artist", required = false) String artist,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "era", required = false) String era,
            @RequestParam(value = "mood", required = false) String mood) throws IOException {

        SongResponse response = musicService.uploadSongFile(file, title, artist, language, era, mood);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}