package com.uade.tpo.marketplace.entity.dto.Order;
 
import com.uade.tpo.marketplace.entity.enums.StatusOrderEnum;
 
import lombok.Data;
 
@Data
public class UpdateOrderRequest {
 
    // Al actualizar una orden solo se permite cambiar el estado
    private StatusOrderEnum status;
}
 