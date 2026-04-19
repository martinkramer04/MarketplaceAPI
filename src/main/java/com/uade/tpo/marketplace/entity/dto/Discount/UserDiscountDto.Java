package com.uade.tpo.marketplace.entity.dto.Discount;

import com.uade.tpo.marketplace.entity.Discount;
import lombok.Data;

@Data
public class UserDiscountDto {
    private Long id;
    private String code;
    private Integer percentage;

    public static UserDiscountDto convertToDto(Discount discount) {
        UserDiscountDto dto = new UserDiscountDto();
        dto.setId(discount.getId());
        dto.setCode(discount.getCode());
        dto.setPercentage(discount.getPercentage());
        return dto;
    }
}