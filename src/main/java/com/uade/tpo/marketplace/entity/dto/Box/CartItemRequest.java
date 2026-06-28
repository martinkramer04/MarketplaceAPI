package com.uade.tpo.marketplace.entity.dto.Box;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long boxId;
    private Integer quantity;
}
