package com.museum.krishna_museum.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    /**
     * Render the home page view.
     *
     * @return index template name
     */
    @GetMapping("/")
    public String home() {
        return "index";
    }

    /**
     * Render the travel guidelines and information page.
     *
     * @return travel template name
     */
    @GetMapping("/travel")
    public String travel() {
        return "travel";
    }

    /**
     * Render the artefacts catalog page.
     *
     * @return artefacts template name
     */
    @GetMapping("/artefacts")
    public String artefacts() {
        return "artefacts";
    }

    /**
     * Render the user login page.
     *
     * @return login template name
     */
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    /**
     * Render the user registration page.
     *
     * @return register template name
     */
    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    /**
     * Render the about information page.
     *
     * @return about template name
     */
    @GetMapping("/about")
    public String about() {
        return "about";
    }

    /**
     * Render the contact form page.
     *
     * @return contact template name
     */
    @GetMapping("/contact")
    public String contact() {
        return "contact";
    }

    /**
     * Render the admin dashboard view.
     *
     * @return admin template name
     */
    @GetMapping("/admin")
    public String adminPage() {
        return "admin";
    }

    /**
     * Render the authenticated user profile dashboard.
     *
     * @return dashboard template name
     */
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    /**
     * Render the events and programs schedule page.
     *
     * @return events template name
     */
    @GetMapping("/events")
    public String events() {
        return "events";
    }

    /**
     * Render the interactive historical timeline page.
     *
     * @return timeline template name
     */
    @GetMapping("/timeline")
    public String timeline() {
        return "timeline";
    }

    /**
     * Render the user saved wishlist gallery page.
     *
     * @return wishlist template name
     */
    @GetMapping("/wishlist")
    public String wishlist() {
        return "wishlist";
    }
}