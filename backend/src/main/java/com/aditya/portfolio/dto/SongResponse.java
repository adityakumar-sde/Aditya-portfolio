package com.aditya.portfolio.dto;

import com.aditya.portfolio.entity.Song;

public class SongResponse {
    private Long id;
    private String title;
    private String artist;
    private String album;
    private String language;
    private String genre;
    private String era;
    private String mood;
    private String tags;
    private String audioUrl;
    private String coverUrl;
    private Integer durationSeconds;
    private Boolean enabled;

    public SongResponse() {}

    public SongResponse(Song song) {
        if (song != null) {
            this.id = song.getId();
            this.title = song.getTitle();
            this.artist = song.getArtist();
            this.album = song.getAlbum();
            this.language = song.getLanguage();
            this.genre = song.getGenre();
            this.era = song.getEra();
            this.mood = song.getMood();
            this.tags = song.getTags();
            this.audioUrl = song.getAudioUrl();
            this.coverUrl = song.getCoverUrl();
            this.durationSeconds = song.getDurationSeconds();
            this.enabled = song.getEnabled();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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