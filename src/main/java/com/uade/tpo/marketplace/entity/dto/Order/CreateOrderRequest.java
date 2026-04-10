package com.uade.tpo.marketplace.entity.dto.Order;
 
import java.util.List;
 
import lombok.Data;
 
@Data
public class CreateOrderRequest {
 
    private Long userId;
    private Long paymentMethodId;
    private String discountCode; 
    private List<OrderItemRequest> items;
 
    @Data
    public static class OrderItemRequest {
        private Long boxId;
        private Integer quantity;
    }
}