package com.uade.tpo.marketplace.entity.dto.Discount;
import com.uade.tpo.marketplace.entity.Discount;
import lombok.Data;


public class UserDiscountDto {
    private Long id;
    private String code;
    private Double percentage;

    public static DiscountDto convertToDto(Discount discount) {
        DiscountDto dto = new DiscountDto();
        dto.setId(discount.getId());
        dto.setCode(discount.getCode());
        dto.setPercentage(discount.getPercentage());
        return dto;
    }
}