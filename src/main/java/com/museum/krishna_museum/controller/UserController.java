package com.museum.krishna_museum.controller;

import com.museum.krishna_museum.model.User;
import com.museum.krishna_museum.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {   
        this.repo = repo;
    }

    /**
     * Register a new user with standard USER role.
     *
     * @param user registration payload
     * @return response indicating registration status
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            user.setRole("USER");
            repo.save(user);
            return ResponseEntity.ok("User Registered");
        } catch (Exception e) {
            if (e.getMessage() != null && (e.getMessage().contains("Duplicate entry") || e.getMessage().contains("unique constraint"))) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
        }
    }

    /**
     * Authenticate user credentials and establish session.
     *
     * @param user login credentials
     * @param session current HTTP session
     * @return authenticated user summary or unauthorized status
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user, HttpSession session) {
        User u = repo.findByEmail(user.getEmail());

        if (u != null && u.getPassword().equals(user.getPassword())) {
            session.setAttribute("user", u);
            session.setAttribute("role", u.getRole());
            Map<String, Object> response = new HashMap<>();
            response.put("role", u.getRole());
            response.put("name", u.getName());
            response.put("email", u.getEmail());
            return ResponseEntity.ok(response);
        }

        Map<String, Object> invalid = new HashMap<>();
        invalid.put("status", "INVALID");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(invalid);
    }

    /**
     * Retrieve the currently authenticated user in session.
     *
     * @param session current HTTP session
     * @return current user entity without password
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpSession session) {
        User current = (User) session.getAttribute("user");
        if (current == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        current.setPassword(null);
        return ResponseEntity.ok(current);
    }

    /**
     * Update user profile information for the authenticated user.
     *
     * @param user updated profile data
     * @param session current HTTP session
     * @return update confirmation
     */
    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(@RequestBody User user, HttpSession session) {
        User current = (User) session.getAttribute("user");
        if (current == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("UNAUTHORIZED");
        }

        user.setRole(current.getRole());
        repo.updateProfile(user, current.getEmail());
        session.setAttribute("user", user);

        return ResponseEntity.ok("UPDATED");
    }
}
