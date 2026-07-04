package com.uade.tpo.marketplace.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.BoxSolicitation;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.OrderDetails;
import com.uade.tpo.marketplace.entity.Review;
import com.uade.tpo.marketplace.entity.Role;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Dashboard.AdminDashboardDto;
import com.uade.tpo.marketplace.entity.dto.Dashboard.LowStockBoxDto;
import com.uade.tpo.marketplace.entity.dto.Dashboard.ProviderDashboardDto;
import com.uade.tpo.marketplace.entity.dto.Dashboard.RecentOrderDto;
import com.uade.tpo.marketplace.entity.dto.Dashboard.RecentProviderOrderDto;
import com.uade.tpo.marketplace.entity.dto.Dashboard.TopBoxStatDto;
import com.uade.tpo.marketplace.entity.enums.BoxSolicitationStatusEnum;
import com.uade.tpo.marketplace.entity.enums.BoxStatusEnum;
import com.uade.tpo.marketplace.entity.enums.ReviewStatusEnum;
import com.uade.tpo.marketplace.entity.enums.SolicitationStatusEnum;
import com.uade.tpo.marketplace.entity.enums.StatusOrderEnum;
import com.uade.tpo.marketplace.repository.BoxRepository;
import com.uade.tpo.marketplace.repository.BoxSolicitationRepository;
import com.uade.tpo.marketplace.repository.CategoryRepository;
import com.uade.tpo.marketplace.repository.DiscountRepository;
import com.uade.tpo.marketplace.repository.OrderDetailsRepository;
import com.uade.tpo.marketplace.repository.OrderRepository;
import com.uade.tpo.marketplace.repository.ProductRepository;
import com.uade.tpo.marketplace.repository.ProviderSolicitationsRepository;
import com.uade.tpo.marketplace.repository.ReviewRepository;
import com.uade.tpo.marketplace.repository.UserRepository;

@Service
public class DashboardService {

    private static final int TOP_BOXES_LIMIT = 5;
    private static final int RECENT_ORDERS_LIMIT = 5;
    private static final int LOW_STOCK_THRESHOLD = 5;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BoxRepository boxRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private ProviderSolicitationsRepository providerSolicitationsRepository;
    @Autowired
    private BoxSolicitationRepository boxSolicitationRepository;

