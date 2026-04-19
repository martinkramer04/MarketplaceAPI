package com.uade.tpo.marketplace.entity.dto.Order;

import com.uade.tpo.marketplace.entity.PaymentMethods;

import java.math.BigDecimal;
import java.util.List;

import com.uade.tpo.marketplace.entity.Discount;
import com.uade.tpo.marketplace.entity.Order;

import lombok.Data;

@Data
public class OrderUserDto {
    private BigDecimal totalAmount;
    private String status;
    private Integer discountPercentage;
    private String discountCode;
    private List<OrderDetailsDto> orderDetails;
    private Discount discount;
    private PaymentMethods paymentMethod;

    public static OrderUserDto convertToDto(Order order) {
        OrderUserDto dto = new OrderUserDto();
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name());
        dto.setDiscountPercentage(order.getDiscountPercentage());
        dto.setDiscountCode(order.getDiscountCode());
        dto.setOrderDetails(order.getOrderDetails().stream()
                .map(OrderDetailsDto::convertToDto)
                .toList());
        // Aquí se asume que el descuento se obtiene de alguna manera, por ejemplo, a
        // través de un servicio
        // dto.setDiscount(obtenerDescuentoParaOrden(order));
        dto.setPaymentMethod(order.getPaymentMethods());
        return dto;
    }
}