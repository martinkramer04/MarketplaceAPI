package com.uade.tpo.marketplace.config;

import static jakarta.servlet.DispatcherType.ERROR;
import static jakarta.servlet.DispatcherType.FORWARD;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
                        .dispatcherTypeMatchers(FORWARD, ERROR).permitAll()
                        .requestMatchers(publicEndpoints()).permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, publicGetEndpoints()).permitAll()
                        .requestMatchers(HttpMethod.GET, adminGetEndpoints()).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, providerAdminGetEndpoints()).hasAnyRole("PROVIDER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, adminPostEndpoints()).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, providerPostEndpoints()).hasRole("PROVIDER")
                        .requestMatchers(HttpMethod.PUT, adminPutEndpoints()).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, adminDeleteEndpoints()).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, providerAdminDeleteEndpoints())
                        .hasAnyRole("PROVIDER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, userGetEndpoints()).hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, userPostEndpoints()).hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, userPutEndpoints()).hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, userDeleteEndpoints()).hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private String[] publicEndpoints() {
        return new String[] {
                "/swagger-ui.html",
                "/swagger-ui/**",
                "/v3/api-docs/**",
                "/v3/api-docs",
                "/swagger-resources/**",
                "/webjars/**"
        };
    }

    // GET endpoints accessible by everyone (no auth required)
    private String[] publicGetEndpoints() {
        return new String[] {
                "/api/reviews",
                "/api/reviews/{id}",
                "/api/reviews/box/{boxId}",
                "/api/paymentMethods",
                "/api/paymentMethods/{id}",
                "/api/discounts",
                "/api/orders",
                "/api/orders/{id}/details",
                "/api/boxes/{id}",
                "/api/boxes/category/{category}",
                "/api/boxes/available",
                "/api/categories",
                "/api/categories/{categoryId}",
        };
    }

    private String[] adminPostEndpoints() {
        return new String[] {
                "/api/paymentMethods",
                "/api/discounts",
                "/api/boxes",
                "/api/categories",
                "/api/products",
        };
    }

    private String[] userPutEndpoints() {
        return new String[] {
                "/api/reviews/{id}",
        };
    }

    private String[] userDeleteEndpoints() {
        return new String[] {
                "/api/reviews/{id}",
                "/api/provider-solicitations/{id}",
        };
    }

    // GET: ADMIN only
    private String[] adminGetEndpoints() {
        return new String[] {
                "/api/orders/{id}",
                "/api/boxes",
                "/api/products",
                "/api/products/{productId}",
                "/api/provider-solicitations", // admin only
                "/api/provider-solicitations/status/{status}", // admin only
        };
    }

    // GET: PROVIDER and ADMIN
    private String[] providerAdminGetEndpoints() {
        return new String[] {
                "/api/provider-solicitations/{id}",
                "/api/provider-solicitations/provider/{userId}",
        };
    }

    // POST: PROVIDER only
    private String[] providerPostEndpoints() {
        return new String[] {
                "/api/provider-solicitations",
        };
    }

    // PUT: ADMIN only (provider-solicitations PUT is admin only per spec)
    private String[] adminPutEndpoints() {
        return new String[] {
                "/api/paymentMethods/{id}",
                "/api/orders/{id}",
                "/api/provider-solicitations/{id}", // admin only
                "/api/discounts/{id}",
                "/api/boxes/{id}",
                "/api/categories/{categoryId}",
                "/api/products/{productId}",
        };
    }

    // DELETE: PROVIDER and ADMIN
    private String[] providerAdminDeleteEndpoints() {
        return new String[] {
                "/api/provider-solicitations/{id}",
        };
    }

    // DELETE: ADMIN only
    private String[] adminDeleteEndpoints() {
        return new String[] {
                "/api/paymentMethods/{id}",
                "/api/discounts/{id}",
                "/api/orders/{id}",
                "/api/boxes/{id}",
                "/api/categories/{categoryId}",
                "/api/products/{productId}",
        };
    }

    // POST: USER and ADMIN (removed provider-solicitations, now in
    // providerPostEndpoints)
    private String[] userPostEndpoints() {
        return new String[] {
                "/api/reviews",
                "/api/orders",
        };
    }

    // GET: USER and ADMIN (removed provider-solicitations, now in
    // providerAdminGetEndpoints)
    private String[] userGetEndpoints() {
        return new String[] {
                "/api/reviews/user/{userId}",
                "/api/discounts/code/{code}",
                "/api/discounts/active",
                "/api/orders/user/{userId}",
        };
    }

    private String[] configureReviews() {
        return new String[] {};
    }

}