package com.museum.krishna_museum.repository;

import com.museum.krishna_museum.model.Artefact;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ArtefactRepository {

    private final JdbcTemplate jdbcTemplate;

    public ArtefactRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieve all artefacts from the database.
     *
     * @return list of artefacts
     */
    public List<Artefact> getAllArtefacts() {
        String sql = "SELECT * FROM artefact";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Artefact.class));
    }

    /**
     * Case-insensitive keyword search across multiple artefact attributes.
     *
     * @param keyword search keyword
     * @return list of matching artefacts
     */
    public List<Artefact> search(String keyword) {
        String sql = "SELECT * FROM artefact WHERE " +
                "LOWER(name) LIKE LOWER(?) OR " +
                "LOWER(type) LIKE LOWER(?) OR " +
                "LOWER(material) LIKE LOWER(?) OR " +
                "LOWER(dynasty) LIKE LOWER(?) OR " +
                "LOWER(region) LIKE LOWER(?) OR " +
                "LOWER(deity) LIKE LOWER(?) OR " +
                "LOWER(description) LIKE LOWER(?)";

        String k = "%" + keyword + "%";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Artefact.class), k, k, k, k, k, k, k);
    }

    /**
     * Retrieve artefacts filtered by museum floor level.
     *
     * @param floor floor number
     * @return list of artefacts on given floor
     */
    public List<Artefact> getByFloor(int floor) {
        String sql = "SELECT * FROM artefact WHERE floor=?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Artefact.class), floor);
    }

    /**
     * Retrieve a specific artefact by its primary key identifier.
     *
     * @param id artefact id
     * @return artefact object
     */
    public Artefact getById(int id) {
        String sql = "SELECT * FROM artefact WHERE artefact_id=?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Artefact.class), id);
    }

    /**
     * Retrieve related artefacts belonging to the same dynasty.
     *
     * @param dynasty historical dynasty name
     * @return list of related artefacts
     */
    public List<Artefact> getRelated(String dynasty) {
        String sql = "SELECT * FROM artefact WHERE dynasty=?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Artefact.class), dynasty);
    }

    /**
     * Insert a new artefact record into the database catalog.
     *
     * @param a artefact entity to insert
     */
    public void addArtefact(Artefact a) {
        String sql = "INSERT INTO artefact " +
                "(code,name,type,material,dynasty,region,deity,museum,description,image_url,floor) " +
                "VALUES (?,?,?,?,?,?,?,?,?,?,?)";

        jdbcTemplate.update(sql,
                a.getCode(), a.getName(), a.getType(), a.getMaterial(),
                a.getDynasty(), a.getRegion(), a.getDeity(),
                a.getMuseum(), a.getDescription(),
                a.getImageUrl(), a.getFloor());
    }
}