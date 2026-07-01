package com.uade.tpo.marketplace.entity.dto.Box;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.marketplace.entity.enums.BoxStatusEnum;

import lombok.Data;

@Data
public class UpdateBoxRequest {

    private Long categoryId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private BoxStatusEnum status;
    private List<MultipartFile> images;
}