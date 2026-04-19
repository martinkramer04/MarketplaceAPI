package com.uade.tpo.marketplace.entity.dto.Box;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale.Category;
import java.util.stream.Collectors;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.Image;
import com.uade.tpo.marketplace.entity.dto.Auth.UserDto;
import com.uade.tpo.marketplace.entity.dto.Image.ImageDto;
import com.uade.tpo.marketplace.entity.dto.Review.ReviewDto;

import lombok.Data;

@Data
public class BoxDto {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Category category;
    private List<ImageDto> images;

    public static BoxDto convertToDto(Box box) {
        BoxDto dto = new BoxDto();
        dto.setName(box.getName());
        dto.setDescription(box.getDescription());
        dto.setPrice(box.getPrice());
        dto.setStock(box.getStock());
        dto.setImages(
                box.getImages().stream()
                        .map(ImageDto::convertToDto)
                        .collect(Collectors.toList()));
        // dto.setCategory(box.getCategory());
        return dto;
    }

}
