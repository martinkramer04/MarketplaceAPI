package com.uade.tpo.marketplace.entity.dto.Order;

import com.uade.tpo.marketplace.entity.PaymentMethods;
import com.uade.tpo.marketplace.entity.dto.Discount.DiscountUserDto;
import com.uade.tpo.marketplace.entity.dto.PaymentMethods.PaymentMethodsDto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.uade.tpo.marketplace.entity.Discount;
import com.uade.tpo.marketplace.entity.Order;

import lombok.Data;

@Data
public class OrderUserDto {
    private Long id;
    private BigDecimal totalAmount;
    private String status;
    private Integer discountPercentage;
    private String discountCode;
    private List<OrderDetailsDto> orderDetails;
    private Optional<DiscountUserDto> discount;
    private PaymentMethodsDto paymentMethod;

    public static OrderUserDto convertToDto(Order order) {
        OrderUserDto dto = new OrderUserDto();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name());
        dto.setDiscountPercentage(order.getDiscountPercentage());
        dto.setDiscountCode(order.getDiscountCode());
        dto.setOrderDetails(order.getOrderDetails() != null
                ? order.getOrderDetails().stream()
                        .map(OrderDetailsDto::convertToDto)
                        .toList()
                : List.of());

        dto.setDiscount(Optional.ofNullable(order.getDiscount()).map(DiscountUserDto::convertToDto));
        dto.setPaymentMethod(PaymentMethodsDto.convertToDto(order.getPaymentMethods()));
        return dto;
    }
}