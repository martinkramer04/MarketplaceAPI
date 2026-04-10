package com.uade.tpo.marketplace.repository;
 
import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.enums.StatusOrderEnum;
 
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
 
    List<Order> findByUserId(Long userId);
 
    List<Order> findByStatus(StatusOrderEnum status);
}