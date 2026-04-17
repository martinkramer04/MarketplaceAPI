package com.uade.tpo.marketplace.entity;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
 
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "providers")
public class Provider extends BaseEntity {
 
    @Column
    private Long userId;
 
    @Column
    private String companyName;
 
    @Column
    private String email;
 
    @Column
    private String phone;
}
