package com.uade.tpo.marketplace.entity.dto.Auth;
 
import java.math.BigDecimal;

import com.uade.tpo.marketplace.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
 
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthRegisterRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private Role role;
}