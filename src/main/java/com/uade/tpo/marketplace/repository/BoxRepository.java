package com.uade.tpo.marketplace.repository;
 
import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.uade.tpo.marketplace.entity.Box;
 
@Repository
public interface BoxRepository extends JpaRepository<Box, Long> {
 
    List<Box> findByCategoryId(Long categoryId);
 
    List<Box> findByStockGreaterThan(Integer stock);

    List<Box> findByUserId(Long userId);    
    List<Box> findByIsDeletedFalseAndStockGreaterThan(Integer stock);
}