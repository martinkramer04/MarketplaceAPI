package com.uade.tpo.marketplace.entity;
 
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
 
@Data
@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {
 
    @Column
    private Integer rating;
 
    @Column
    private String comment;
 
    @Column
    private Long userId;
 
    @ManyToOne
    @JoinColumn(name = "box_id", nullable = false)
    @JsonBackReference
    private Box box;
}