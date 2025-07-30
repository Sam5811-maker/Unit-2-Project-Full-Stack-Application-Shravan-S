package com.launchcode.frozen_pixel_alchemy.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Frozen Pixel Alchemy backend is running!";
    }
}
