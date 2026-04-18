package com.uade.tpo.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Review.CreateReviewRequest;
import com.uade.tpo.marketplace.entity.dto.Review.ReviewDto;
import com.uade.tpo.marketplace.entity.dto.Review.UpdateReviewRequest;
import com.uade.tpo.marketplace.repository.BoxRepository;
import com.uade.tpo.marketplace.repository.ReviewRepository;
import com.uade.tpo.marketplace.repository.UserRepository;

@Service
public class ReviewService implements IBaseService<
        ReviewDto,
        CreateReviewRequest,
        UpdateReviewRequest> {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BoxRepository boxRepository;
    @Autowired
    private UserRepository userRepository;
 
    @Override
    public List<ReviewDto> getAll() {
        return reviewRepository.findAll().stream()
                .map(ReviewDto::convertToDto)
                .toList();
    }



    @Override
    public Optional<ReviewDto> getById(Long id) {
        return reviewRepository.findById(id).stream()
                .map(ReviewDto::convertToDto)
                .findFirst();
    }

    public List<ReviewDto> getByBox(Long boxId) {
        return reviewRepository.findByBoxId(boxId).stream()
                .map(ReviewDto::convertToDto)
                .toList();
    }

    public List<ReviewDto> getByUser(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(ReviewDto::convertToDto)
                .toList();
    }

    @Override
    public Optional<ReviewDto> create(CreateReviewRequest entity) {
        if (entity == null) {
            return Optional.empty();
        }

        if (entity.getUserId() == null || entity.getBoxId() == null
                || entity.getRating() == null) {
            return Optional.empty();
        }

        if (entity.getRating() < 1 || entity.getRating() > 5) {
            return Optional.empty();
        }

        Optional<Box> box = boxRepository.findById(entity.getBoxId());
        if (box.isEmpty()) {
            return Optional.empty();
        }

        Optional<User> user = userRepository.findById(entity.getUserId());
        if (user.isEmpty()) {
            return Optional.empty();
        }
 
        Review review = new Review();
        review.setUser(user.get());
        review.setBox(box.get());
        review.setRating(entity.getRating());
        review.setComment(entity.getComment());

        try {
            reviewRepository.save(review);
        } catch (Exception e) {
            throw new RuntimeException("Error creating review: " + e.getMessage());
        }

        return Optional.of(ReviewDto.convertToDto(review));
    }

    @Override
    public Optional<ReviewDto> update(UpdateReviewRequest entity, Long id) {
        Review review = reviewRepository.findById(id).orElse(null);

        if (review == null) {
            return Optional.empty();
        }

        if (entity.getRating() != null) {
            if (entity.getRating() < 1 || entity.getRating() > 5) {
                return Optional.empty();
            }
            review.setRating(entity.getRating());
        }

        if (entity.getComment() != null) {
            review.setComment(entity.getComment());
        }

        review.setUpdatedAt(LocalDateTime.now());

        try {
            reviewRepository.save(review);
        } catch (Exception e) {
            throw new RuntimeException("Error updating review: " + e.getMessage());
        }

        return Optional.of(ReviewDto.convertToDto(review));
    }

    @Override
    public boolean delete(Long id) {
        Review review = reviewRepository.findById(id).orElse(null);

        if (review == null) {
            return false;
        }

        try {
            reviewRepository.delete(review);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting review: " + e.getMessage());
        }

        return true;
    }
}