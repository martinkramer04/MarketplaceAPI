package com.uade.tpo.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.marketplace.entity.BoxSolicitation;
import com.uade.tpo.marketplace.entity.enums.BoxSolicitationStatusEnum;

@Repository
public interface BoxSolicitationRepository extends JpaRepository<BoxSolicitation, Long> {
    List<BoxSolicitation> findByUser_Id(Long userId);
    List<BoxSolicitation> findByStatus(BoxSolicitationStatusEnum status);
}
