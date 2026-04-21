package com.uade.tpo.marketplace.entity.dto.Box;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class CreateBoxRequest {

    private Long categoryId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Long[] productIds;
}