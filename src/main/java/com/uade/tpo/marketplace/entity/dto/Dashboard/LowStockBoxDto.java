package com.uade.tpo.marketplace.entity.dto.Dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LowStockBoxDto {
    private Long boxId;
    private String boxName;
    private Integer stock;
}
