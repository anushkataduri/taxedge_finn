package com.taxedge.gst.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.gst.dto.GstCancellationDto;
import com.taxedge.gst.entity.GstCancellation;
import com.taxedge.gst.service.GstCancellationService;

@RestController
@RequestMapping("/gst/cancellation")
public class GstCancellationController {

    @Autowired
    private GstCancellationService cancellationService;

    @PostMapping
    public ResponseEntity<String> createCancellation(
            @ModelAttribute GstCancellationDto gstCancellationDto)
            throws IOException {

        String result =
                cancellationService.createCancellation(
                        gstCancellationDto);

        return new ResponseEntity<>(
                result,
                HttpStatus.CREATED);
    }

    @GetMapping("/{gstId}")
    public ResponseEntity<GstCancellation> getCancellation(
            @PathVariable String gstId) {

        GstCancellation cancellation =
                cancellationService.getCancellation(gstId);

        return ResponseEntity.ok(cancellation);
    }
}