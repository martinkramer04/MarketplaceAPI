package com.uade.tpo.marketplace.entity.dto.Dashboard;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopBoxStatDto {
    private Long boxId;
    private String boxName;
    private long unitsSold;
    private BigDecimal revenue;
}
