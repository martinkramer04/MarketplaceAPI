package com.uade.tpo.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.marketplace.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
