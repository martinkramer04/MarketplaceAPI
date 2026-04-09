package com.uade.tpo.marketplace.entity;
 
import java.math.BigDecimal;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
 
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "boxes")
public class Box extends BaseEntity {
 
    @Column
    private Long categoryId;
 
    @Column
    private String name;
 
    @Column
    private String description;
 
    @Column
    private BigDecimal price;
 
    @Column
    private Integer stock;
}