    public AdminDashboardDto getAdminDashboard() {
        List<Box> boxes = boxRepository.findAll();
        Map<BoxStatusEnum, Long> boxesByStatus = boxes.stream()
                .filter(b -> b.getStatus() != null)
                .collect(Collectors.groupingBy(Box::getStatus, Collectors.counting()));

        List<Order> orders = orderRepository.findAll();
        Map<StatusOrderEnum, Long> ordersByStatus = orders.stream()
                .filter(o -> o.getStatus() != null)
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

        List<Order> confirmedOrders = orders.stream()
                .filter(o -> o.getStatus() == StatusOrderEnum.CONFIRMADA)
                .toList();

        BigDecimal totalRevenue = confirmedOrders.stream()
                .map(Order::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDateTime startOfThisMonth = LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime startOfLastMonth = startOfThisMonth.minusMonths(1);

        BigDecimal revenueThisMonth = sumOrderRevenueInRange(confirmedOrders, startOfThisMonth, LocalDateTime.now());
        BigDecimal revenueLastMonth = sumOrderRevenueInRange(confirmedOrders, startOfLastMonth, startOfThisMonth);

        List<Review> reviews = reviewRepository.findAll();
        double averageRating = averageRating(reviews);

        return AdminDashboardDto.builder()
                .totalUsers(userRepository.countByRole(Role.USER))
                .totalProviders(userRepository.countByRole(Role.PROVIDER))
                .totalAdmins(userRepository.countByRole(Role.ADMIN))
                .totalBoxes(boxes.size())
                .approvedBoxes(boxesByStatus.getOrDefault(BoxStatusEnum.APPROVED, 0L))
                .pendingBoxes(boxesByStatus.getOrDefault(BoxStatusEnum.PENDING, 0L))
                .rejectedBoxes(boxesByStatus.getOrDefault(BoxStatusEnum.REJECTED, 0L))
                .totalProducts(productRepository.count())
                .totalCategories(categoryRepository.count())
                .totalOrders(orders.size())
                .confirmedOrders(ordersByStatus.getOrDefault(StatusOrderEnum.CONFIRMADA, 0L))
                .pendingOrders(ordersByStatus.getOrDefault(StatusOrderEnum.GENERADA, 0L)
                        + ordersByStatus.getOrDefault(StatusOrderEnum.PROCESO_PAGO, 0L))
                .rejectedOrders(ordersByStatus.getOrDefault(StatusOrderEnum.RECHAZADA, 0L))
                .totalRevenue(totalRevenue)
                .revenueThisMonth(revenueThisMonth)
                .revenueLastMonth(revenueLastMonth)
                .totalReviews(reviews.size())
                .averageRating(averageRating)
                .activeDiscounts(discountRepository.findByIsActiveTrue().size())
                .pendingProviderSolicitations(
                        providerSolicitationsRepository.findBySolicitationStatus(SolicitationStatusEnum.GENERADA)
                                .size())
                .pendingBoxSolicitations(
                        boxSolicitationRepository.findByStatus(BoxSolicitationStatusEnum.PENDING).size())
                .topSellingBoxes(computeTopSellingBoxes(orderDetailsRepository.findAll()))
                .recentOrders(recentOrders(orders))
                .build();
    }

    public ProviderDashboardDto getProviderDashboard(Long providerId) {
        List<Box> ownBoxes = boxRepository.findByUserId(providerId);
        Map<BoxStatusEnum, Long> boxesByStatus = ownBoxes.stream()
                .filter(b -> b.getStatus() != null)
                .collect(Collectors.groupingBy(Box::getStatus, Collectors.counting()));

        List<OrderDetails> ownDetails = orderDetailsRepository.findByBox_User_Id(providerId);
        List<OrderDetails> confirmedDetails = ownDetails.stream()
                .filter(d -> d.getOrder() != null && d.getOrder().getStatus() == StatusOrderEnum.CONFIRMADA)
                .toList();

        long totalUnitsSold = confirmedDetails.stream()
                .mapToLong(d -> d.getQuantity() == null ? 0 : d.getQuantity())
                .sum();

        BigDecimal totalRevenue = confirmedDetails.stream()
                .map(OrderDetails::getSubtotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDateTime startOfThisMonth = LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime startOfLastMonth = startOfThisMonth.minusMonths(1);

        BigDecimal revenueThisMonth = sumDetailRevenueInRange(confirmedDetails, startOfThisMonth,
                LocalDateTime.now());
        BigDecimal revenueLastMonth = sumDetailRevenueInRange(confirmedDetails, startOfLastMonth, startOfThisMonth);

        long totalOrders = confirmedDetails.stream()
                .map(d -> d.getOrder().getId())
                .distinct()
                .count();

        List<Review> ownReviews = reviewRepository.findByBox_User_Id(providerId);
        double averageRating = averageRating(ownReviews);

        List<BoxSolicitation> ownSolicitations = boxSolicitationRepository.findByUser_Id(providerId);
        Map<BoxSolicitationStatusEnum, Long> solicitationsByStatus = ownSolicitations.stream()
                .filter(s -> s.getStatus() != null)
                .collect(Collectors.groupingBy(BoxSolicitation::getStatus, Collectors.counting()));

        List<LowStockBoxDto> lowStockBoxes = ownBoxes.stream()
                .filter(b -> b.getStock() != null && b.getStock() <= LOW_STOCK_THRESHOLD)
                .sorted(Comparator.comparing(Box::getStock))
                .map(b -> LowStockBoxDto.builder()
                        .boxId(b.getId())
                        .boxName(b.getName())
                        .stock(b.getStock())
                        .build())
                .toList();

        List<RecentProviderOrderDto> recentOrders = ownDetails.stream()
                .filter(d -> d.getOrder() != null)
                .sorted(Comparator.comparing((OrderDetails d) -> d.getOrder().getCreatedAt()).reversed())
                .limit(RECENT_ORDERS_LIMIT)
                .map(d -> RecentProviderOrderDto.builder()
                        .orderId(d.getOrder().getId())
                        .buyerName(buyerName(d.getOrder().getUser()))
                        .boxName(d.getBoxName())
                        .quantity(d.getQuantity())
                        .subtotal(d.getSubtotal())
                        .status(d.getOrder().getStatus().name())
                        .createdAt(d.getOrder().getCreatedAt())
                        .build())
                .toList();

        return ProviderDashboardDto.builder()
                .totalBoxes(ownBoxes.size())
                .approvedBoxes(boxesByStatus.getOrDefault(BoxStatusEnum.APPROVED, 0L))
                .pendingBoxes(boxesByStatus.getOrDefault(BoxStatusEnum.PENDING, 0L))
                .rejectedBoxes(boxesByStatus.getOrDefault(BoxStatusEnum.REJECTED, 0L))
                .totalProducts(productRepository.findByUserId(providerId).size())
                .totalOrders(totalOrders)
                .totalUnitsSold(totalUnitsSold)
                .totalRevenue(totalRevenue)
                .revenueThisMonth(revenueThisMonth)
                .revenueLastMonth(revenueLastMonth)
                .totalReviews(ownReviews.size())
                .averageRating(averageRating)
                .pendingBoxSolicitations(solicitationsByStatus.getOrDefault(BoxSolicitationStatusEnum.PENDING, 0L))
                .approvedBoxSolicitations(solicitationsByStatus.getOrDefault(BoxSolicitationStatusEnum.APPROVED, 0L))
                .rejectedBoxSolicitations(solicitationsByStatus.getOrDefault(BoxSolicitationStatusEnum.REJECTED, 0L))
                .lowStockBoxes(lowStockBoxes)
                .topSellingBoxes(computeTopSellingBoxes(ownDetails))
                .recentOrders(recentOrders)
                .build();
    }

    private List<TopBoxStatDto> computeTopSellingBoxes(List<OrderDetails> details) {
        Map<Long, TopBoxAccumulator> accByBox = new HashMap<>();
        for (OrderDetails d : details) {
            if (d.getOrder() == null || d.getOrder().getStatus() != StatusOrderEnum.CONFIRMADA || d.getBox() == null) {
                continue;
            }
            TopBoxAccumulator acc = accByBox.computeIfAbsent(d.getBox().getId(),
                    id -> new TopBoxAccumulator(d.getBox().getId(), d.getBoxName()));
            acc.units += d.getQuantity() == null ? 0 : d.getQuantity();
            acc.revenue = acc.revenue.add(d.getSubtotal() == null ? BigDecimal.ZERO : d.getSubtotal());
        }

        return accByBox.values().stream()
                .sorted(Comparator.comparingLong((TopBoxAccumulator a) -> a.units).reversed())
                .limit(TOP_BOXES_LIMIT)
                .map(a -> TopBoxStatDto.builder()
                        .boxId(a.boxId)
                        .boxName(a.boxName)
                        .unitsSold(a.units)
                        .revenue(a.revenue)
                        .build())
                .toList();
    }

    private List<RecentOrderDto> recentOrders(List<Order> orders) {
        return orders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .limit(RECENT_ORDERS_LIMIT)
                .map(o -> RecentOrderDto.builder()
                        .orderId(o.getId())
                        .buyerName(buyerName(o.getUser()))
                        .totalAmount(o.getTotalAmount())
                        .status(o.getStatus().name())
                        .createdAt(o.getCreatedAt())
                        .build())
                .toList();
    }

    private double averageRating(List<Review> reviews) {
        return reviews.stream()
                .filter(r -> r.getStatus() == ReviewStatusEnum.REVIEWED && r.getRating() != null)
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    private String buyerName(User user) {
        if (user == null) {
            return "N/A";
        }
        return (user.getFirstname() + " " + user.getLastname()).trim();
    }

    private BigDecimal sumOrderRevenueInRange(List<Order> orders, LocalDateTime from, LocalDateTime to) {
        return orders.stream()
                .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(from)
                        && o.getCreatedAt().isBefore(to))
                .map(Order::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumDetailRevenueInRange(List<OrderDetails> details, LocalDateTime from, LocalDateTime to) {
        return details.stream()
                .filter(d -> d.getOrder() != null && d.getOrder().getCreatedAt() != null
                        && !d.getOrder().getCreatedAt().isBefore(from) && d.getOrder().getCreatedAt().isBefore(to))
                .map(OrderDetails::getSubtotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static class TopBoxAccumulator {
        final Long boxId;
        final String boxName;
        long units = 0;
        BigDecimal revenue = BigDecimal.ZERO;

        TopBoxAccumulator(Long boxId, String boxName) {
            this.boxId = boxId;
            this.boxName = boxName;
        }
    }
}
