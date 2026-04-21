package com.uade.tpo.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Box.CreateBoxRequest;
import com.uade.tpo.marketplace.entity.dto.Box.UpdateBoxRequest;
import com.uade.tpo.marketplace.repository.BoxRepository;
import com.uade.tpo.marketplace.repository.CategoryRepository;

@Service
public class BoxService implements IBaseService<Box, CreateBoxRequest, UpdateBoxRequest> {

    @Autowired
    private BoxRepository boxRepository;
    @Autowired
    private CategoryRepository categoryRepository;

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
        return boxRepository.findByIsDeletedFalseAndStockGreaterThan(0);
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

        Optional<Category> category = categoryRepository.findById(entity.getCategoryId());
        if (category.isEmpty()) {
            return Optional.empty();
        }

        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Box box = new Box();
        box.setCategory(category.get());
        box.setName(entity.getName());
        box.setDescription(entity.getDescription());
        box.setPrice(entity.getPrice());
        box.setStock(entity.getStock());
        box.setUser(currentUser);

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

        if (entity.getCategoryId() != null) {
            Optional<Category> category = categoryRepository.findById(entity.getCategoryId());
            if (category.isEmpty()) {
                return Optional.empty();
            }
            box.setCategory(category.get());
        }
        if (entity.getName() != null) {
            box.setName(entity.getName());
        }
        if (entity.getDescription() != null) {
            box.setDescription(entity.getDescription());
        }
        if (entity.getPrice() != null) {
            box.setPrice(entity.getPrice());
        }
        if (entity.getStock() != null) {
            box.setStock(entity.getStock());
        }
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
