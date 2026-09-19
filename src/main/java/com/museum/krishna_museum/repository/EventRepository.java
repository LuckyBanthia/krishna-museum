package com.museum.krishna_museum.repository;

import com.museum.krishna_museum.model.Event;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EventRepository {

    private final JdbcTemplate jdbcTemplate;

    public EventRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieve all events ordered chronologically descending.
     *
     * @return list of events
     */
    public List<Event> getAllEvents() {
        String sql = "SELECT * FROM event ORDER BY event_date DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Event.class));
    }

    /**
     * Retrieve upcoming events starting on or after today.
     *
     * @return list of upcoming events
     */
    public List<Event> getUpcomingEvents() {
        String sql = "SELECT * FROM event WHERE event_date >= CURDATE() ORDER BY event_date ASC LIMIT 10";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Event.class));
    }

    /**
     * Retrieve single event entity by identifier.
     *
     * @param eventId event id
     * @return event entity
     */
    public Event getEventById(int eventId) {
        String sql = "SELECT * FROM event WHERE event_id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Event.class), eventId);
    }

    /**
     * Insert a new event record into database.
     *
     * @param event event details
     */
    public void addEvent(Event event) {
        String sql = "INSERT INTO event (title, description, event_date, location, category, image_url, capacity, registered, created_date) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        jdbcTemplate.update(sql, event.getTitle(), event.getDescription(), event.getEventDate(),
                event.getLocation(), event.getCategory(), event.getImageUrl(), event.getCapacity(), event.getRegistered());
    }

    /**
     * Update details of an existing event record.
     *
     * @param event event details
     */
    public void updateEvent(Event event) {
        String sql = "UPDATE event SET title = ?, description = ?, event_date = ?, location = ?, category = ?, image_url = ?, capacity = ? WHERE event_id = ?";
        jdbcTemplate.update(sql, event.getTitle(), event.getDescription(), event.getEventDate(),
                event.getLocation(), event.getCategory(), event.getImageUrl(), event.getCapacity(), event.getEventId());
    }

    /**
     * Delete an event record by identifier.
     *
     * @param eventId event id
     */
    public void deleteEvent(int eventId) {
        String sql = "DELETE FROM event WHERE event_id = ?";
        jdbcTemplate.update(sql, eventId);
    }

    /**
     * Retrieve events belonging to a specific category.
     *
     * @param category category name
     * @return matching events
     */
    public List<Event> getEventsByCategory(String category) {
        String sql = "SELECT * FROM event WHERE category = ? ORDER BY event_date DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Event.class), category);
    }
}
