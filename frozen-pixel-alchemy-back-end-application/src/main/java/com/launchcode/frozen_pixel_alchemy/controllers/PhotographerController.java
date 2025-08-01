package com.launchcode.frozen_pixel_alchemy.controllers;

import com.launchcode.frozen_pixel_alchemy.respositories.PhotographerRepository;
import com.launchcode.frozen_pixel_alchemy.models.Photographer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/photographers")
public class PhotographerController {

    @Autowired
    PhotographerRepository photographerRepository;

    // Endpoint to get all photographers
    // URL: http://localhost:8080/api/photographers
    // Method: GET
    // Returns: List of all photographers in JSON format
    @GetMapping("")
    public ResponseEntity<?> getAllPhotographers() {
        List<Photographer> allPhotographers = photographerRepository.findAll();
        return new ResponseEntity<>(allPhotographers, HttpStatus.OK);
    }

    // Endpoint to get photographer details by ID
    // URL: http://localhost:8080/api/photographers/details/{photographerId}
    // Method: GET
    // Returns: HTML page with photographer details
    // Example: http://localhost:8080/api/photographers/details/1
    @GetMapping(value = "/details/{photographerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPhotographerById(@PathVariable(value = "photographerId") int photographerId) {
        Photographer currentPhotographer = photographerRepository.findById(photographerId)
                .orElse(null);
        if (currentPhotographer != null) {
            return new ResponseEntity<>(currentPhotographer, HttpStatus.OK);
        } else {
            String response = "Photographer with ID " + photographerId + " not found.";
            // Return a JSON response with the error message
            return new ResponseEntity<>(Collections.singletonMap("response", response), HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to add a new photographer
    // URL: http://localhost:8080/api/photographers/add
    // Method: POST
    // Parameters: firstName, lastName, bio (optional), profilePictureUrl (optional)
    // Returns: HTML page with confirmation of photographer addition
    // Example: http://localhost:8080/api/photographers/add?firstName=John&lastName=Doe&bio=Photographer+Bio&profilePictureUrl=http://example
    @PostMapping("/add")
    public ResponseEntity<?> createNewPhotographer(@RequestParam(value = "firstName") String firstName,
                                                   @RequestParam(value = "lastName") String lastName,
                                                   @RequestParam(value = "userId", required = false) String userId,
                                                   @RequestParam(value = "bio", required = false) String bio,
                                                   @RequestParam(value = "profilePictureUrl", required = false) String profilePictureUrl) {
        Photographer newPhotographer = new Photographer(firstName, lastName, null);
        newPhotographer.setBio("Default Bio"); // Set a default bio if not provided
        newPhotographer.setProfilePictureUrl("http://default-profile-picture.com/default.jpg"); // Set a default profile picture URL if not provided
        newPhotographer.setUserId(userId); // Set a user ID
        // Save the new photographer to the repository
        photographerRepository.save(newPhotographer);
        return new ResponseEntity<>(newPhotographer, HttpStatus.CREATED);
    }

    // Endpoint to update an existing photographer
    // URL: http://localhost:8080/api/photographers/update/{photographerId}
    // Method: PUT
    // Parameters: firstName, lastName, bio (optional), profilePictureUrl (optional)
    // Returns: HTML page with confirmation of photographer update
    // Example: http://localhost:8080/api/photographers/update/1?firstName=Jane&lastName=Doe&bio=Updated+Bio&profilePictureUrl
    @PutMapping("/update/{photographerId}")
    public ResponseEntity<?> updatePhotographer(@PathVariable int photographerId,
                                                @RequestParam(value = "firstName") String firstName,
                                                @RequestParam(value = "lastName") String lastName) {
        Photographer photographer = photographerRepository.findById(photographerId)
                .orElse(null);
        if (photographer != null) {
            photographer.setFirstName(firstName);
            photographer.setLastName(lastName);
            photographerRepository.save(photographer);
            return new ResponseEntity<>(photographer, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Photographer not found", HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to Delete a photographer
    // URL: http://localhost:8080/api/photographers/delete/{photographerId}
    // Method: DELETE
    // Returns: HTML page with confirmation of photographer deletion
    @DeleteMapping(value = "/delete/{photographerId}", produces=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deletePhotographer(@PathVariable int photographerId) {
        Photographer currentPhotographer = photographerRepository.findById(photographerId)
                .orElse(null);
        if (currentPhotographer != null) {
            photographerRepository.delete(currentPhotographer);
            return new ResponseEntity<>("Photographer deleted successfully", HttpStatus.OK);
        } else {
            String response = "Photographer with ID " + photographerId + " not found.";
            // Return a JSON response with the error message
            return new ResponseEntity<>(Collections.singletonMap("response", response), HttpStatus.NOT_FOUND);
        }
    }
}