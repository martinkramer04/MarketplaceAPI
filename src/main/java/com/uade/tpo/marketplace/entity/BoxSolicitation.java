package com.uade.tpo.marketplace.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.uade.tpo.marketplace.entity.enums.BoxSolicitationStatusEnum;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "box_solicitations")
public class BoxSolicitation extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String shortDescription;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String detailedDescription;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String cancellationPolicy;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String subProviders;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BoxSolicitationStatusEnum status = BoxSolicitationStatusEnum.PENDING;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "solicitation", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BoxSolicitationImage> images = new ArrayList<>();
}
