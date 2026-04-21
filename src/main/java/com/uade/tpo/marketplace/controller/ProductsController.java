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
import com.uade.tpo.marketplace.entity.dto.Product.ProductDto;
import com.uade.tpo.marketplace.entity.dto.Product.UpdateProductRequest;
import com.uade.tpo.marketplace.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductsController {

    // Dependency Injection
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> get() {
        return ResponseEntity.ok(productService.getAll().stream().map(ProductDto::convertToDto)
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long productId) {
        Optional<Product> product = productService.getById(productId);
        if (product.isPresent()) {
            return ResponseEntity.ok(ProductDto.convertToDto(product.get()));
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody CreateProductRequest request) {
        return productService.create(request)
                .map(ProductDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductDto> updateProduct(@RequestBody UpdateProductRequest request,
            @PathVariable Long productId) {
        Product updatedProduct = productService.update(request, productId).orElse(null);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ProductDto.convertToDto(updatedProduct));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ProductDto> deleteProduct(@PathVariable Long productId) {
        productService.delete(productId);
        return ResponseEntity.noContent().build();
    }
}
