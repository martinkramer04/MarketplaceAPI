package com.uade.tpo.marketplace.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.dto.Review.CreateReviewRequest;
import com.uade.tpo.marketplace.entity.dto.Review.ReviewDto;
import com.uade.tpo.marketplace.entity.dto.Review.UpdateReviewRequest;
import com.uade.tpo.marketplace.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewsService;

    // GET /api/reviews
    @GetMapping
    public ResponseEntity<List<ReviewDto>> getAll() {
        return ResponseEntity.ok(reviewsService.getAll());
    }

    // GET /api/reviews/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getById(@PathVariable Long id) {
        Optional<ReviewDto> result = reviewsService.getById(id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/reviews/box/{boxId}
    @GetMapping("/box/{boxId}")
    public ResponseEntity<List<ReviewDto>> getByBox(@PathVariable Long boxId) {
        return ResponseEntity.ok(reviewsService.getByBox(boxId));
    }

    // GET /api/reviews/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDto>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewsService.getByUser(userId));
    }

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<ReviewDto> create(@RequestBody CreateReviewRequest request) {
        Optional<ReviewDto> result = reviewsService.create(request);
        return result.map(r -> ResponseEntity.status(HttpStatus.CREATED).body(r))
                .orElse(ResponseEntity.badRequest().build());
    }

    // PUT /api/reviews/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> update(
            @PathVariable Long id,
            @RequestBody UpdateReviewRequest request) {
        Optional<ReviewDto> result = reviewsService.update(request, id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/reviews/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = reviewsService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}