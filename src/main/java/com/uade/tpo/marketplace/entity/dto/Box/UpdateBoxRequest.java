package com.uade.tpo.marketplace.entity.dto.Box;
 
import java.math.BigDecimal;
 
import lombok.Data;
 
@Data
public class UpdateBoxRequest {
 
    private Long categoryId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
}