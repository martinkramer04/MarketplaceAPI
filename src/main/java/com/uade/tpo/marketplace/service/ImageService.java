package com.uade.tpo.marketplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.Image;
import com.uade.tpo.marketplace.repository.BoxRepository;
import com.uade.tpo.marketplace.repository.ImageRepository;

@Service
public class ImageService implements IImageService {
    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private BoxRepository boxRepository;

    @Override
    public Image create(Image image, Long boxId) {
        Box box = boxRepository.findById(boxId).get();
        image.setBox(box);

        return imageRepository.save(image);
    }

    @Override
    public Image viewById(long id) {
        return imageRepository.findById(id).get();
    }
}
