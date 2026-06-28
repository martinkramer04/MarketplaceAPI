package com.uade.tpo.marketplace.entity.dto.Box;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemValidationResult {
    private Long boxId;
    private boolean valid;
    private Integer requestedQuantity;
    private Integer availableStock;
    // "REMOVE" | "UPDATE_QUANTITY" | null
    private String action;
    // "NOT_FOUND" | "UNAVAILABLE" | "OUT_OF_STOCK" | "INSUFFICIENT_STOCK" | null
    private String reason;
}
