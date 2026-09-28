package com.aditya.portfolio.controller;

import com.aditya.portfolio.entity.ContactMessage;
import com.aditya.portfolio.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ContactService contactService;

    public AdminController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    @PatchMapping("/messages/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        boolean updated = contactService.updateStatus(id, status);
        if (updated) {
            return ResponseEntity.ok(Map.of("success", true, "status", status));
        }
        return ResponseEntity.notFound().build();
    }
}
