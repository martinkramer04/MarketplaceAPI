package com.uade.tpo.marketplace.entity.dto.BoxSolicitation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.uade.tpo.marketplace.entity.BoxSolicitation;

import lombok.Data;

@Data
public class BoxSolicitationDto {
    private Long id;
    private String title;
    private String shortDescription;
    private String detailedDescription;
    private BigDecimal price;
    private Long categoryId;
    private String cancellationPolicy;
    private String subProviders;
    private List<BoxSolicitationImageDto> images;
    private String status;
    private Long providerId;
    private LocalDateTime createdAt;

    public static BoxSolicitationDto convertToDto(BoxSolicitation s) {
        BoxSolicitationDto dto = new BoxSolicitationDto();
        dto.setId(s.getId());
        dto.setTitle(s.getTitle());
        dto.setShortDescription(s.getShortDescription());
        dto.setDetailedDescription(s.getDetailedDescription());
        dto.setPrice(s.getPrice());
        dto.setCategoryId(s.getCategory() != null ? s.getCategory().getId() : null);
        dto.setCancellationPolicy(s.getCancellationPolicy());
        dto.setSubProviders(s.getSubProviders());
        dto.setImages(s.getImages().stream().map(BoxSolicitationImageDto::convertToDto).toList());
        dto.setStatus(s.getStatus() != null ? s.getStatus().name() : null);
        dto.setProviderId(s.getUser() != null ? s.getUser().getId() : null);
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }
}
