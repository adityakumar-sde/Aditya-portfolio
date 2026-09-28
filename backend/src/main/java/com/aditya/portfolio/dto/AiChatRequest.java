package com.aditya.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {
    @NotBlank(message = "Query message cannot be blank")
    private String message;

    public AiChatRequest() {}
    public AiChatRequest(String message) { this.message = message; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
