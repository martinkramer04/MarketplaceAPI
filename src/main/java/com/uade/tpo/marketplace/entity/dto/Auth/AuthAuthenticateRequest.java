package com.uade.tpo.marketplace.entity.dto.Auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthAuthenticateRequest {
    private String email;
    String password;
}
