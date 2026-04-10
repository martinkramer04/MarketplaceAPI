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
@Table(name = "order_details")
public class OrderDetails extends BaseEntity {
 
    @Column
    private Long orderId;
 
    @Column
    private Long boxId;
 
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
}
 