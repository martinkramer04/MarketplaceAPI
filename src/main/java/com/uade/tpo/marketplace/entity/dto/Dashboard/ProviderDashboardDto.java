package com.uade.tpo.marketplace.entity.dto.Dashboard;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDashboardDto {

    // Catalog owned by the provider
    private long totalBoxes;
    private long approvedBoxes;
    private long pendingBoxes;
    private long rejectedBoxes;
    private long totalProducts;

    // Sales performance (confirmed orders only)
    private long totalOrders;
    private long totalUnitsSold;
    private BigDecimal totalRevenue;
    private BigDecimal revenueThisMonth;
    private BigDecimal revenueLastMonth;

    // Reviews on the provider's boxes
    private long totalReviews;
    private double averageRating;

    // Box solicitations submitted by the provider
    private long pendingBoxSolicitations;
    private long approvedBoxSolicitations;
    private long rejectedBoxSolicitations;

    private List<LowStockBoxDto> lowStockBoxes;
    private List<TopBoxStatDto> topSellingBoxes;
    private List<RecentProviderOrderDto> recentOrders;
}
