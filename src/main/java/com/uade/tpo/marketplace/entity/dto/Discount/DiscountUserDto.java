package com.uade.tpo.marketplace.entity.dto.Discount;

import com.uade.tpo.marketplace.entity.Discount;
import lombok.Data;

@Data
public class DiscountUserDto {
    private Long id;
    private String code;
    private Integer percentage;

    public static DiscountUserDto convertToDto(Discount discount) {
        DiscountUserDto dto = new DiscountUserDto();
        dto.setId(discount.getId());
        dto.setCode(discount.getCode());
        dto.setPercentage(discount.getPercentage());
        return dto;
    }
}