package com.uade.tpo.marketplace.entity.dto.Discount;

import java.util.Date;
import java.util.List;

import com.uade.tpo.marketplace.entity.Discount;
import com.uade.tpo.marketplace.entity.Order;
import com.uade.tpo.marketplace.entity.enums.DiscountTypeEnum;

import lombok.Data;

@Data
public class AdminDiscountDto {
    private Long id;
    private String code;
    private Integer percentage;
    private Boolean isActive;
    private Date startDate;
    private Date endDate;
    private DiscountTypeEnum discountType;
    private List<Order> orders;

    public static AdminDiscountDto convertToDto(Discount discount) {
        AdminDiscountDto dto = new AdminDiscountDto();
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