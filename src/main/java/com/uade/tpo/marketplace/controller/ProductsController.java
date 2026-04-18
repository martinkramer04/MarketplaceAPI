package com.uade.tpo.marketplace.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.entity.dto.Product.CreateProductRequest;
import com.uade.tpo.marketplace.entity.dto.Product.UpdateProductRequest;
import com.uade.tpo.marketplace.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductsController {

    // Dependency Injection
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> get() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId) {
        Optional<Product> product = productService.getById(productId);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductRequest request) {
        request.setUserId(1L); // HARCODEO HASTA IMPLEMENTAR JWT
        return productService.create(request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(@RequestBody UpdateProductRequest request,
            @PathVariable Long productId) {
        Product updatedProduct = productService.update(request, productId).orElse(null);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Product> deleteProduct(@PathVariable Long productId) {
        productService.delete(productId);
        return ResponseEntity.noContent().build();
    }
}
