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
import com.uade.tpo.marketplace.entity.dto.Category.CreateCategoryRequest;
import com.uade.tpo.marketplace.entity.dto.Category.UpdateCategoryRequest;
import com.uade.tpo.marketplace.service.CategoryService;



@RestController
@RequestMapping("Categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    //GET
    @GetMapping 
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryService.getAll());
    }
    
    //GET
    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Optional<Category> category = categoryService.getById(categoryId);
        if (category.isPresent()) {
            return ResponseEntity.ok(category.get());
        } 

        return ResponseEntity.notFound().build();
    }
    //POST
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CreateCategoryRequest request) {
        request.setUserId(1L); //MODIFICAR LUEGO DE IMPLEMENTAR JWT
        Category createdCategory = categoryService.create(request).orElse(null);
        if (createdCategory == null) return ResponseEntity.badRequest().build();
            return ResponseEntity.ok(createdCategory);
    }

    //PUT
    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(@RequestBody UpdateCategoryRequest request, @PathVariable Long categoryId) {
        Category updatedCategory = categoryService.update(request, categoryId).orElse(null);
        if (updatedCategory == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedCategory);
    }

    //DELETE
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Category> deleteCategory(@PathVariable Long categoryId) {
        categoryService.delete(categoryId);
        return ResponseEntity.noContent().build();
    }
}
