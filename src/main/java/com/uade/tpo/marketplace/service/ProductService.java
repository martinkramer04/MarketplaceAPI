package com.uade.tpo.marketplace.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.entity.dto.Product.CreateProductRequest;
import com.uade.tpo.marketplace.entity.dto.Product.UpdateProductRequest;
import com.uade.tpo.marketplace.repository.CategoryRepository;
import com.uade.tpo.marketplace.repository.ProductRepository;

@Service
public class ProductService implements IBaseService<Product, CreateProductRequest, UpdateProductRequest> {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public List<Product> getByUserId(Long userId) {
        return productRepository.findByUserId(userId);
    }

    public Optional<Product> getById(Long id) {
        return productRepository.findById(id);
    }

    public Optional<Product> create(CreateProductRequest entity) {

        if (entity == null) {
            return Optional.empty();
        }

        if (entity.getName() == null || entity.getPrice() == null || entity.getStock() == null
                || entity.getCategoryId() == null || entity.getUserId() == null) {
            return Optional.empty();
        }

        Optional<Category> category = categoryRepository.findById(entity.getCategoryId());
        if (!category.isPresent()) {
            return Optional.empty();
        }

        Product product = new Product();

        product.setName(entity.getName());
        product.setPrice(entity.getPrice());
        product.setStock(entity.getStock());
        product.setCategory(category.get());
        product.setImageUrl(entity.getImageUrl());
        product.setDescription(entity.getDescription());
        product.setUserId(entity.getUserId());

        try {
            productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Error creating product: " + e.getMessage());
        }

        return Optional.of(product);
    }

    public Optional<Product> update(UpdateProductRequest entity, Long id) {
        Product product = productRepository.findById(id)
                .orElse(null);

        if (product == null) {
            return Optional.empty();
        }

        Optional<Category> category = categoryRepository.findById(entity.getCategoryId());
        if (!category.isPresent()) {
            return Optional.empty();
        }

        product.setName(entity.getName());
        product.setPrice(entity.getPrice());
        product.setStock(entity.getStock());
        product.setCategory(category.get());
        product.setImageUrl(entity.getImageUrl());
        product.setDescription(entity.getDescription());

        product.setUpdatedAt(LocalDateTime.now());

        try {
            productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Error updating product: " + e.getMessage());
        }
        return Optional.of(product);
    }

    public boolean delete(Long id) {
        Product product = productRepository.findById(id)
                .orElse(null);

        if (product == null) {
            return false;
        }

        try {
            productRepository.delete(product);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting product: " + e.getMessage());
        }

        return true;

    }

}
