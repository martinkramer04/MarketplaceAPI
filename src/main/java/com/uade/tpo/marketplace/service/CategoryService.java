package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.dto.Category.CreateCategoryRequest;
import com.uade.tpo.marketplace.entity.dto.Category.UpdateCategoryRequest;
import com.uade.tpo.marketplace.repository.CategoryRepository;

@Service
public class CategoryService implements IBaseService<
        Category, 
        CreateCategoryRequest, 
        UpdateCategoryRequest
    > {
    
    @Autowired
    private CategoryRepository categoryRepository;


    public List<Category> getAll() {
        return categoryRepository.findAll();
        // throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

    public Optional<Category> getById(Long id) {
        return categoryRepository.findById(id);
        // throw new UnsupportedOperationException("Unimplemented method 'create'");
    }

    public Optional<Category> create(CreateCategoryRequest entity) {
        Category category = new Category();
        category.setDescription(entity.getDescription());

        try {
            categoryRepository.save(category);
        } catch (Exception e) {
            throw new RuntimeException("Error creating category: " + e.getMessage());
        }

        return Optional.of(category);
    }

    public Optional<Category> update(UpdateCategoryRequest entity, Long id) {
        Category category = categoryRepository.findById(id)
            .orElse(null);

        if (category == null) {
            return Optional.empty();
        }

        category.setDescription(entity.getDescription());
        try {
            categoryRepository.save(category);
        } catch (Exception e) {
            throw new RuntimeException("Error updating category: " + e.getMessage());
        }
        return Optional.of(category);
    }

    public boolean delete(Long id) {
            Category category = categoryRepository.findById(id)
            .orElse(null);

        if (category == null) {
            return false;
        }

        try {
            categoryRepository.delete(category);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting category: " + e.getMessage());
        }

        return true;

    }
}
