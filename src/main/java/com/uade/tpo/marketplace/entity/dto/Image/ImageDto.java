package com.uade.tpo.marketplace.entity.dto.Image;

import java.sql.SQLException;
import java.util.Base64;

import com.uade.tpo.marketplace.entity.Image;
import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.entity.dto.Product.ProductDto;

import lombok.Builder;
import lombok.Data;

@Data
public class ImageDto {
    private Long id;
    private String name;
    private String base64Image;

    public static ImageDto convertToDto(Image image) {
        ImageDto dto = new ImageDto();
        dto.setId(image.getId());
        dto.setName(image.getName());
        try {
            byte[] bytes = image.getImage().getBytes(1, (int) image.getImage().length());
            dto.setBase64Image(Base64.getEncoder().encodeToString(bytes));
        } catch (SQLException e) {
            throw new RuntimeException("Error converting image to Base64", e);
        }
        return dto;
    }
}