package com.uade.tpo.marketplace.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.service.CategoryService;



@RestController
@RequestMapping("Categories")
public class CategoryController {
    @GetMapping 
    public String getCategories() {
        CategoryService categoryService = new CategoryService();
        return categoryService.getCategories();
    }

    @GetMapping("{categoryId}")
    public String getCategoryById(@PathVariable String categoryId) {
        CategoryService categoryService = new CategoryService();
        return categoryService.getCategoryById(categoryId); 
    }
    
    @PostMapping("path")
    public String createCategory(@RequestBody String categoryId) {
        CategoryService categoryService = new CategoryService();
        return categoryService.createCategory(categoryId);
    }
}
