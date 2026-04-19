package com.uade.tpo.marketplace.entity.dto.PaymentMethods;

import com.uade.tpo.marketplace.entity.PaymentMethods;

import lombok.Data;

@Data
public class PaymentMethodsDto {
    private String name;
    private String description;
    private Long id;

    public static PaymentMethodsDto convertToDto(PaymentMethods paymentMethods) {
        PaymentMethodsDto dto = new PaymentMethodsDto();
        dto.setName(paymentMethods.getName());
        dto.setId(paymentMethods.getId());
        dto.setDescription(paymentMethods.getDescription());
        return dto;
    }

}
