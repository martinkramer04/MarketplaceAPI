package com.uade.tpo.marketplace.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.EqualsAndHashCode;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private Long userId;
}
