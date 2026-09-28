package com.aditya.portfolio;

import com.aditya.portfolio.dto.*;
import com.aditya.portfolio.entity.Song;
import com.aditya.portfolio.repository.SongRepository;
import com.aditya.portfolio.service.MusicService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MusicServiceTest {

    @Mock
    private SongRepository songRepository;

    @InjectMocks
    private MusicService musicService;

    private Song bhojpuriOldSong;
    private Song hindiOldRomanticSong;
    private Song punjabiEnergeticSong;

    @BeforeEach
    void setUp() {
        bhojpuriOldSong = new Song(
            "Chalat Musafir", "Bhojpuri Legends", "Classic Album",
            "Bhojpuri", "Classic", "Old", "Romantic", "bihari",
            "/music/bhojpuri.wav", "/images/bhojpuri.jpg", 240, true
        );
        bhojpuriOldSong.setId(1L);

        hindiOldRomanticSong = new Song(
            "Pal Pal Dil Ke Paas", "Kishore Kumar", "Blackmail",
            "Hindi", "Classic", "Old", "Romantic", "hindi, 70s",
            "/music/hindi.wav", "/images/hindi.jpg", 300, true
        );
        hindiOldRomanticSong.setId(2L);

        punjabiEnergeticSong = new Song(
            "Mundian To Bach Ke", "Panjabi MC", "Legalised",
            "Punjabi", "Bhangra", "90s", "Energetic", "dance",
            "/music/punjabi.wav", "/images/punjabi.jpg", 220, true
        );
        punjabiEnergeticSong.setId(3L);
    }

    @Test
    @DisplayName("Default Preference returns Bhojpuri old songs")
    void testGetDefaultPreferenceSongs() {
        when(songRepository.findDefaultPreferredSongs("Bhojpuri"))
                .thenReturn(List.of(bhojpuriOldSong));

        List<SongResponse> result = musicService.getDefaultPreferenceSongs();
        assertFalse(result.isEmpty());
        assertEquals("Bhojpuri", result.get(0).getLanguage());
        assertEquals("Old", result.get(0).getEra());
    }

    @Test
    @DisplayName("Command with no specifics returns Default Bhojpuri preference")
    void testCommandGenericPlay() {
        when(songRepository.findDefaultPreferredSongs("Bhojpuri"))
                .thenReturn(List.of(bhojpuriOldSong));

        MusicCommandResponse resp = musicService.processCommand("play something");
        assertTrue(resp.isSuccess());
        assertEquals("PLAY", resp.getAction());
        assertFalse(resp.getSongs().isEmpty());
        assertEquals("Bhojpuri", resp.getSongs().get(0).getLanguage());
    }

    @Test
    @DisplayName("Command 'pause' returns PAUSE action")
    void testCommandPause() {
        MusicCommandResponse resp = musicService.processCommand("pause");
        assertTrue(resp.isSuccess());
        assertEquals("PAUSE", resp.getAction());
    }

    @Test
    @DisplayName("Command 'resume' returns RESUME action")
    void testCommandResume() {
        MusicCommandResponse resp = musicService.processCommand("resume");
        assertTrue(resp.isSuccess());
        assertEquals("RESUME", resp.getAction());
    }

    @Test
    @DisplayName("Command 'next' returns NEXT action")
    void testCommandNext() {
        MusicCommandResponse resp = musicService.processCommand("next song");
        assertTrue(resp.isSuccess());
        assertEquals("NEXT", resp.getAction());
    }

    @Test
    @DisplayName("Command 'previous' returns PREVIOUS action")
    void testCommandPrevious() {
        MusicCommandResponse resp = musicService.processCommand("previous song");
        assertTrue(resp.isSuccess());
        assertEquals("PREVIOUS", resp.getAction());
    }

    @Test
    @DisplayName("Explicit language Hindi overrides default Bhojpuri preference")
    void testCommandExplicitHindi() {
        when(songRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(hindiOldRomanticSong));

        MusicCommandResponse resp = musicService.processCommand("Play an old Hindi romantic song");
        assertTrue(resp.isSuccess());
        assertEquals("PLAY", resp.getAction());
        assertFalse(resp.getSongs().isEmpty());
        assertEquals("Hindi", resp.getSongs().get(0).getLanguage());
    }

    @Test
    @DisplayName("Get next song returns next track or loops")
    void testGetNextSong() {
        when(songRepository.findFirstByEnabledTrueAndIdGreaterThanOrderByIdAsc(1L))
                .thenReturn(Optional.of(hindiOldRomanticSong));

        SongResponse next = musicService.getNextSong(1L);
        assertNotNull(next);
        assertEquals(2L, next.getId());
    }
}