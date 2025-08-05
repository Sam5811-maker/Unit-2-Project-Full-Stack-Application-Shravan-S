package com.launchcode.frozen_pixel_alchemy.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.launchcode.frozen_pixel_alchemy.models.dto.ChatRequestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=";

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    @PostMapping
    public ResponseEntity<?> getGeminiReply(@RequestBody ChatRequestDTO payload) {
        String question = payload.getMessage();

        if (isBlank(question)) {
            logger.warn("Received empty message input");
            return ResponseEntity.badRequest().body(Map.of("error", "Message must not be empty"));
        }

        logger.info("User asked: {}", question);

        if (isBlank(geminiApiKey)) {
            logger.warn("Gemini API key missing, using mock response");
            return ResponseEntity.ok(Map.of("response", getMockResponse(question)));
        }

        try {
            String reply = fetchGeminiResponse(question);
            return ResponseEntity.ok(Map.of("response", reply));
        } catch (Exception e) {
            logger.warn("Gemini API call failed, using mock response: {}", e.getMessage());
            // Fallback to mock response when Gemini API fails
            String mockResponse = getMockResponse(question);
            return ResponseEntity.ok(Map.of("response", mockResponse));
        }
    }

    private String fetchGeminiResponse(String question) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        String sanitizedPrompt = question.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
        String body = String.format("{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}]}", sanitizedPrompt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String response = restTemplate.postForObject(GEMINI_API_URL + geminiApiKey, new HttpEntity<>(body, headers), String.class);
        if (response == null) throw new RuntimeException("No response from Gemini");

        JsonNode root = new ObjectMapper().readTree(response);
        return root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText("");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String getMockResponse(String question) {
        String q = question.toLowerCase();
        if (q.contains("price") || q.contains("cost") || q.contains("how much")) {
            return "Portrait sessions start at $150, weddings at $800, nature shoots at $200. Contact us for a full quote!";
        } else if (q.contains("booking") || q.contains("schedule") || q.contains("appointment")) {
            return "Book directly from our booking page—choose a photographer, date, and time. We recommend booking at least 2 weeks in advance.";
        } else if (q.contains("photographer") || q.contains("team")) {
            return "Our team includes Emily, Michael, and Sarah—each with unique specialties in nature, weddings, and urban shoots.";
        } else if (q.contains("location") || q.contains("where")) {
            return "We shoot both in studio and on location—parks, beaches, cityscapes. Let us know where you'd love to be captured!";
        } else if (q.contains("hello") || q.contains("hi") || q.contains("help")) {
            return "Hi! I’m your assistant from Frozen Pixel Alchemy. I can help with booking, services, and pricing—ask away!";
        } else {
            return "Thanks for your question! I'm here to assist with services, pricing, and our talented photographers.";
        }
    }
}
