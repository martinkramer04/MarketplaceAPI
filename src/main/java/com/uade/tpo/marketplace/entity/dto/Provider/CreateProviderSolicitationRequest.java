package com.uade.tpo.marketplace.entity.dto.Provider;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateProviderSolicitationRequest {

    private String businessName;
    private String ownerName;
    private String email;
    private String phone;
    private String website;

    private String category;
    private String location;
    private String address;
    private String description;

    private String experienceName;
    private String experienceDescription;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer capacity;
    private String duration;
}