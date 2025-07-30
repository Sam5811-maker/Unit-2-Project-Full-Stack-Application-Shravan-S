package com.launchcode.frozen_pixel_alchemy.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private static int nextId = 3;

    public static final Map<Integer, String> users = new HashMap<>() {{
        put(1, "john@example.com");
        put(2, "alice@example.com");
    }};

    @GetMapping("")
    public String renderUserHomePage() {
        StringBuilder userList = new StringBuilder();
        for (int userId : users.keySet()) {
            String email = users.get(userId);
            userList.append("<li><a href='/users/details/").append(userId).append("'>").append(email).append("</a></li>");
        }
        return """
            <html>
                <body>
                    <h2>USERS</h2><ul>
            """ + userList + """
                    </ul><p><a href='/users/add'>Add</a> new user.</p>
                </body>
            </html>
        """;
    }

    @GetMapping("/details/{userId}")
    public String showUserDetails(@PathVariable int userId) {
        return """
            <html>
                <body>
                    <h3>User Details</h3>
            """ + "<p><b>ID:</b> " + userId + "</p>" +
                "<p><b>Email:</b> " + users.get(userId) + "</p>" +
                """
                </body>
            </html>
            """;
    }

    @PostMapping("/add")
    public String addUser(@RequestParam String email) {
        int id = nextId++;
        users.put(id, email);
        return """
            <html>
            <body>
            <h3>User Added</h3>
            """ + "<p><b>ID:</b> " + id + "</p>" +
                "<p><b>Email:</b> " + email + "</p>" +
                """
                </body>
                </html>
                """;
    }

    @PutMapping("/update/{userId}")
    public String updateUser(@PathVariable int userId, @RequestParam String email) {
        if (!users.containsKey(userId)) {
            return "<html><body><h3>User Not Found</h3></body></html>";
        }
        users.put(userId, email);
        return """
            <html>
            <body>
            <h3>User Updated</h3>
            """ + "<p><b>ID:</b> " + userId + "</p>" +
                "<p><b>Updated Email:</b> " + email + "</p>" +
                """
                </body>
                </html>
                """;
    }

    @DeleteMapping("/delete/{userId}")
    public String deleteUser(@PathVariable int userId) {
        String removed = users.remove(userId);
        if (removed == null) {
            return "<html><body><h3>User Not Found</h3></body></html>";
        }
        return """
            <html>
            <body>
            <h3>User Deleted</h3>
            """ + "<p><b>ID:</b> " + userId + "</p>" +
                "<p><b>Email:</b> " + removed + "</p>" +
                """
                </body>
                </html>
                """;
    }
}
