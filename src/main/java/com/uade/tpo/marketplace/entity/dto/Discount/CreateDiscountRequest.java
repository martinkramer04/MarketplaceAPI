package com.uade.tpo.marketplace.entity.dto.Discount;
 
import java.util.Date;
 
import com.uade.tpo.marketplace.entity.enums.DiscountTypeEnum;
 
import lombok.Data;
 
@Data
public class CreateDiscountRequest {
 
    private String name;
    private Integer percentage;
    private Boolean isActive;
    private Date startDate;
    private Date endDate;
    private String code;           // Solo requerido si discountType = CUPON
    private DiscountTypeEnum discountType;
}