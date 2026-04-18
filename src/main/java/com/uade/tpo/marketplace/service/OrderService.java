package com.uade.tpo.marketplace.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.Discount;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderDetails;
import com.uade.tpo.marketplace.entity.dto.Order.CreateOrderRequest;
import com.uade.tpo.marketplace.entity.dto.Order.UpdateOrderRequest;
import com.uade.tpo.marketplace.entity.enums.StatusOrderEnum;
import com.uade.tpo.marketplace.repository.BoxRepository;
import com.uade.tpo.marketplace.repository.DiscountRepository;
import com.uade.tpo.marketplace.repository.OrderDetailsRepository;
import com.uade.tpo.marketplace.repository.OrderRepository;

import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.entity.User;

@Service
public class OrderService implements IBaseService<Order, CreateOrderRequest, UpdateOrderRequest> {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private BoxRepository boxRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<OrderDetails> getDetailsByOrder(Long orderId) {
        return orderDetailsRepository.findByOrderId(orderId);
    }

    @Override
    public Optional<Order> create(CreateOrderRequest entity) {
        if (entity == null) {
            return Optional.empty();
        }

        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (currentUser == null || entity.getPaymentMethodId() == null
                || entity.getItems() == null || entity.getItems().isEmpty()) {
            return Optional.empty();
        }

        // Resolver descuento si se envió un código
        Discount discount = null;
        if (entity.getDiscountCode() != null && !entity.getDiscountCode().isEmpty()) {
            discount = discountRepository.findByCode(entity.getDiscountCode().orElse(""))
                    .orElse(null);
            if (discount != null && !discount.getIsActive()) {
                discount = null;
            }
        }

        Order order = new Order();
        User user = userRepository.findById(currentUser.getId()).orElse(null);
        if (user == null) {
            return Optional.empty();
        }
        order.setUser(user);
        order.setPaymentMethodId(entity.getPaymentMethodId());
        order.setStatus(StatusOrderEnum.GENERADA);
        order.setCreatedAt(LocalDateTime.now());

        if (discount != null) {
            order.setDiscount(discount);
            order.setDiscountPercentage(discount.getPercentage());
            order.setDiscountCode(discount.getCode());
        }

        try {
            orderRepository.save(order);
        } catch (Exception e) {
            throw new RuntimeException("Error creating order: " + e.getMessage());
        }

        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest item : entity.getItems()) {
            Box box = boxRepository.findById(item.getBoxId()).orElse(null);
            if (box == null || box.getStock() < item.getQuantity()) {
                continue;
            }

            BigDecimal unitPrice = box.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            BigDecimal discountAmount = BigDecimal.ZERO;

            if (discount != null) {
                discountAmount = subtotal.multiply(
                        BigDecimal.valueOf(discount.getPercentage()).divide(BigDecimal.valueOf(100)));
                subtotal = subtotal.subtract(discountAmount);
            }

            OrderDetails detail = new OrderDetails();
            // detail.setOrderId(order.getId());
            detail.setOrder(order);
            detail.setBoxId(box.getId());
            detail.setBoxName(box.getName());
            detail.setQuantity(item.getQuantity());
            detail.setUnitPrice(unitPrice);
            detail.setSubtotal(subtotal);
            detail.setDiscountAmount(discountAmount);
            detail.setBoxStock(box.getStock());

            total = total.add(subtotal);

            box.setStock(box.getStock() - item.getQuantity());

            try {
                orderDetailsRepository.save(detail);
                boxRepository.save(box);
            } catch (Exception e) {
                throw new RuntimeException("Error creating order detail: " + e.getMessage());
            }
        }

        order.setTotalAmount(total);

        try {
            orderRepository.save(order);
        } catch (Exception e) {
            throw new RuntimeException("Error updating order total: " + e.getMessage());
        }

        return Optional.of(order);
    }

    @Override
    public Optional<Order> update(UpdateOrderRequest entity, Long id) {
        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return Optional.empty();
        }

        order.setStatus(entity.getStatus());
        order.setUpdatedAt(LocalDateTime.now());

        try {
            orderRepository.save(order);
        } catch (Exception e) {
            throw new RuntimeException("Error updating order: " + e.getMessage());
        }

        return Optional.of(order);
    }

    @Override
    public boolean delete(Long id) {
        Order order = orderRepository.findById(id).orElse(null);

        if (order == null) {
            return false;
        }

        try {
            orderRepository.delete(order);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting order: " + e.getMessage());
        }

        return true;
    }
}