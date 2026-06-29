package com.uade.tpo.marketplace.entity.dto.BoxSolicitation;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateBoxSolicitationRequest {
    private String title;
    private String shortDescription;
    private String detailedDescription;
    private BigDecimal price;
    private Long categoryId;
    private String cancellationPolicy;
    private String subProviders;
}
