package com.uade.tpo.marketplace.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.uade.tpo.marketplace.entity.enums.StatusOrderEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

    @Column
    private Long userId;

    @Column
    private Long paymentMethodId;

    @Column
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column
    private StatusOrderEnum status;

    @Column
    private LocalDateTime createdAt;

    @Column
    private Long discountId;

    @Column
    private Integer discountPercentage;

    @Column
    private String discountCode;

    @OneToMany(mappedBy = "order")
    private List<OrderDetails> orderDetails;
}