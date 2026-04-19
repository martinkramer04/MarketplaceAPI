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

import com.uade.tpo.marketplace.entity.PaymentMethods;
import com.uade.tpo.marketplace.entity.dto.PaymentMethods.CreatePaymentMethodsRequest;
import com.uade.tpo.marketplace.entity.dto.PaymentMethods.UpdatePaymentMethodsRequest;
import com.uade.tpo.marketplace.service.PaymentMethodsService;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodsController {

    @Autowired
    private PaymentMethodsService paymentMethodsService;

    // GET
    @GetMapping
    public ResponseEntity<List<PaymentMethods>> getAll() {
        return ResponseEntity.ok(paymentMethodsService.getAll());
    }

    // GET
    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethods> getById(@PathVariable Long id) {
        Optional<PaymentMethods> result = paymentMethodsService.getById(id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST
    @PostMapping
    public ResponseEntity<PaymentMethods> create(@RequestBody CreatePaymentMethodsRequest request) {
        Optional<PaymentMethods> result = paymentMethodsService.create(request);
        return result.map(pm -> ResponseEntity.status(HttpStatus.CREATED).body(pm))
                .orElse(ResponseEntity.badRequest().build());
    }

    // PUT
    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethods> update(
            @PathVariable Long id,
            @RequestBody UpdatePaymentMethodsRequest request) {
        Optional<PaymentMethods> result = paymentMethodsService.update(request, id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = paymentMethodsService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}