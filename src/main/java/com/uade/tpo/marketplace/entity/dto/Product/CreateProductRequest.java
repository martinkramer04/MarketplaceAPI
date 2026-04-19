package com.uade.tpo.marketplace.entity.dto.Product;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateProductRequest {
    private String name;
    private String description;
    private Integer stock;
    private Long categoryId;
    private String imageUrl;
    private BigDecimal price;
}
