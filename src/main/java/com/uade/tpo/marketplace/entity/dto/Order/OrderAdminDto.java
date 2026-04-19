package com.uade.tpo.marketplace.entity.dto.Order;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.access.method.P;

import com.uade.tpo.marketplace.entity.Discount;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderDetails;
import com.uade.tpo.marketplace.entity.PaymentMethods;
import com.uade.tpo.marketplace.entity.User;

import lombok.Data;

@Data
public class OrderAdminDto {
    private BigDecimal totalAmount;
    private String status;
    private Integer discountPercentage;
    private String discountCode;
    private String cardNumber;
    private String cvc;
    private String cardHolderName;
    private String cardExpiration;
    private List<OrderDetailsDto> orderDetails;
    private User user;
    private Discount discount;
    private PaymentMethods paymentMethod;

    public static OrderAdminDto convertToDto(Order order) {
        OrderAdminDto dto = new OrderAdminDto();
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
        dto.setUser(order.getUser());
        // Aquí se asume que el descuento se obtiene de alguna manera, por ejemplo, a
        // través de un servicio
        // dto.setDiscount(obtenerDescuentoParaOrden(order));
        dto.setPaymentMethod(order.getPaymentMethods());
        return dto;
    }
}
