package com.uade.tpo.marketplace.entity;
 
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "payment_methods")
@Data
@EqualsAndHashCode(callSuper = true)
public class PaymentMethods extends BaseEntity{
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false)
    private String name;
 
    @Column
    private String description;
}
