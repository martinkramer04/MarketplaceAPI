package com.uade.tpo.marketplace.entity;

import java.math.BigDecimal;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    private BigDecimal price;
    @Column
    private Integer stock;
    @Column
    private String description;
    @Column
    private Long categoryId;
    @Column
    private String imageUrl;
    
    @Column(nullable = false)
    private Long userId; 
}
