package com.uade.tpo.marketplace.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.ProviderSolicitations;
import com.uade.tpo.marketplace.entity.enums.SolicitationStatusEnum;
import com.uade.tpo.marketplace.entity.dto.Provider.CreateProviderSolicitationRequest;
import com.uade.tpo.marketplace.entity.dto.Provider.UpdateProviderSolicitationRequest;
import com.uade.tpo.marketplace.service.ProviderSolicitationsService;
import org.springframework.web.bind.annotation.CrossOrigin;


@RestController
@RequestMapping("/api/provider-solicitations")
@CrossOrigin(origins = "http://localhost:5173") 
public class ProviderSolicitationsController {

    @Autowired
    private ProviderSolicitationsService solicitationsService;

    // GET /api/provider-solicitations
    @GetMapping
    public ResponseEntity<List<ProviderSolicitations>> getAll() {
        return ResponseEntity.ok(solicitationsService.getAll());
    }

    // GET /api/provider-solicitations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProviderSolicitations> getById(@PathVariable Long id) {
        Optional<ProviderSolicitations> result = solicitationsService.getById(id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/provider-solicitations/provider/{userId}
    @GetMapping("/provider/{userId}")
    public ResponseEntity<List<ProviderSolicitations>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(solicitationsService.getByUser(userId));
    }

    // GET /api/provider-solicitations/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProviderSolicitations>> getByStatus(@PathVariable SolicitationStatusEnum status) {
        return ResponseEntity.ok(solicitationsService.getByStatus(status));
    }

    // POST /api/provider-solicitations
    @PostMapping
    public ResponseEntity<ProviderSolicitations> create(@RequestBody CreateProviderSolicitationRequest request) {
        Optional<ProviderSolicitations> result = solicitationsService.create(request);
        return result.map(s -> ResponseEntity.status(HttpStatus.CREATED).body(s))
                .orElse(ResponseEntity.badRequest().build());
    }

    // PUT /api/provider-solicitations/{id}  → solo actualiza el estado
    @PutMapping("/{id}")
    public ResponseEntity<ProviderSolicitations> update(
            @PathVariable Long id,
            @RequestBody UpdateProviderSolicitationRequest request) {
        Optional<ProviderSolicitations> result = solicitationsService.update(request, id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/provider-solicitations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = solicitationsService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}