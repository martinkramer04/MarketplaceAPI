package com.uade.tpo.marketplace.repository;
 
import java.util.List;

import com.uade.tpo.marketplace.entity.PaymentMethods;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface PaymentMethodsRepository extends JpaRepository<PaymentMethods, Long> {
    List<PaymentMethods> findByUserId(Long userId);
}