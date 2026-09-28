package com.aditya.portfolio.dto;

import java.util.Collections;
import java.util.List;

public class MusicCommandResponse {
    private boolean success;
    private String action; // PLAY, PAUSE, RESUME, NEXT, PREVIOUS, SEARCH
    private String message;
    private List<SongResponse> songs;

    public MusicCommandResponse() {
        this.songs = Collections.emptyList();
    }

    public MusicCommandResponse(boolean success, String action, String message, List<SongResponse> songs) {
        this.success = success;
        this.action = action;
        this.message = message;
        this.songs = (songs != null) ? songs : Collections.emptyList();
    }

    public static MusicCommandResponse of(String action, String message, List<SongResponse> songs) {
        return new MusicCommandResponse(true, action, message, songs);
    }

    public static MusicCommandResponse actionOnly(String action, String message) {
        return new MusicCommandResponse(true, action, message, Collections.emptyList());
    }

    public static MusicCommandResponse fail(String message) {
        return new MusicCommandResponse(false, "ERROR", message, Collections.emptyList());
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<SongResponse> getSongs() { return songs; }
    public void setSongs(List<SongResponse> songs) { this.songs = songs; }
}