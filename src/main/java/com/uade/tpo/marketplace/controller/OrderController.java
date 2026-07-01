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

import java.util.Set;
import java.util.stream.Collectors;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderDetails;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Order.CreateOrderRequest;
import com.uade.tpo.marketplace.entity.dto.Order.OrderAdminDto;
import com.uade.tpo.marketplace.entity.dto.Order.OrderDetailsDto;
import com.uade.tpo.marketplace.entity.dto.Order.OrderUserDto;
import com.uade.tpo.marketplace.entity.dto.Order.UpdateOrderRequest;
import com.uade.tpo.marketplace.entity.enums.ReviewStatusEnum;
import com.uade.tpo.marketplace.repository.ReviewRepository;
import com.uade.tpo.marketplace.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReviewRepository reviewRepository;

    // GET /api/orders
    @GetMapping
    public ResponseEntity<List<OrderAdminDto>> getAll() {
        return ResponseEntity.ok(orderService.getAll().stream()
                .map(OrderAdminDto::convertToDto)
                .toList());
    }

    // GET /api/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<OrderAdminDto> getById(@PathVariable Long id) {
        return orderService.getById(id).map(OrderAdminDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/orders/{id}/details
    @GetMapping("/{id}/details")
    public ResponseEntity<List<OrderDetailsDto>> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getDetailsByOrder(id).stream()
                .map(OrderDetailsDto::convertToDto)
                .toList());
    }

    // GET /api/orders/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderUserDto>> getByUser(@PathVariable Long userId) {
        Set<Long> pendingReviewBoxIds = reviewRepository
                .findByUserIdAndStatus(userId, ReviewStatusEnum.WAITING_REVIEW)
                .stream()
                .filter(r -> r.getBox() != null)
                .map(r -> r.getBox().getId())
                .collect(Collectors.toSet());

        return ResponseEntity.ok(orderService.getByUser(userId).stream()
                .map(o -> OrderUserDto.convertToDto(o, pendingReviewBoxIds))
                .toList());
    }

    // POST /api/orders
    @PostMapping
    public ResponseEntity<OrderUserDto> create(@RequestBody CreateOrderRequest request) {
        Optional<Order> result = orderService.create(request);
        return result.map(o -> ResponseEntity.status(HttpStatus.CREATED).body(OrderUserDto.convertToDto(o)))
                .orElse(ResponseEntity.badRequest().build());
    }

    // PUT /api/orders/{id}
    @PutMapping("/{id}")
    public ResponseEntity<OrderUserDto> update(
            @PathVariable Long id,
            @RequestBody UpdateOrderRequest request) {
        Optional<Order> result = orderService.update(request, id);
        return result.map(o -> ResponseEntity.ok(OrderUserDto.convertToDto(o)))
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