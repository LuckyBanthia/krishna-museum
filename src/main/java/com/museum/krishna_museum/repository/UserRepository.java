package com.museum.krishna_museum.repository;

import com.museum.krishna_museum.model.User;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Persist a new user entity into the database.
     *
     * @param user user details
     */
    public void save(User user) {
        String sql = "INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)";
        jdbcTemplate.update(sql,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole());
    }

    /**
     * Look up user entity by email address.
     *
     * @param email unique email
     * @return user entity or null if not found
     */
    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email=?";
        List<User> users = jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(User.class),
                email);

        if (users.isEmpty()) {
            return null;
        }

        return users.get(0);
    }

    /**
     * Update user profile attributes for an existing account.
     *
     * @param user updated user data
     * @param currentEmail current email identifier
     */
    public void updateProfile(User user, String currentEmail) {
        String sql = "UPDATE users SET name=?, email=?, password=? WHERE email=?";
        jdbcTemplate.update(sql,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                currentEmail);
    }
}