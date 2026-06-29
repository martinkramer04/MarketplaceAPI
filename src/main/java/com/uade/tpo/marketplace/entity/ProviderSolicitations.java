package com.uade.tpo.marketplace.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.uade.tpo.marketplace.entity.enums.SolicitationStatusEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "provider_solicitations")
public class ProviderSolicitations extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column
    private SolicitationStatusEnum solicitationStatus;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // Business info
    @Column
    private String businessName;

    @Column
    private String ownerName;

    @Column
    private String email;

    @Column
    private String phone;

    @Column
    private String website;

    // Location
    @Column
    private String category;

    @Column
    private String location;

    @Column
    private String address;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    // Experience proposal
    @Column
    private String experienceName;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String experienceDescription;

    @Column(precision = 10, scale = 2)
    private BigDecimal minPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal maxPrice;

    @Column
    private Integer capacity;

    @Column
    private String duration;
}