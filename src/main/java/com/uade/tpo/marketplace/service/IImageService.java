package com.uade.tpo.marketplace.service;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Image;

@Service
public interface IImageService {
    public Image create(Image image, Long boxId);

    public Image viewById(long id);
}
