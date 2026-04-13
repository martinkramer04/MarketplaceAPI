package com.uade.tpo.marketplace.entity;
 
import java.util.Date;

import com.uade.tpo.marketplace.entity.enums.DiscountTypeEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
 
@Data
@Entity
@Table(name = "discounts")
public class Discount extends BaseEntity {
 
    @Column
    private String name;
 
    @Column
    private Integer percentage;
 
    @Column
    private Boolean isActive;
 
    @Column
    @Temporal(TemporalType.DATE)
    private Date startDate;
 
    @Column
    @Temporal(TemporalType.DATE)
    private Date endDate;
 
    // Código único para descuentos tipo CUPON. Null si es GENERAL
    @Column(unique = true)
    private String code;
 
    @Enumerated(EnumType.STRING)
    @Column
    private DiscountTypeEnum discountType;
}