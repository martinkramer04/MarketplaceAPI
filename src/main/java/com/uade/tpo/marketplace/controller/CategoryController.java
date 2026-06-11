package com.uade.tpo.marketplace.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.dto.Category.CategoryDto;
import com.uade.tpo.marketplace.entity.dto.Category.CreateCategoryRequest;
import com.uade.tpo.marketplace.entity.dto.Category.UpdateCategoryRequest;
import com.uade.tpo.marketplace.entity.dto.Product.ProductDto;
import com.uade.tpo.marketplace.service.CategoryService;
import org.springframework.web.bind.annotation.CrossOrigin;import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // GET
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(categoryService.getAll().stream().map(CategoryDto::convertToDto)
                .collect(java.util.stream.Collectors.toList()));
    }

    // GET
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long categoryId) {
        Optional<Category> category = categoryService.getById(categoryId);
        if (category.isPresent()) {
            return ResponseEntity.ok(CategoryDto.convertToDto(category.get()));
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CreateCategoryRequest request) {
        CategoryDto createdCategory = categoryService.create(request)
                .map(CategoryDto::convertToDto)
                .orElse(null);
        if (createdCategory == null)
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(createdCategory);
    }

    // PUT
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> updateCategory(@RequestBody UpdateCategoryRequest request,
            @PathVariable Long categoryId) {
        CategoryDto updatedCategory = categoryService.update(request, categoryId)
                .map(CategoryDto::convertToDto)
                .orElse(null);
        if (updatedCategory == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedCategory);
    }

    // DELETE
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> deleteCategory(@PathVariable Long categoryId) {
        categoryService.delete(categoryId);
        return ResponseEntity.noContent().build();
    }
}
