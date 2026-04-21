package com.uade.tpo.marketplace.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@Data
@MappedSuperclass
public class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Boolean isDeleted = false;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();
}
