package com.uade.tpo.marketplace.entity.dto.Review;

import lombok.Data;

@Data
public class CreateReviewRequest {

    private Long boxId;
    private Integer rating; // Valor esperado: 1 a 5
    private String comment;
}
