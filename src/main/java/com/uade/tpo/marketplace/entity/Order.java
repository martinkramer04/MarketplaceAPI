package com.uade.tpo.marketplace.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.uade.tpo.marketplace.entity.enums.StatusOrderEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

    @Column
    private Long paymentMethodId;

    @Column
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column
    private StatusOrderEnum status;

    @Column
    private Integer discountPercentage;

    @Column
    private String discountCode;

    @OneToMany(mappedBy = "order")
    @JsonManagedReference
    private List<OrderDetails> orderDetails;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = true)
    @JoinColumn(name = "discount_id", nullable = true)
    private Discount discount;
}