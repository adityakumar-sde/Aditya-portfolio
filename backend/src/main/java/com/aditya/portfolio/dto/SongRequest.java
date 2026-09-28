package com.aditya.portfolio.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SongRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 150, message = "Artist must not exceed 150 characters")
    private String artist;

    @Size(max = 150, message = "Album must not exceed 150 characters")
    private String album;

    @NotBlank(message = "Language is required")
    @Size(max = 80, message = "Language must not exceed 80 characters")
    private String language;

    @Size(max = 80, message = "Genre must not exceed 80 characters")
    private String genre;

    @Size(max = 60, message = "Era must not exceed 60 characters")
    private String era;

    @Size(max = 60, message = "Mood must not exceed 60 characters")
    private String mood;

    @Size(max = 500, message = "Tags must not exceed 500 characters")
    private String tags;

    @NotBlank(message = "Audio URL is required")
    @Size(max = 1000, message = "Audio URL must not exceed 1000 characters")
    private String audioUrl;

    @Size(max = 1000, message = "Cover URL must not exceed 1000 characters")
    private String coverUrl;

    @Min(value = 1, message = "Duration must be positive")
    private Integer durationSeconds;

    private Boolean enabled = true;

    public SongRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getEra() { return era; }
    public void setEra(String era) { this.era = era; }

    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}