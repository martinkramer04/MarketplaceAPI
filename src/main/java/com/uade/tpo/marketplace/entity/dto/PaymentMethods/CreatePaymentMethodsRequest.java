package com.uade.tpo.marketplace.entity.dto.PaymentMethods;
 
import lombok.Data;

@Data
public class CreatePaymentMethodsRequest {

    private String name;
    private String description;
    private Long userId;
}