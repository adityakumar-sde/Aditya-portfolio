package com.aditya.portfolio.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "songs", indexes = {
    @Index(name = "idx_songs_language", columnList = "language"),
    @Index(name = "idx_songs_era", columnList = "era"),
    @Index(name = "idx_songs_mood", columnList = "mood"),
    @Index(name = "idx_songs_artist", columnList = "artist"),
    @Index(name = "idx_songs_enabled", columnList = "enabled")
})
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 150)
    private String artist;

    @Column(length = 150)
    private String album;

    @Column(nullable = false, length = 80)
    private String language;

    @Column(length = 80)
    private String genre;

    @Column(length = 60)
    private String era; // e.g. "Old", "Classic", "90s", "Modern"

    @Column(length = 60)
    private String mood; // e.g. "Romantic", "Energetic", "Calm", "Devotional", "Nostalgic"

    @Column(length = 500)
    private String tags;

    @Column(nullable = false, length = 1000)
    private String audioUrl;

    @Column(length = 1000)
    private String coverUrl;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Song() {
    }

    public Song(String title, String artist, String album, String language, String genre,
                String era, String mood, String tags, String audioUrl, String coverUrl,
                Integer durationSeconds, Boolean enabled) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.language = language;
        this.genre = genre;
        this.era = era;
        this.mood = mood;
        this.tags = tags;
        this.audioUrl = audioUrl;
        this.coverUrl = coverUrl;
        this.durationSeconds = durationSeconds;
        this.enabled = (enabled != null) ? enabled : true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.enabled == null) {
            this.enabled = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getEra() {
        return era;
    }

    public void setEra(String era) {
        this.era = era;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}