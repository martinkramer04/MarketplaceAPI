package com.uade.tpo.marketplace.entity;

import java.time.LocalDateTime;

import com.uade.tpo.marketplace.entity.enums.SolicitationStatusEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "provider_solicitations")
public class ProviderSolicitations extends BaseEntity {

    @Column
    private Long providerId;

    @Column
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column
    private SolicitationStatusEnum solicitationStatus;

    @Column
    private String description;
}