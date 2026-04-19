package com.uade.tpo.marketplace.entity.dto.Order;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.dto.Auth.UserDto;
import com.uade.tpo.marketplace.entity.dto.Discount.DiscountAdminDto;
import com.uade.tpo.marketplace.entity.dto.PaymentMethods.PaymentMethodsDto;

import lombok.Data;

@Data
public class OrderAdminDto {
    private Long id;
    private BigDecimal totalAmount;
    private String status;
    private Integer discountPercentage;
    private String discountCode;
    private String cardNumber;
    private String cvc;
    private String cardHolderName;
    private String cardExpiration;
    private List<OrderDetailsDto> orderDetails;
    private UserDto user;
    private Optional<DiscountAdminDto> discount;
    private PaymentMethodsDto paymentMethod;

    public static OrderAdminDto convertToDto(Order order) {
        OrderAdminDto dto = new OrderAdminDto();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name());
        dto.setDiscountPercentage(order.getDiscountPercentage());
        dto.setDiscountCode(order.getDiscountCode());
        dto.setCardNumber(order.getCardNumber());
        dto.setCvc(order.getCvc());
        dto.setCardHolderName(order.getCardHolderName());
        dto.setCardExpiration(order.getCardExpiration());
        dto.setOrderDetails(order.getOrderDetails().stream()
                .map(OrderDetailsDto::convertToDto)
                .toList());
        dto.setUser(UserDto.convertToDto(order.getUser()));
        dto.setPaymentMethod(PaymentMethodsDto.convertToDto(order.getPaymentMethods()));
        return dto;
    }
}
