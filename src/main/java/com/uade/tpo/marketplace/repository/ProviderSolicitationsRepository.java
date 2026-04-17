package com.uade.tpo.marketplace.repository;
 
import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.uade.tpo.marketplace.entity.ProviderSolicitations;
import com.uade.tpo.marketplace.entity.enums.SolicitationStatusEnum;
 
@Repository
public interface ProviderSolicitationsRepository extends JpaRepository<ProviderSolicitations, Long> {
 
    // Solicitudes de un provider específico
    List<ProviderSolicitations> findByProviderId(Long providerId);
 
    // Solicitudes por estado
    List<ProviderSolicitations> findBySolicitationStatus(SolicitationStatusEnum status);
}