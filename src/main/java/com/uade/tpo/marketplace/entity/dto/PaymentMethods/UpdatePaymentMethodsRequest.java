package com.uade.tpo.marketplace.entity.dto.PaymentMethods;
 
import lombok.Data;

@Data
public class UpdatePaymentMethodsRequest {
    private String name;
    private String description;
}