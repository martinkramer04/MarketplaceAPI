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
public class AdminDashboardDto {

    // Users
    private long totalUsers;
    private long totalProviders;
    private long totalAdmins;

    // Catalog
    private long totalBoxes;
    private long approvedBoxes;
    private long pendingBoxes;
    private long rejectedBoxes;
    private long totalProducts;
    private long totalCategories;

    // Sales
    private long totalOrders;
    private long confirmedOrders;
    private long pendingOrders;
    private long rejectedOrders;
    private BigDecimal totalRevenue;
    private BigDecimal revenueThisMonth;
    private BigDecimal revenueLastMonth;

    // Reviews
    private long totalReviews;
    private double averageRating;

    // Discounts
    private long activeDiscounts;

    // Pending approvals for the admin to act on
    private long pendingProviderSolicitations;
    private long pendingBoxSolicitations;

    private List<TopBoxStatDto> topSellingBoxes;
    private List<RecentOrderDto> recentOrders;
}
