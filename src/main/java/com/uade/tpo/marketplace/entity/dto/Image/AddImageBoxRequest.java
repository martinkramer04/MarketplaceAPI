package com.uade.tpo.marketplace.entity.dto.Image;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class AddImageBoxRequest {
    private String name;
    private Long boxId;
    private MultipartFile file;

}
