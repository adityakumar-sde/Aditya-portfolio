package com.aditya.portfolio.service;

import com.aditya.portfolio.dto.AiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiAssistantService {

    @Value("${app.llm.api-key:}")
    private String apiKey;

    public AiChatResponse getAnswer(String query) {
        // If external LLM API key is configured, invoke LLM; otherwise graceful verified knowledge base
        if (apiKey != null && !apiKey.isBlank()) {
            // External LLM gateway placeholder
            return new AiChatResponse(resolveFromKnowledgeBase(query), "llm");
        }
        return new AiChatResponse(resolveFromKnowledgeBase(query), "knowledge_base");
    }

    private String resolveFromKnowledgeBase(String query) {
        String q = query.toLowerCase();

        if (q.contains("spring") || q.contains("backend") || q.contains("java")) {
            return "Aditya specializes in enterprise backend development with Java 17, Spring Boot, Spring Security, and JPA/Hibernate. In his role at TAM INFOSOFT and in the Infosoft CRM project, he engineered micro-services, REST APIs, batch processing jobs, and real-time WebSocket communication pipelines connected to MySQL and Redis.";
        }
        if (q.contains("tech") || q.contains("stack") || q.contains("skill")) {
            return "Aditya's curated engineering stack includes: Backend (Java, Spring Boot, Spring Security, Microservices, REST APIs, Hibernate/JPA), Frontend (React, TypeScript, HTML5, CSS3/Tailwind), Data (MySQL, PostgreSQL, MongoDB, Redis), Realtime (WebSocket, Socket.IO), AI (Generative AI, LLMs, Prompt Engineering, AI APIs, n8n), and DevOps (Docker, Jenkins, Git/GitHub, Linux).";
        }
        if (q.contains("project") || q.contains("crm") || q.contains("work")) {
            return "Aditya's premier featured work is INFOSOFT CRM, an enterprise CRM and real-time agent management platform built with Java, Spring Boot, React, MySQL, and WebSocket. It features live agent monitoring, batch lead ingestion, role management, and telephony event tracking.";
        }
        if (q.contains("realtime") || q.contains("websocket")) {
            return "Aditya builds realtime systems utilizing WebSocket protocols and STOMP message brokers. In Infosoft CRM, realtime capabilities power zero-lag agent status sync, incoming telephony alerts, and live dashboard notifications without HTTP polling overhead.";
        }
        if (q.contains("learn") || q.contains("explore") || q.contains("now")) {
            return "Under his 'Engineering Now' focus, Aditya is actively building with Java, Spring Boot, React, MySQL, Redis, and Docker; exploring Generative AI, LLMs, AI APIs, and n8n visual automation; and diving deeper into microservices architectures, distributed system design, and cloud-native solutions.";
        }
        if (q.contains("education") || q.contains("degree") || q.contains("college")) {
            return "Aditya holds a Master of Computer Application (MCA) from Global Group of Institutes, Amritsar (2023–2025, GPA 7.29), a Bachelor of Science in Mathematics Honours from LNMU University, Darbhanga (2019–2022, 73.13%), and completed Intermediate (12th) from RKC+2 High School, Begusarai (2017–2019, 63.8%).";
        }
        if (q.contains("experience") || q.contains("tam") || q.contains("thinknext")) {
            return "Aditya currently works as a Full Stack Engineer at TAM INFOSOFT in Delhi, India, developing enterprise CRM and agent management platforms using Java, Spring Boot, React, MySQL, and WebSocket. Previously, he worked as a Java Developer / Full Stack Intern at ThinkNext Technology.";
        }
        if (q.contains("contact") || q.contains("email") || q.contains("hire")) {
            return "You can reach Aditya directly via email at adityakumarbju121@gmail.com. He is located in Delhi, India, and is open to discussing software engineering roles, backend architectures, and high-impact full-stack opportunities.";
        }
        return "I'm Aditya's AI Assistant. Aditya Kumar is a Software Engineer based in Delhi, India, specializing in Java, Spring Boot, React, MySQL, Realtime WebSocket systems, and AI-powered workflow automation. Feel free to ask about his backend experience, the Infosoft CRM architecture, tech stack, or education!";
    }
}
