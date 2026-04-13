package com.uade.tpo.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.dto.Review.CreateReviewRequest;
import com.uade.tpo.marketplace.entity.dto.Review.UpdateReviewRequest;
import com.uade.tpo.marketplace.repository.ReviewRepository;

@Service
public class ReviewService implements IBaseService<
        Review,
        CreateReviewRequest,
        UpdateReviewRequest> {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    @Override
    public Optional<Review> getById(Long id) {
        return reviewRepository.findById(id);
    }

    public List<Review> getByBox(Long boxId) {
        return reviewRepository.findByBoxId(boxId);
    }

    public List<Review> getByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Override
    public Optional<Review> create(CreateReviewRequest entity) {
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

        Review review = new Review();
        review.setUserId(entity.getUserId());
        review.setBoxId(entity.getBoxId());
        review.setRating(entity.getRating());
        review.setComment(entity.getComment());
        review.setCreatedAt(LocalDateTime.now());

        try {
            reviewRepository.save(review);
        } catch (Exception e) {
            throw new RuntimeException("Error creating review: " + e.getMessage());
        }

        return Optional.of(review);
    }

    @Override
    public Optional<Review> update(UpdateReviewRequest entity, Long id) {
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

        return Optional.of(review);
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