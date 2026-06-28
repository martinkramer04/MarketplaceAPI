package com.uade.tpo.marketplace.entity.dto.Box;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartValidationResponse {
    private List<CartItemValidationResult> results;
}
