package com.launchcode.frozen_pixel_alchemy.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class BookingWebSocketController {

    @Autowired
    private SimpMessagingTemplate template;

    public void broadcastBookingUpdate(String message) {
        // Broadcast booking updates to all connected clients.
        template.convertAndSend("/topic/bookings", message);
    }
}