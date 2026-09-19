package com.museum.krishna_museum.controller;

import com.museum.krishna_museum.model.Artefact;
import com.museum.krishna_museum.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final JdbcTemplate jdbcTemplate;

    public WishlistController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieve all artefact IDs saved in the authenticated user's wishlist.
     *
     * @param session current HTTP session
     * @return list of artefact ids
     */
    @GetMapping
    public ResponseEntity<List<Integer>> getWishlistIds(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        String sql = "SELECT artefact_id FROM wishlist WHERE user_id = ?";
        List<Integer> ids = jdbcTemplate.queryForList(sql, Integer.class, user.getUserId());
        return ResponseEntity.ok(ids);
    }

    /**
     * Retrieve full artefact objects saved in the user's wishlist.
     *
     * @param session current HTTP session
     * @return list of saved artefacts
     */
    @GetMapping("/artefacts")
    public ResponseEntity<List<Artefact>> getWishlistArtefacts(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        String sql = "SELECT a.* FROM artefact a JOIN wishlist w ON a.artefact_id = w.artefact_id WHERE w.user_id = ? ORDER BY w.added_date DESC";
        List<Artefact> artefacts = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Artefact.class), user.getUserId());
        return ResponseEntity.ok(artefacts);
    }

    /**
     * Toggle wishlist membership for an artefact (persisting to database if user is logged in).
     *
     * @param artefactId artefact id
     * @param session current HTTP session
     * @return operation status payload
     */
    @PostMapping("/toggle/{artefactId}")
    public ResponseEntity<Map<String, Object>> toggleWishlist(@PathVariable int artefactId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        Map<String, Object> resp = new HashMap<>();

        if (user == null) {
            resp.put("status", "guest");
            resp.put("message", "Guest mode: saved locally");
            return ResponseEntity.ok(resp);
        }

        String checkSql = "SELECT COUNT(*) FROM wishlist WHERE user_id = ? AND artefact_id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, user.getUserId(), artefactId);

        if (count != null && count > 0) {
            String deleteSql = "DELETE FROM wishlist WHERE user_id = ? AND artefact_id = ?";
            jdbcTemplate.update(deleteSql, user.getUserId(), artefactId);
            resp.put("status", "removed");
            resp.put("inWishlist", false);
            resp.put("message", "Removed from wishlist");
        } else {
            String insertSql = "INSERT INTO wishlist (user_id, artefact_id) VALUES (?, ?)";
            jdbcTemplate.update(insertSql, user.getUserId(), artefactId);
            resp.put("status", "added");
            resp.put("inWishlist", true);
            resp.put("message", "Added to wishlist");
        }

        return ResponseEntity.ok(resp);
    }
}