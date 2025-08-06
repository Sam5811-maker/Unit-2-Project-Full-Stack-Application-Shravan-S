package com.launchcode.frozen_pixel_alchemy.controllers;

import com.launchcode.frozen_pixel_alchemy.models.Booking;
import com.launchcode.frozen_pixel_alchemy.models.Photographer;
import com.launchcode.frozen_pixel_alchemy.models.dto.BookingDTO;
import com.launchcode.frozen_pixel_alchemy.respositories.BookingRepository;
import com.launchcode.frozen_pixel_alchemy.respositories.PhotographerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    BookingRepository bookingRepository;
    @Autowired
    PhotographerRepository photographerRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // GET the full list of bookings
    // Endpoint: http://localhost:8080/api/bookings
    @GetMapping("")
    public ResponseEntity<?> getAllBookings() {
        // Fetch all bookings from the repository
        return ResponseEntity.ok(bookingRepository.findAll());
    }
    // GET a booking by its ID
    // Endpoint: http://localhost:8080/api/bookings/{bookingId}
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable int bookingId) {
        // Find the booking by ID
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            // Return the booking if found
            return ResponseEntity.ok(booking);
        } else {
            // Return a 404 Not Found if booking does not exist
            return ResponseEntity.status(404).body("Booking with ID " + bookingId + " not found.");
        }
    }

    // Post a new booking
    // Endpoint: http://localhost:8080/api/bookings/add
    @PostMapping("/add")
    public ResponseEntity<?> addBooking(@RequestBody BookingDTO bookingDTO) {
        // Map DTO to Booking entity
        Booking booking = new Booking();
        Photographer photographer = photographerRepository.findById(bookingDTO.photographerId).orElse(null);
        if (photographer == null) {
            return ResponseEntity.badRequest().body("Invalid photographerId");
        }
        booking.setPhotographer(photographer);
        booking.setEventType(bookingDTO.eventType);
        booking.setBookingDate(bookingDTO.bookingDate);
        booking.setBookingTime(bookingDTO.bookingTime);
        booking.setNotes(bookingDTO.notes);
        booking.setTotalAmount(bookingDTO.totalAmount);
        booking.setStatus(
            bookingDTO.status != null
                ? Booking.Status.valueOf(bookingDTO.status)
                : Booking.Status.pending
        );
        Booking savedBooking = bookingRepository.save(booking);
        messagingTemplate.convertAndSend("/topic/bookings", savedBooking);
        return ResponseEntity.status(201).body(savedBooking);
    }


    // PUT to update an existing booking
    // Endpoint: http://localhost:8080/api/bookings/update/{bookingId}
    @PutMapping("/update/{bookingId}")
    public ResponseEntity<?> updateBooking(@PathVariable int bookingId, @RequestBody Booking booking) {
        Booking existingBooking = bookingRepository.findById(bookingId).orElse(null);
        if (existingBooking != null) {
            existingBooking.setEventType(booking.getEventType());
            existingBooking.setBookingDate(booking.getBookingDate());
            existingBooking.setBookingTime(booking.getBookingTime());
            existingBooking.setNotes(booking.getNotes());
            existingBooking.setTotalAmount(booking.getTotalAmount());
            existingBooking.setStatus(booking.getStatus());
            Booking updatedBooking = bookingRepository.save(existingBooking);
            return ResponseEntity.ok(updatedBooking);
        }
        return ResponseEntity.status(404).body("Booking not found");
    }


    // DELETE a booking by its ID
    // Endpoint: http://localhost:8080/api/bookings/{bookingId}
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable int bookingId) {
        if (bookingRepository.existsById(bookingId)) {
            bookingRepository.deleteById(bookingId);
            return ResponseEntity.ok("Booking deleted");
        }
        return ResponseEntity.status(404).body("Booking not found");
    }


}