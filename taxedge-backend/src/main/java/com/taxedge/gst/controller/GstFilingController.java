package com.taxedge.gst.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.gst.dto.GstFilingDto;
import com.taxedge.gst.entity.GstFiling;
import com.taxedge.gst.service.GstFilingService;

@RestController
@RequestMapping("/gst/filing")
public class GstFilingController {

    @Autowired
    private GstFilingService gstFilingService;

    @PostMapping("/create")
    public ResponseEntity<String> createFiling(
            @RequestBody GstFilingDto gstFilingDto) {

        String result =
                gstFilingService.createFiling(gstFilingDto);

        return new ResponseEntity<>(
                result,
                HttpStatus.CREATED);
    }

    @GetMapping("/{gstin}")
    public ResponseEntity<List<GstFiling>> getFilingsByGstin(
            @PathVariable String gstin) {

        List<GstFiling> filings =
                gstFilingService.getFilingsByGstin(gstin);

        return ResponseEntity.ok(filings);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateFiling(
            @PathVariable String id,
            @RequestBody GstFilingDto gstFilingDto) {

        String result =
                gstFilingService.updateFiling(
                        id,
                        gstFilingDto);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFiling(
            @PathVariable String id) {

        String result =
                gstFilingService.deleteFiling(id);

        return ResponseEntity.ok(result);
    }
}