package com.uade.tpo.marketplace.entity.dto.Discount;
import com.uade.tpo.marketplace.entity.Discount;
import lombok.Data;

public class UserDiscountDto {
    private Long id;
    private String code;
    private Double percentage;
    private Boolean isActive;
    private Date startDate;
    private Date endDate;
    private DiscountTypeEnum discountType;
    private List<Order> orders;

    public static DiscountDto convertToDto(Discount discount) {
        DiscountDto dto = new DiscountDto();
        dto.setId(discount.getId());
        dto.setCode(discount.getCode());
        dto.setPercentage(discount.getPercentage());
        dto.setIsActive(discount.getIsActive());
        dto.setStartDate(discount.getStartDate());
        dto.setEndDate(discount.getEndDate());
        dto.setDiscountType(discount.getDiscountType());
        dto.setOrders(discount.getOrders());
        return dto;
    }
}