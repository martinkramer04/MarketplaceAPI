package com.uade.tpo.marketplace.entity.dto.BoxSolicitation;

import com.uade.tpo.marketplace.entity.enums.BoxSolicitationStatusEnum;

import lombok.Data;

@Data
public class UpdateBoxSolicitationRequest {
    private BoxSolicitationStatusEnum status;
}
