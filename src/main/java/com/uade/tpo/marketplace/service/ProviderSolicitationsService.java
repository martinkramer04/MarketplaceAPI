package com.uade.tpo.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import com.uade.tpo.marketplace.entity.ProviderSolicitations;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Provider.CreateProviderSolicitationRequest;
import com.uade.tpo.marketplace.entity.dto.Provider.UpdateProviderSolicitationRequest;
import com.uade.tpo.marketplace.entity.enums.SolicitationStatusEnum;
import com.uade.tpo.marketplace.repository.ProviderSolicitationsRepository;
import com.uade.tpo.marketplace.repository.UserRepository;

@Service
public class ProviderSolicitationsService implements
        IBaseService<ProviderSolicitations, CreateProviderSolicitationRequest, UpdateProviderSolicitationRequest> {

    @Autowired
    private ProviderSolicitationsRepository solicitationsRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ProviderSolicitations> getAll() {
        return solicitationsRepository.findAll();
    }

    @Override
    public Optional<ProviderSolicitations> getById(Long id) {
        return solicitationsRepository.findById(id);
    }

    public List<ProviderSolicitations> getByUser(Long userId) {
        return solicitationsRepository.findByUserId(userId);
    }

    public List<ProviderSolicitations> getByStatus(SolicitationStatusEnum status) {
        return solicitationsRepository.findBySolicitationStatus(status);
    }

    @Override
    public Optional<ProviderSolicitations> create(CreateProviderSolicitationRequest entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

    // @PostMapping
    // public ResponseEntity<ProviderSolicitations> create(@RequestBody
    // CreateProviderSolicitationRequest request) {
    // Optional<ProviderSolicitations> result =
    // solicitationsService.create(request);

    // if (result.isPresent()) {
    // // Devolvemos solo los campos necesarios, sin referencias circulares
    // ProviderSolicitations s = result.get();
    // return ResponseEntity.status(201).body(Map.of(
    // "id", s.getId(),
    // "description", s.getDescription(),
    // "solicitationStatus", s.getSolicitationStatus(),
    // "createdAt", s.getCreatedAt()
    // ));
    // }
    // return ResponseEntity.badRequest().build();
    // }

    @Override
    public Optional<ProviderSolicitations> update(UpdateProviderSolicitationRequest entity, Long id) {
        ProviderSolicitations solicitation = solicitationsRepository.findById(id).orElse(null);

        if (solicitation == null) {
            return Optional.empty();
        }

        solicitation.setSolicitationStatus(entity.getSolicitationStatus());
        solicitation.setUpdatedAt(LocalDateTime.now());

        try {
            solicitationsRepository.save(solicitation);
        } catch (Exception e) {
            throw new RuntimeException("Error updating solicitation: " + e.getMessage());
        }

        return Optional.of(solicitation);
    }

    @Override
    public boolean delete(Long id) {
        ProviderSolicitations solicitation = solicitationsRepository.findById(id).orElse(null);

        if (solicitation == null) {
            return false;
        }

        try {
            solicitationsRepository.delete(solicitation);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting solicitation: " + e.getMessage());
        }

        return true;
    }

}