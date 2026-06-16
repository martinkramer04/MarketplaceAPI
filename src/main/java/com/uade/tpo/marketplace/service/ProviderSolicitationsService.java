package com.uade.tpo.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.ProviderSolicitations;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Provider.CreateProviderSolicitationRequest;
import com.uade.tpo.marketplace.entity.dto.Provider.UpdateProviderSolicitationRequest;
import com.uade.tpo.marketplace.entity.enums.SolicitationStatusEnum;
import com.uade.tpo.marketplace.entity.Role;
import com.uade.tpo.marketplace.repository.ProviderSolicitationsRepository;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.repository.BoxRepository;
import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.enums.BoxStatusEnum;
import java.math.BigDecimal;

@Service
public class ProviderSolicitationsService implements
        IBaseService<ProviderSolicitations, CreateProviderSolicitationRequest, UpdateProviderSolicitationRequest> {

    @Autowired
    private ProviderSolicitationsRepository solicitationsRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BoxRepository boxRepository;

    @Override
    public List<ProviderSolicitations> getAll() {
        try {
            return solicitationsRepository.findAll();
        } catch (Exception e) {
            System.out.println("❌ Error en getAll() del Service: " + e.getMessage());
            throw e;
        }
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
        if (entity == null) {
            return Optional.empty();
        }

        ProviderSolicitations solicitation = new ProviderSolicitations();
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el email: " + email));

        solicitation.setUser(user); 
        solicitation.setDescription(entity.getDescription());
        solicitation.setSolicitationStatus(SolicitationStatusEnum.GENERADA); 
        solicitation.setCreatedAt(LocalDateTime.now());

        try {
            solicitationsRepository.save(solicitation);
        } catch (Exception e) {
            throw new RuntimeException("Error al persistir la solicitud: " + e.getMessage());
        }

        return Optional.of(solicitation);
    }
    
    @Override
    public Optional<ProviderSolicitations> update(UpdateProviderSolicitationRequest entity, Long id) {
        ProviderSolicitations solicitation = solicitationsRepository.findById(id).orElse(null);

        if (solicitation == null) {
            return Optional.empty();
        }

        solicitation.setSolicitationStatus(entity.getSolicitationStatus());
        solicitation.setUpdatedAt(LocalDateTime.now());

        if (entity.getSolicitationStatus() == SolicitationStatusEnum.CONFIRMADA) {
            User user = solicitation.getUser();
            user.setRole(Role.PROVIDER);
            userRepository.save(user);

            Box box = new Box();
            box.setName(solicitation.getDescription().substring(0, Math.min(50, solicitation.getDescription().length())));
            box.setDescription(solicitation.getDescription());
            box.setUser(user);
            box.setStatus(BoxStatusEnum.APPROVED);
            box.setStock(0);
            box.setPrice(BigDecimal.ZERO);
            boxRepository.save(box);
        }

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
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting solicitation: " + e.getMessage());
        }
    }
}   