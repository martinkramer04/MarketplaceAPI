package com.uade.tpo.marketplace.entity.dto.Provider;
 
import com.uade.tpo.marketplace.entity.enums.SolicitationStatusEnum;
 
import lombok.Data;
 
@Data
public class UpdateProviderSolicitationRequest {
 
    // Al actualizar una solicitud solo se permite cambiar el estado
    private SolicitationStatusEnum solicitationStatus;
}
 