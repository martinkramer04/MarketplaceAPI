package com.uade.tpo.marketplace.entity.dto.Order;

import java.math.BigDecimal;

import com.uade.tpo.marketplace.entity.OrderDetails;
import com.uade.tpo.marketplace.entity.dto.Box.BoxDto;

import lombok.Data;

@Data
public class OrderDetailsDto {
    private String boxName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private Integer boxStock;
    private BoxDto box;

    public static OrderDetailsDto convertToDto(OrderDetails orderDetails) {
        OrderDetailsDto dto = new OrderDetailsDto();
        dto.setBoxName(orderDetails.getBoxName());
        dto.setQuantity(orderDetails.getQuantity());
        dto.setUnitPrice(orderDetails.getUnitPrice());
        dto.setSubtotal(orderDetails.getSubtotal());
        dto.setDiscountAmount(orderDetails.getDiscountAmount());
        dto.setBoxStock(orderDetails.getBoxStock());
        dto.setBox(BoxDto.convertToDto(orderDetails.getBox()));
        return dto;
    }

}
