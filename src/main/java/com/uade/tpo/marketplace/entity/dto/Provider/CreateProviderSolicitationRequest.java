package com.uade.tpo.marketplace.entity.dto.Provider;
 
import lombok.Data;
 
@Data
public class CreateProviderSolicitationRequest {
 
    private Long providerId;
    private String description;
}