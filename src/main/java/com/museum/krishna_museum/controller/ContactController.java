package com.museum.krishna_museum.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final JdbcTemplate jdbcTemplate;

    public ContactController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Submit and persist visitor inquiry into the database.
     *
     * @param payload map containing visitor name, email, and message
     * @return response indicating submission status
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String message = payload.get("message");

        Map<String, Object> response = new HashMap<>();

        if (name == null || name.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            message == null || message.trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "All fields are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            String sql = "INSERT INTO contact_message (name, email, message) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, name.trim(), email.trim(), message.trim());

            response.put("status", "success");
            response.put("message", "Thank you! Your message has been sent to the Sri Krishna Museum team.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Could not send message. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}