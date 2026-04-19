package com.uade.tpo.marketplace.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderDetails;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Order.CreateOrderRequest;
import com.uade.tpo.marketplace.entity.dto.Order.UpdateOrderRequest;
import com.uade.tpo.marketplace.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // GET /api/orders
    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    // GET /api/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        Optional<Order> result = orderService.getById(id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/orders/{id}/details
    @GetMapping("/{id}/details")
    public ResponseEntity<List<OrderDetails>> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getDetailsByOrder(id));
    }

    // GET /api/orders/user
    @GetMapping("/user")
    public ResponseEntity<List<Order>> getByUser() {
        return ResponseEntity.ok(orderService.getByUser());
    }

    // POST /api/orders
    @PostMapping
    public ResponseEntity<Order> create(@RequestBody CreateOrderRequest request) {
        Optional<Order> result = orderService.create(request);
        return result.map(o -> ResponseEntity.status(HttpStatus.CREATED).body(o))
                .orElse(ResponseEntity.badRequest().build());
    }

    // PUT /api/orders/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Order> update(
            @PathVariable Long id,
            @RequestBody UpdateOrderRequest request) {
        Optional<Order> result = orderService.update(request, id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/orders/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = orderService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}