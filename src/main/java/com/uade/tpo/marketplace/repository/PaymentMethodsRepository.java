package com.uade.tpo.marketplace.repository;
 
import com.uade.tpo.marketplace.entity.PaymentMethods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
@Repository
public interface PaymentMethodsRepository extends JpaRepository<PaymentMethods, Long> {
    
}