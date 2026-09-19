package com.museum.krishna_museum.controller;

import com.museum.krishna_museum.model.Artefact;
import com.museum.krishna_museum.model.User;
import com.museum.krishna_museum.repository.ArtefactRepository;
import org.springframework.web.bind.annotation.*;
 import jakarta.servlet.http.HttpSession;

import java.util.List;

@RestController
@RequestMapping("/api/artefacts")
public class ArtefactController {

    private final ArtefactRepository repo;

    public ArtefactController(ArtefactRepository repo) {
        this.repo = repo;
    }

    /**
     * Retrieve all artefacts available in the museum collection.
     *
     * @return list of all artefacts
     */
    @GetMapping
    public List<Artefact> getAll() {
        return repo.getAllArtefacts();
    }

    /**
     * Search artefacts by name, type, material, dynasty, region, or deity.
     *
     * @param keyword search term
     * @return matching artefacts
     */
    @GetMapping("/search")
    public List<Artefact> search(@RequestParam String keyword) {
        return repo.search(keyword);
    }

    /**
     * Filter artefacts by the museum floor location.
     *
     * @param floor floor number
     * @return artefacts located on the specified floor
     */
    @GetMapping("/floor/{floor}")
    public List<Artefact> getByFloor(@PathVariable int floor) {
        return repo.getByFloor(floor);
    }

    /**
     * Retrieve single artefact details by unique identifier.
     *
     * @param id artefact id
     * @return artefact entity
     */
    @GetMapping("/{id}")
    public Artefact getById(@PathVariable int id) {
        return repo.getById(id);
    }

    /**
     * Add a new artefact into the catalog (administrator only).
     *
     * @param a artefact payload
     * @param session current HTTP session
     * @return status message
     */
    @PostMapping("/admin/add")
    public String addArtefact(@RequestBody Artefact a, HttpSession session) {
        Object role = session.getAttribute("role");
        Object user = session.getAttribute("user");
        boolean isAdmin = "ADMIN".equals(role) || (user instanceof User u && "ADMIN".equals(u.getRole()));

        if (!isAdmin) {
            return "Unauthorized";
        }

        repo.addArtefact(a);
        return "Added";
    }
}