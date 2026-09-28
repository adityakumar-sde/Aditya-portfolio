package com.aditya.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public class MusicCommandRequest {

    @NotBlank(message = "Command cannot be empty")
    private String command;

    public MusicCommandRequest() {}

    public MusicCommandRequest(String command) {
        this.command = command;
    }

    public String getCommand() { return command; }
    public void setCommand(String command) { this.command = command; }
}