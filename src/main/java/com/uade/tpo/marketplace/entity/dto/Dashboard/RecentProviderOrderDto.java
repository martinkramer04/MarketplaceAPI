package com.uade.tpo.marketplace.entity.dto.Dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentProviderOrderDto {
    private Long orderId;
    private String buyerName;
    private String boxName;
    private Integer quantity;
    private BigDecimal subtotal;
    private String status;
    private LocalDateTime createdAt;
}
