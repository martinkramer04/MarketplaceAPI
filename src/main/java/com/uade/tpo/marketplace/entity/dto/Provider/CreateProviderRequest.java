package com.uade.tpo.marketplace.entity.dto.Provider;

import lombok.Data;

@Data
public class CreateProviderRequest {

    private String companyName;
    private String email;
    private String phone;
}
