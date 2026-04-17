package com.uade.tpo.marketplace.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
@Data
@Entity
@Table(name = "categories")
public class Category extends BaseEntity {

    @Column
    private String description;

    @Column(nullable = false)
    private Long userId; 

    @OneToMany(mappedBy = "category")
    @JsonBackReference
    private List<Box> boxes;

}
