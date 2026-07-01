package com.uade.tpo.marketplace.entity.dto.Box;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class StockUpdateRequest {

    @NotNull
    @Positive
    private Integer amount;
}