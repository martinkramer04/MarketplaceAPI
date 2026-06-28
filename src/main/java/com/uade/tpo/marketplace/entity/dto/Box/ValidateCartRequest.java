package com.uade.tpo.marketplace.entity.dto.Box;

import java.util.List;

import lombok.Data;

@Data
public class ValidateCartRequest {
    private List<CartItemRequest> items;
}
