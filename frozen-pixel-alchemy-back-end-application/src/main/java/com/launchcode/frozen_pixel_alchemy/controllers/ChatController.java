package com.launchcode.frozen_pixel_alchemy.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.launchcode.frozen_pixel_alchemy.models.dto.ChatRequestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping(value = "/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174","http://localhost:3000"})
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    // The URL for the Gemini API endpoint
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=";

    @PostMapping
    public ResponseEntity<?> getGeminiReply(@RequestBody ChatRequestDTO payload) {
        String question = payload.getMessage();

        if (question == null || question.trim().isEmpty()) {
            logger.warn("Received empty message input");
            return ResponseEntity.badRequest().body(Map.of("error", "Message must not be empty"));
        }

        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            logger.error("Gemini API key is not configured");
            return ResponseEntity.internalServerError().body(Map.of("error", "AI service not configured"));
        }

        logger.info("User asked: {}", question);

        try {
            String reply = getReplyFromGemini(question);
            logger.info("Gemini replied successfully.");
            return ResponseEntity.ok(Map.of("response", reply));
        } catch (Exception e) {
            logger.error("Error calling Gemini API: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get response from AI: " + e.getMessage()));
        }
    }

    private String getReplyFromGemini(String question) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String requestUrl = GEMINI_API_URL + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = String.format(
                "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}]}",
                question.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "")
        );

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);
        logger.debug("Calling Gemini API with URL: {}", requestUrl);
        logger.debug("Request body: {}", requestBody);

        String apiResponse = restTemplate.postForObject(requestUrl, requestEntity, String.class);
        logger.debug("Gemini API response: {}", apiResponse);

        if (apiResponse == null) {
            throw new RuntimeException("No response from Gemini API");
        }

        // Use Jackson to parse the response safely
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(apiResponse);
        JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");

        if (textNode.isMissingNode() || textNode.isNull()) {
            throw new RuntimeException("No text in Gemini response");
        }

        return textNode.asText();
    }
}