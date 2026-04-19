package com.uade.tpo.marketplace.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Discount;
import com.uade.tpo.marketplace.entity.dto.Discount.DiscountAdminDto;
import com.uade.tpo.marketplace.entity.dto.Discount.CreateDiscountRequest;
import com.uade.tpo.marketplace.entity.dto.Discount.UpdateDiscountRequest;
import com.uade.tpo.marketplace.entity.dto.Discount.DiscountUserDto;
import com.uade.tpo.marketplace.service.DiscountService;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    // GET /api/discounts
    @GetMapping
    public ResponseEntity<List<DiscountAdminDto>> getAll() {
        return ResponseEntity.ok(discountService.getAll().stream().map(DiscountAdminDto::convertToDto)
                .collect(java.util.stream.Collectors.toList()));
    }

    // GET /api/discounts/active
    @GetMapping("/active")
    public ResponseEntity<List<DiscountUserDto>> getActive() {
        return ResponseEntity.ok(discountService.getActive().stream().map(DiscountUserDto::convertToDto)
                .collect(java.util.stream.Collectors.toList()));
    }

    // GET /api/discounts/{id}
    @GetMapping("/{id}")
    public ResponseEntity<DiscountAdminDto> getById(@PathVariable Long id) {
        Optional<Discount> result = discountService.getById(id);
        return result.map(DiscountAdminDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/discounts/code/{code} → validar cupón antes de aplicarlo
    @GetMapping("/code/{code}")
    public ResponseEntity<DiscountUserDto> getByCode(@PathVariable String code) {
        Optional<Discount> result = discountService.getByCode(code);
        return result.map(DiscountUserDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/discounts
    @PostMapping
    public ResponseEntity<DiscountAdminDto> create(@RequestBody CreateDiscountRequest request) {
        Optional<Discount> result = discountService.create(request);
        return result.map(d -> ResponseEntity.status(HttpStatus.CREATED).body(DiscountAdminDto.convertToDto(d)))
                .orElse(ResponseEntity.badRequest().build());
    }

    // PUT /api/discounts/{id}
    @PutMapping("/{id}")
    public ResponseEntity<DiscountAdminDto> update(
            @PathVariable Long id,
            @RequestBody UpdateDiscountRequest request) {
        Optional<Discount> result = discountService.update(request, id);
        return result.map(DiscountAdminDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/discounts/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = discountService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
