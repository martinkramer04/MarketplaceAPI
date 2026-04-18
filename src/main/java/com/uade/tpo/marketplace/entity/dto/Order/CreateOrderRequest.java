package com.uade.tpo.marketplace.entity.dto.Order;

import java.util.List;
import java.util.Optional;

import lombok.Data;

@Data
public class CreateOrderRequest {

    private Long paymentMethodId;
    private Optional<String> discountCode;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long boxId;
        private Integer quantity;
    }
}