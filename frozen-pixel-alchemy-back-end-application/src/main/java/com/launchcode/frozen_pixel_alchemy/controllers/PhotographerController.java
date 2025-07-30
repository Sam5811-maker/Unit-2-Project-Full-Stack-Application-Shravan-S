package com.launchcode.frozen_pixel_alchemy.controllers;

import com.launchcode.frozen_pixel_alchemy.respositories.PhotographerRepository;
import com.launchcode.frozen_pixel_alchemy.models.Photographer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/photographers")
public class PhotographerController {

    @Autowired
    private PhotographerRepository photographerRepository;

    private String generateNextUserId() {
        List<Photographer> all = photographerRepository.findAll();
        int max = 0;
        for (Photographer p : all) {
            String uid = p.getUserId();
            if (uid != null && uid.startsWith("PGID-")) {
                try {
                    int num = Integer.parseInt(uid.substring(5));
                    if (num > max) max = num;
                } catch (NumberFormatException ignored) {}
            }
        }
        return String.format("PGID-%04d", max + 1);
    }

    @GetMapping("")
    @ResponseBody
    public String renderPhotographerHomePage() {
        List<Photographer> allPhotographers = photographerRepository.findAll();
        StringBuilder photographerList = new StringBuilder();
        if (allPhotographers.isEmpty()) {
            return """
                <html>
                <body>
                <h2>PHOTOGRAPHERS</h2>
                <p>No photographers found. Please add a photographer.</p>
                <form action='/photographers/add' method='post'>
                    <input type='text' name='firstName' placeholder='First Name' required>
                    <input type='text' name='lastName' placeholder='Last Name' required>
                    <button type='submit'>Add Photographer</button>
                </form>
                </body>
                </html>
                """;
        }
        for (Photographer photographer : allPhotographers) {
            photographerList.append("<li><a href='/photographers/details/")
                    .append(photographer.getId())
                    .append("'>")
                    .append(photographer.getFirstName())
                    .append(" ")
                    .append(photographer.getLastName())
                    .append("</a></li>");
        }
        return """
            <html>
            <body>
            <h2>PHOTOGRAPHERS</h2><ul>
            """ + photographerList + """
            </ul>
            <form action='/photographers/add' method='post'>
                <input type='text' name='firstName' placeholder='First Name' required>
                <input type='text' name='lastName' placeholder='Last Name' required>
                <button type='submit'>Add Photographer</button>
            </form>
            </body></html>
            """;
    }

    @GetMapping("/details/{photographerId}")
    @ResponseBody
    public String showPhotographerDetails(@PathVariable int photographerId) {
        return photographerRepository.findById(photographerId)
                .map(photographer -> """
                    <html>
                    <body>
                    <h3>Photographer Details</h3>
                    <p><b>ID:</b> """ + photographer.getId() + "</p>" +
                        "<p><b>Name:</b> " + photographer.getFirstName() + " " + photographer.getLastName() + "</p>" +
                        "<p><b>User ID:</b> " + photographer.getUserId() + "</p>" +
                        "</body></html>")
                .orElse("<html><body><h3>Photographer Not Found</h3></body></html>");
    }

    @PostMapping("/add")
    @ResponseBody
    public String addPhotographer(@RequestParam String firstName,
                                  @RequestParam String lastName,
                                  @RequestParam(required = false) String bio,
                                  @RequestParam(required = false) String profilePictureUrl) {
        Photographer photographer = new Photographer();
        photographer.setFirstName(firstName);
        photographer.setLastName(lastName);
        photographer.setUserId(generateNextUserId());
        photographer.setBio(bio);
        photographer.setProfilePictureUrl(profilePictureUrl);
        photographerRepository.save(photographer);
        return """
        <html>
        <body>
        <h3>Photographer Added</h3>
        <p><b>ID:</b> """ + photographer.getId() + "</p>" +
                "<p><b>Name:</b> " + firstName + " " + lastName + "</p>" +
                "<p><b>User ID:</b> " + photographer.getUserId() + "</p>" +
                "<p><b>Bio:</b> " + (bio != null ? bio : "N/A") + "</p>" +
                "</body></html>";
    }

    @PutMapping("/update/{photographerId}")
    @ResponseBody
    public String updatePhotographer(@PathVariable int photographerId,
                                     @RequestParam String firstName,
                                     @RequestParam String lastName,
                                     @RequestParam(required = false) String bio,
                                     @RequestParam(required = false) String profilePictureUrl) {
        return photographerRepository.findById(photographerId)
                .map(photographer -> {
                    photographer.setFirstName(firstName);
                    photographer.setLastName(lastName);
                    photographer.setBio(bio);
                    photographer.setProfilePictureUrl(profilePictureUrl);
                    photographerRepository.save(photographer);
                    return """
                        <html>
                        <body>
                        <h3>Photographer Updated</h3>
                        <p><b>ID:</b> """ + photographerId + "</p>" +
                            "<p><b>Updated Name:</b> " + firstName + " " + lastName + "</p>" +
                            "<p><b>User ID:</b> " + photographer.getUserId() + "</p>" +
                            "</body></html>";
                })
                .orElse("<html><body><h3>Photographer Not Found</h3></body></html>");
    }

    @DeleteMapping("/delete/{photographerId}")
    @ResponseBody
    public String deletePhotographer(@PathVariable int photographerId) {
        return photographerRepository.findById(photographerId)
                .map(photographer -> {
                    photographerRepository.delete(photographer);
                    return """
                        <html>
                        <body>
                        <h3>Photographer Deleted</h3>
                        <p><b>ID:</b> """ + photographerId + "</p>" +
                            "<p><b>Name:</b> " + photographer.getFirstName() + " " + photographer.getLastName() + "</p>" +
                            "<p><b>User ID:</b> " + photographer.getUserId() + "</p>" +
                            "</body></html>";
                })
                .orElse("<html><body><h3>Photographer Not Found</h3></body></html>");
    }
}