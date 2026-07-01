package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.enums.ReviewStatusEnum;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBoxId(Long boxId);

    List<Review> findByUserId(Long userId);

    Review findByUserIdAndBoxIdAndStatus(Long userId, Long boxId, ReviewStatusEnum status);

    List<Review> findByUserIdAndStatus(Long userId, ReviewStatusEnum status);
}