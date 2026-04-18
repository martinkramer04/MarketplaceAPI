package com.uade.tpo.marketplace.entity.dto.Box;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale.Category;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.dto.Auth.UserDto;
import com.uade.tpo.marketplace.entity.dto.Review.ReviewDto;

import lombok.Data;

@Data
public class BoxDto {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Category category;


    public static BoxDto convertToDto(Box box) {
        BoxDto dto = new BoxDto();
        dto.setName(box.getName());
        dto.setDescription(box.getDescription());
        dto.setPrice(box.getPrice());
        dto.setStock(box.getStock());
        // dto.setCategory(box.getCategory());
        return dto;
    }

}
