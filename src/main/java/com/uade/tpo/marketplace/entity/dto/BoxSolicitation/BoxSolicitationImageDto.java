package com.uade.tpo.marketplace.entity.dto.BoxSolicitation;

import java.sql.SQLException;
import java.util.Base64;

import com.uade.tpo.marketplace.entity.BoxSolicitationImage;

import lombok.Data;

@Data
public class BoxSolicitationImageDto {
    private Long id;
    private String name;
    private String base64Image;

    public static BoxSolicitationImageDto convertToDto(BoxSolicitationImage image) {
        BoxSolicitationImageDto dto = new BoxSolicitationImageDto();
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
