package com.launchcode.frozen_pixel_alchemy.controllers;


import com.launchcode.frozen_pixel_alchemy.services.PexelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PexelsController {
    private final PexelsService pexelsService;
    @Autowired
    public PexelsController(PexelsService pexelsService) {
        this.pexelsService = pexelsService;
    }
    /**
     * Endpoint to fetch curated images from Pexels API.
     *
     * @return JSON response containing curated images.
     */
    // This endpoint fetches curated images from the Pexels API.

    @GetMapping("api/pexels")
    public String getPexelsData() {
        return pexelsService.getCuratedImages();
    }
}
