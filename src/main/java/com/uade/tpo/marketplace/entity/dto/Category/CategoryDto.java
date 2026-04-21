package com.uade.tpo.marketplace.entity.dto.Category;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.dto.Product.ProductDto;

import lombok.Data;

@Data
public class CategoryDto {
    private String name;
    private String description;
    private Long id;

    public static CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setName(category.getName());
        dto.setId(category.getId());
        dto.setDescription(category.getDescription());
        return dto;
    }

}
