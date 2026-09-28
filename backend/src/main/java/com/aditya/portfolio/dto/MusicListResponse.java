package com.aditya.portfolio.dto;

import java.util.Collections;
import java.util.List;

public class MusicListResponse {
    private List<SongResponse> songs;
    private int total;
    private String message;

    public MusicListResponse() {
        this.songs = Collections.emptyList();
        this.total = 0;
    }

    public MusicListResponse(List<SongResponse> songs) {
        this.songs = (songs != null) ? songs : Collections.emptyList();
        this.total = this.songs.size();
    }

    public MusicListResponse(List<SongResponse> songs, String message) {
        this.songs = (songs != null) ? songs : Collections.emptyList();
        this.total = this.songs.size();
        this.message = message;
    }

    public List<SongResponse> getSongs() { return songs; }
    public void setSongs(List<SongResponse> songs) {
        this.songs = songs;
        this.total = (songs != null) ? songs.size() : 0;
    }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}