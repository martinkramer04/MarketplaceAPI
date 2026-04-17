package com.uade.tpo.marketplace.service;
 
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.dto.Box.CreateBoxRequest;
import com.uade.tpo.marketplace.entity.dto.Box.UpdateBoxRequest;
import com.uade.tpo.marketplace.repository.BoxRepository;
 
@Service
public class BoxService implements IBaseService<
        Box,
        CreateBoxRequest,
        UpdateBoxRequest> {
 
    @Autowired
    private BoxRepository boxRepository;
 
    @Override
    public List<Box> getAll() {
        return boxRepository.findAll();
    }
 
    @Override
    public Optional<Box> getById(Long id) {
        return boxRepository.findById(id);
    }
 
    // Método extra: cajas por categoría
    public List<Box> getByCategory(Long categoryId) {
        return boxRepository.findByCategoryId(categoryId);
    }
    
    public List<Box> getByUserId(Long userId) {
        return boxRepository.findByUserId(userId);
    }
 
    // Método extra: cajas con stock disponible
    public List<Box> getAvailable() {
        return boxRepository.findByStockGreaterThan(0);
    }
 
    @Override
    public Optional<Box> create(CreateBoxRequest entity) {
        if (entity == null) {
            return Optional.empty();
        }
 
        if (entity.getName() == null || entity.getPrice() == null
                || entity.getStock() == null || entity.getCategoryId() == null) {
            return Optional.empty();
        }
 
        Box box = new Box();
        box.setCategoryId(entity.getCategoryId());
        box.setName(entity.getName());
        box.setDescription(entity.getDescription());
        box.setPrice(entity.getPrice());
        box.setStock(entity.getStock());
        box.setUserId(entity.getUserId());

        try {
            boxRepository.save(box);
        } catch (Exception e) {
            throw new RuntimeException("Error creating box: " + e.getMessage());
        }
 
        return Optional.of(box);
    }
 
    @Override
    public Optional<Box> update(UpdateBoxRequest entity, Long id) {
        Box box = boxRepository.findById(id)
                .orElse(null);
 
        if (box == null) {
            return Optional.empty();
        }
 
        box.setCategoryId(entity.getCategoryId());
        box.setName(entity.getName());
        box.setDescription(entity.getDescription());
        box.setPrice(entity.getPrice());
        box.setStock(entity.getStock());
        box.setUpdatedAt(LocalDateTime.now());
 
        try {
            boxRepository.save(box);
        } catch (Exception e) {
            throw new RuntimeException("Error updating box: " + e.getMessage());
        }
 
        return Optional.of(box);
    }
 
    @Override
    public boolean delete(Long id) {
        Box box = boxRepository.findById(id)
                .orElse(null);
 
        if (box == null) {
            return false;
        }
 
        try {
            boxRepository.delete(box);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting box: " + e.getMessage());
        }
 
        return true;
    }
}
