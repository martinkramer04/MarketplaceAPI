package com.uade.tpo.marketplace.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "order_details")
public class OrderDetails extends BaseEntity {

    @Column
    private String boxName;

    @Column
    private Integer quantity;

    @Column
    private BigDecimal unitPrice;

    @Column
    private BigDecimal subtotal;

    @Column
    private BigDecimal discountAmount;

    @Column
    private Integer boxStock;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @ManyToOne
    @JoinColumn(name = "box_id", nullable = false)
    @JsonBackReference
    private Box box;
}
