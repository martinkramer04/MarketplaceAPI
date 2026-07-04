package com.uade.tpo.marketplace.entity.dto.Image;

import java.sql.SQLException;

import com.uade.tpo.marketplace.entity.Image;
import com.uade.tpo.marketplace.util.ImageBlobUtils;

import lombok.Data;

@Data
public class ImageDto {
    private Long id;
    private String name;
    private String url;

    public static ImageDto convertToDto(Image image) {
        ImageDto dto = new ImageDto();
        dto.setId(image.getId());
        dto.setName(image.getName());
        try {
            byte[] bytes = image.getImage().getBytes(1, (int) image.getImage().length());
            dto.setUrl(ImageBlobUtils.resolveSrc(bytes));
        } catch (SQLException e) {
            throw new RuntimeException("Error converting image", e);
        }
        return dto;
    }
}