package com.aditya.portfolio.dto;

public class MusicSearchRequest {
    private String language;
    private String genre;
    private String era;
    private String mood;
    private String artist;
    private String query;

    public MusicSearchRequest() {}

    public MusicSearchRequest(String language, String genre, String era, String mood, String artist, String query) {
        this.language = language;
        this.genre = genre;
        this.era = era;
        this.mood = mood;
        this.artist = artist;
        this.query = query;
    }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getEra() { return era; }
    public void setEra(String era) { this.era = era; }

    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }

    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}