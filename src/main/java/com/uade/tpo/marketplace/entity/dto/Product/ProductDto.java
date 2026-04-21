package com.uade.tpo.marketplace.entity.dto.Product;

import com.uade.tpo.marketplace.entity.Product;

import lombok.Data;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;

    public static ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        return dto;
    }

}
