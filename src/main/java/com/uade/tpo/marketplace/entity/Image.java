package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "image_table")
public class Image extends BaseEntity {
    private Blob image;

    @ManyToOne
    @JoinColumn(name = "box_id", nullable = false)
    @JsonBackReference
    private Box box;
}
