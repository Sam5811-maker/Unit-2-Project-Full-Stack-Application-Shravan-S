package com.launchcode.frozen_pixel_alchemy.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    // Static variable to keep track of the next booking ID
    private static int nextId = 3;

    // storage for bookings
    public static final Map<Integer, String> bookings = new HashMap<>() {{
        put(1, "Potrait Session - John");
        put(2, "Weding Shoot - Bob");
    }};

    // GET the full list of bookings
    // Endpoint: http://localhost:8080/api/bookings
    @GetMapping("")
    public String renderBookingHomePage() {
        StringBuilder bookingList = new StringBuilder();
        // Build an HTML list of all bookings
        for (int bookingId : bookings.keySet()) {
            String booking = bookings.get(bookingId);
            bookingList.append("<li><a href='/bookings/details/").append(bookingId).append("'>").append(booking).append("</a></li");
        }
        // Return HTML page with a booking list
        return """
                <html>
                <body>
                <h2>BOOKINGS</h2><ul>
                            ""\" + list + ""\"
                            </ul><p><a href='/bookings/add'>Add</a> new booking.</p></body></html>
                """;
    }

    // GET a single booking by its ID
    // Endpoint: http://localhost:8080/api/bookings/details/{bookingId}
    @GetMapping("/details/{bookingId}")
    public String showBookingDetails(@PathVariable int id) {
        // Return HTML page with booking details
        return """
                <html>
                    <body>
                        <h3>Booking Details</h3>
                        ""\" +
                            "<p><b>ID:</b> " + bookingId + "</p>" +
                            "<p><b>Name:</b> " + bookings.get(bookingId) + "</p>" +
                        ""\"
                    </body>
                </html>
                    ""\";
                """;
    }

    // POST a new booking
    // Endpoint: http://localhost:8080/api/bookings/add?name=Tim
    @PostMapping("/add")
    public String addBooking(@RequestParam String name) {
        int id = nextId++; // Generate new ID
        bookings.put(id, name); // Add booking to map
        // Return HTML page with new booking details
        return """
                <html>
                    <body>
                        <h3>Booking Details</h3>
                        ""\" +
                            "<p><b>ID:</b> " + id + "</p>" +
                            "<p><b>Name:</b> " + name + "</p>" +
                        ""\"
                    </body>
                </html>
                    ""\";
                """;
    }

    // PUT to update an existing booking
    // Endpoint: http://localhost:8080/api/bookings/update/{bookingId}?name=NewName
    @PutMapping("/update/{bookingId}")
    public String updateBooking(@PathVariable int bookingId, @RequestParam String name) {
        // Check if booking exists
        if(!bookings.containsKey((bookingId))) {
            // Return didn't found a message if booking does not exist
            return """
                    <html>
                        <body>
                            <h3>Booking Not Found</h3>
                        </body>
                    </html>
                    """;
        }
        bookings.put(bookingId, name); // Update booking name
        // Return HTML page with updated booking details
        return """
                <html>
                    <body>
                        <h3>Booking Updated</h3>
                        ""\" +
                            "<p><b>ID:</b> " + bookingId + "</p>" +
                            "<p><b>Updated Name:</b> " + name + "</p>" +
                        ""\"
                    </body>
                </html>
                    ""\";
                """;
    }

    // DELETE a booking by its ID
    // Endpoint: http://localhost:8080/api/bookings/delete/{bookingId}
    @DeleteMapping("/delete/{bookingId}")
    public String deleteBooking(@PathVariable int bookingId) {
        String bookingRemoved = bookings.remove(bookingId); // Remove booking
        if (bookingRemoved == null) {
            // Return didn't find a message if booking does not exist
            return """
                    <html>
                        <body>
                            <h3>Booking Not Found</h3>
                        </body>
                    </html>
                    """;
        }
        // Return HTML page confirming deletion
        return """
                <html>
                    <body>
                        <h3>Booking Deleted</h3>
                        ""\" +
                            "<p><b>ID:</b> " + bookingId + "</p>" +
                            "<p><b>Name:</b> " + bookingRemoved + "</p>" +
                        ""\"
                    </body>
                </html>
                    ""\";
                """;
    }

}