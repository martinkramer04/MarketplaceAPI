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
    
    
    @Autowired
    private com.uade.tpo.marketplace.repository.CategoryRepository categoryRepository;

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
        return solicitationsRepository.findByUser_Id(userId);
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
        // 1. Validamos el ID para quitar la advertencia de Null type safety
        if (id == null) {
            return Optional.empty();
        }

        ProviderSolicitations solicitation = solicitationsRepository.findById(id).orElse(null);

        if (solicitation == null) {
            return Optional.empty();
        } 

        // 2. Seteamos el estado. Si te sigue tirando rojo acá, fijate si tu Enum usa APPROVED/REJECTED en vez de CONFIRMADA
        solicitation.setSolicitationStatus(entity.getSolicitationStatus());
        solicitation.setUpdatedAt(LocalDateTime.now());

        // 3. Verificamos la condición del estado usando el Enum de tu proyecto
        if (entity.getSolicitationStatus() == SolicitationStatusEnum.CONFIRMADA) {
            User user = solicitation.getUser();
            
            // 🚨 Si 'setRole' se te pone en rojo, es porque tu entidad User espera un String o el Enum se llama distinto.
            // Si tu clase 'Role' es un Enum de tu proyecto, se usa así:
            user.setRole(Role.PROVIDER); 
            userRepository.save(user);

            Box box = new Box();
            box.setName(solicitation.getDescription().substring(0, Math.min(50, solicitation.getDescription().length())));
            box.setDescription(solicitation.getDescription());
            box.setUser(user);
            
            // Usamos los Enums estándar de cajas
            box.setStatus(BoxStatusEnum.APPROVED);
            box.setStock(0);
            box.setPrice(BigDecimal.ZERO);

            // Buscamos la categoría de respaldo para evitar el 500
            try {
                com.uade.tpo.marketplace.entity.Category defaultCategory = categoryRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("Categoría por defecto ID=1 no encontrada"));
                box.setCategory(defaultCategory);
            } catch (Exception e) {
                System.out.println("⚠️ Alerta de categoría: " + e.getMessage());
            }

            boxRepository.save(box);
        }

        try {
            ProviderSolicitations saved = solicitationsRepository.save(solicitation);
            return Optional.of(saved);
        } catch (Exception e) {
            throw new RuntimeException("Error updating solicitation: " + e.getMessage());
        }
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