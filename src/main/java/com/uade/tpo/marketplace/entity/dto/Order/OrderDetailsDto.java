package com.uade.tpo.marketplace.entity.dto.Order;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderDetails;
import lombok.Data;

@Data
public class OrderDetailsDto {
    private String boxName;
    private Integer quantity;
    private String unitPrice;
    private String subtotal;
    private String discountAmount;
    private Integer boxStock;
    private Order order;
    private Box box;

    public static OrderDetailsDto convertToDto(OrderDetails orderDetails) {
        OrderDetailsDto dto = new OrderDetailsDto();
        dto.setBoxName(orderDetails.getBoxName());
        dto.setQuantity(orderDetails.getQuantity());
        dto.setUnitPrice(orderDetails.getUnitPrice().toString());
        dto.setSubtotal(orderDetails.getSubtotal().toString());
        dto.setDiscountAmount(orderDetails.getDiscountAmount().toString());
        dto.setBoxStock(orderDetails.getBoxStock());
        dto.setOrder(orderDetails.getOrder());
        dto.setBox(orderDetails.getBox());
        return dto;
    }

}
