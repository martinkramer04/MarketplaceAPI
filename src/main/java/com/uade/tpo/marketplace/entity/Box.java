package com.uade.tpo.marketplace.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.uade.tpo.marketplace.entity.enums.BoxStatusEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "boxes")
public class Box extends BaseEntity {

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private BigDecimal price;

    @Column
    private Integer stock;
    
    @Enumerated(EnumType.STRING)
    @Column
    private BoxStatusEnum status = BoxStatusEnum.PENDING;

    @ManyToMany
    @JoinTable(name = "box_products", joinColumns = @JoinColumn(name = "box_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
    private List<Product> products = List.of();

    @ManyToOne(optional = false)
    @JsonManagedReference
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "box")
    @JsonManagedReference
    private List<Review> reviews = List.of();

    @OneToMany(mappedBy = "box")
    @JsonManagedReference
    private List<Image> images = List.of();

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}