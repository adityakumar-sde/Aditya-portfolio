package com.aditya.portfolio.service;

import com.aditya.portfolio.dto.ContactRequest;
import com.aditya.portfolio.dto.ContactResponse;
import com.aditya.portfolio.entity.ContactMessage;
import com.aditya.portfolio.repository.ContactMessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ContactService {

    private final ContactMessageRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public ContactService(ContactMessageRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public ContactResponse saveMessage(ContactRequest request) {
        ContactMessage entity = new ContactMessage(
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );
        ContactMessage saved = repository.save(entity);

        // Realtime notification push to administrative channel
        try {
            messagingTemplate.convertAndSend("/topic/admin/messages", saved);
        } catch (Exception e) {
            // Non-blocking if websocket client is disconnected
        }

        return new ContactResponse(true, "Your inquiry has been received and persisted successfully.");
    }

    public List<ContactMessage> getAllMessages() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public boolean updateStatus(Long id, String status) {
        return repository.findById(id).map(msg -> {
            msg.setStatus(status);
            repository.save(msg);
            return true;
        }).orElse(false);
    }
}
