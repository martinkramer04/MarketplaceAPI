package com.uade.tpo.marketplace.repository;
 
import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.uade.tpo.marketplace.entity.OrderDetails;
 
@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {
 
    List<OrderDetails> findByOrderId(Long orderId);
}