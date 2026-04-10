package com.uade.tpo.marketplace.entity;
 
import java.time.LocalDateTime;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
 
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {
 
    @Column
    private LocalDateTime createdAt;
 
    @Column
    private Integer rating;
 
    @Column
    private String comment;
 
    @Column
    private Long userId;
 
    @Column
    private Long boxId;
}