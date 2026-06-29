package com.uade.tpo.marketplace.entity;

import java.sql.Blob;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "box_solicitation_images")
public class BoxSolicitationImage extends BaseEntity {

    private String name;

    private Blob image;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "solicitation_id", nullable = false)
    private BoxSolicitation solicitation;
}
