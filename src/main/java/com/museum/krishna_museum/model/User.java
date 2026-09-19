package com.museum.krishna_museum.model;

import java.io.Serial;
import java.io.Serializable;

/**
 * Entity representing an authenticated or registered user in the system.
 */
public class User implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private int userId;
    private String name;
    private String email;
    private String password;
    private String role;

    // GETTERS & SETTERS

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}