package com.aditya.portfolio.controller;

import com.aditya.portfolio.dto.AiChatRequest;
import com.aditya.portfolio.dto.AiChatResponse;
import com.aditya.portfolio.service.AiAssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private final AiAssistantService aiService;

    public AiAssistantController(AiAssistantService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> askQuestion(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiService.getAnswer(request.getMessage());
        return ResponseEntity.ok(response);
    }
}
