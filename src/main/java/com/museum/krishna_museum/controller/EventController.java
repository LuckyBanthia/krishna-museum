package com.museum.krishna_museum.controller;

import com.museum.krishna_museum.model.Event;
import com.museum.krishna_museum.model.User;
import com.museum.krishna_museum.repository.EventRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepo;

    public EventController(EventRepository eventRepo) {
        this.eventRepo = eventRepo;
    }

    /**
     * Retrieve list of all events ordered by date descending.
     *
     * @return all events
     */
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepo.getAllEvents();
    }

    /**
     * Retrieve upcoming events occurring on or after current date.
     *
     * @return list of upcoming events
     */
    @GetMapping("/upcoming")
    public List<Event> getUpcomingEvents() {
        return eventRepo.getUpcomingEvents();
    }

    /**
     * Retrieve event details by its unique identifier.
     *
     * @param eventId event id
     * @return event entity
     */
    @GetMapping("/{eventId}")
    public Event getEventById(@PathVariable int eventId) {
        return eventRepo.getEventById(eventId);
    }

    /**
     * Filter events by category name.
     *
     * @param category event category
     * @return matching events
     */
    @GetMapping("/category/{category}")
    public List<Event> getEventsByCategory(@PathVariable String category) {
        return eventRepo.getEventsByCategory(category);
    }

    /**
     * Helper method to verify administrator privileges from current session.
     *
     * @param session current HTTP session
     * @return true if user has ADMIN role
     */
    private boolean isAdmin(HttpSession session) {
        Object role = session.getAttribute("role");
        if ("ADMIN".equals(role)) {
            return true;
        }
        Object userObj = session.getAttribute("user");
        if (userObj instanceof User u) {
            return "ADMIN".equals(u.getRole());
        }
        return false;
    }

    /**
     * Create and insert a new event into the calendar (administrator only).
     *
     * @param event event details
     * @param session current HTTP session
     * @return operation status
     */
    @PostMapping("/admin/add")
    public Map<String, String> addEvent(@RequestBody Event event, HttpSession session) {
        Map<String, String> response = new HashMap<>();

        if (!isAdmin(session)) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }

        try {
            event.setCreatedDate(LocalDateTime.now());
            eventRepo.addEvent(event);
            response.put("status", "success");
            response.put("message", "Event created successfully");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create event");
        }
        return response;
    }

    /**
     * Update details of an existing event (administrator only).
     *
     * @param eventId event id to update
     * @param event updated event details
     * @param session current HTTP session
     * @return operation status
     */
    @PutMapping("/admin/update/{eventId}")
    public Map<String, String> updateEvent(@PathVariable int eventId,
                                           @RequestBody Event event,
                                           HttpSession session) {
        Map<String, String> response = new HashMap<>();

        if (!isAdmin(session)) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }

        try {
            event.setEventId(eventId);
            eventRepo.updateEvent(event);
            response.put("status", "success");
            response.put("message", "Event updated successfully");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update event");
        }
        return response;
    }

    /**
     * Delete an event from the schedule (administrator only).
     *
     * @param eventId event id to delete
     * @param session current HTTP session
     * @return operation status
     */
    @DeleteMapping("/admin/delete/{eventId}")
    public Map<String, String> deleteEvent(@PathVariable int eventId, HttpSession session) {
        Map<String, String> response = new HashMap<>();

        if (!isAdmin(session)) {
            response.put("status", "error");
            response.put("message", "Unauthorized");
            return response;
        }

        try {
            eventRepo.deleteEvent(eventId);
            response.put("status", "success");
            response.put("message", "Event deleted successfully");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete event");
        }
        return response;
    }
}
