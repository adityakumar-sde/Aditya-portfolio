package com.aditya.portfolio;

import com.aditya.portfolio.controller.MusicController;
import com.aditya.portfolio.dto.*;
import com.aditya.portfolio.service.MusicService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MusicController.class)
@AutoConfigureMockMvc(addFilters = false)
class MusicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MusicService musicService;

    @Test
    @DisplayName("GET /api/music/default returns 200 with songs")
    void testGetDefaultMusic() throws Exception {
        SongResponse sample = new SongResponse();
        sample.setId(1L);
        sample.setTitle("Chalat Musafir");
        sample.setLanguage("Bhojpuri");
        sample.setEra("Old");

        when(musicService.getDefaultPreferenceSongs()).thenReturn(List.of(sample));

        mockMvc.perform(get("/api/music/default"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.songs[0].title").value("Chalat Musafir"))
                .andExpect(jsonPath("$.songs[0].language").value("Bhojpuri"));
    }

    @Test
    @DisplayName("GET /api/music/search returns 200")
    void testSearchMusic() throws Exception {
        SongResponse sample = new SongResponse();
        sample.setId(2L);
        sample.setTitle("Pal Pal Dil Ke Paas");
        sample.setLanguage("Hindi");

        when(musicService.searchMusic(any(MusicSearchRequest.class))).thenReturn(List.of(sample));

        mockMvc.perform(get("/api/music/search")
                        .param("language", "Hindi")
                        .param("era", "Old"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.songs[0].title").value("Pal Pal Dil Ke Paas"));
    }

    @Test
    @DisplayName("POST /api/music/command returns action and songs")
    void testCommandEndpoint() throws Exception {
        MusicCommandRequest req = new MusicCommandRequest("Play an old Hindi song");
        MusicCommandResponse resp = new MusicCommandResponse(true, "PLAY", "Playing old Hindi music", List.of());

        when(musicService.processCommand("Play an old Hindi song")).thenReturn(resp);

        mockMvc.perform(post("/api/music/command")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.action").value("PLAY"));
    }
}