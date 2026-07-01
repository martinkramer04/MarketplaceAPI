package com.uade.tpo.marketplace.entity.dto.Review;

import java.time.LocalDateTime;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.dto.Auth.UserDto;
import com.uade.tpo.marketplace.entity.dto.Box.BoxDto;

import lombok.Data;

@Data
public class ReviewDto {

    private Long id;
    private LocalDateTime createdAt;
    private String status;
    private String comment;
    private Integer rating;
    private UserDto user;
    private BoxDto box;

    public static ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setStatus(review.getStatus().name());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUser(UserDto.convertToDto(review.getUser()));
        dto.setBox(BoxDto.convertToDto(review.getBox()));
        return dto;
    }
}
