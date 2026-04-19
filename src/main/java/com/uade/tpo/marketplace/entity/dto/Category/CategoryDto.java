package com.uade.tpo.marketplace.entity.dto.Category;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.dto.Product.ProductDto;

import lombok.Data;

@Data
public class CategoryDto {
    private String name;
    private String description;
    private Long id;

    public static ProductDto convertToDto(Category category) {
        ProductDto dto = new ProductDto();
        dto.setName(category.getName());
        dto.setId(category.getId());
        dto.setDescription(category.getDescription());
        return dto;
    }

}
