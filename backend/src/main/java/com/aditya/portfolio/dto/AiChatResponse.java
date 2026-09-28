package com.aditya.portfolio.dto;

public class AiChatResponse {
    private String answer;
    private String source; // "llm" or "knowledge_base"

    public AiChatResponse(String answer, String source) {
        this.answer = answer;
        this.source = source;
    }

    public String getAnswer() { return answer; }
    public String getSource() { return source; }
}
