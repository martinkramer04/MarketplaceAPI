package com.uade.tpo.marketplace.entity.dto.Review;
 
import lombok.Data;
 
@Data
public class UpdateReviewRequest {
 
    private Integer rating;
    private String comment;
}
 
