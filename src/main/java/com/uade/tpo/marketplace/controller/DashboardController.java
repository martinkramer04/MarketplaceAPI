package com.uade.tpo.marketplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Dashboard.AdminDashboardDto;
import com.uade.tpo.marketplace.entity.dto.Dashboard.ProviderDashboardDto;
import com.uade.tpo.marketplace.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // GET /api/dashboard/admin
    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    // GET /api/dashboard/provider
    // Scoped to the authenticated provider making the request; providers cannot query others' stats.
    @GetMapping("/provider")
    public ResponseEntity<ProviderDashboardDto> getProviderDashboard() {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return ResponseEntity.ok(dashboardService.getProviderDashboard(currentUser.getId()));
    }
}
