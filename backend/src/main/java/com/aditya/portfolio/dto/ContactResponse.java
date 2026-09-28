package com.aditya.portfolio.dto;

public class ContactResponse {
    private boolean success;
    private String message;

    public ContactResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}
