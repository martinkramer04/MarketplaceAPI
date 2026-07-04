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
public class RecentOrderDto {
    private Long orderId;
    private String buyerName;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
}
