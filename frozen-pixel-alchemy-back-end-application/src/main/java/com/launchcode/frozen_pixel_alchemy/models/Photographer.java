package com.launchcode.frozen_pixel_alchemy.models;

import jakarta.persistence.*;

@Entity
public class Photographer {
    @Id
    @Column(name = "photographer_id")
    private int photographerId;

    @Column(name = "first_name",nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "user_id", nullable = true, unique = true)
    private String userId;

    @Column(name = "bio")
    private String bio;

    private String profilePictureUrl;

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Photographer() {}

    public Photographer(String firstName, String lastName , String bio) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
    }

    public int getPhotographerId() { return photographerId; }
    public void setId(int photographerId) { this.photographerId = photographerId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}