package com.taxedge.gst.controller;

import com.taxedge.gst.dto.AdditionalPlaceAmendmentViewDto;
import com.taxedge.gst.enums.NatureOfBusiness;
import com.taxedge.gst.service.AdditionalPlaceAmendmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/gst/amendments/additional-place")
public class AdditionalPlaceAmendmentController {

    private final AdditionalPlaceAmendmentService service;

    public AdditionalPlaceAmendmentController(AdditionalPlaceAmendmentService service) {
        this.service = service;
    }

    // 1. GET: Returns existing baseline records from the business table
    @GetMapping("/{gstId}/existing")
    public ResponseEntity<List<AdditionalPlaceAmendmentViewDto>> getExistingAdditionalPlaces(@PathVariable String gstId) {
        List<AdditionalPlaceAmendmentViewDto> response = service.getExistingAdditionalPlaces(gstId);
        return ResponseEntity.ok(response);
    }

    // 2. POST: Takes new data + file from frontend and saves to the additional_place_amendments table
    @PostMapping("/{gstId}")
    public ResponseEntity<String> submitNewAdditionalPlace(
            @PathVariable String gstId,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam("pinCode") String pinCode,
            @RequestParam("natureOfBusiness") NatureOfBusiness natureOfBusiness,
            @RequestParam("file") MultipartFile file) throws IOException {

        String result = service.submitAdditionalPlace(gstId, address, city, pinCode, natureOfBusiness, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // 3. GET: Returns new pending records from the additional_place_amendments table
    @GetMapping("/{gstId}/new")
    public ResponseEntity<List<AdditionalPlaceAmendmentViewDto>> getNewAdditionalPlaces(@PathVariable String gstId) {
        List<AdditionalPlaceAmendmentViewDto> response = service.getNewAmendmentPlaces(gstId);
        return ResponseEntity.ok(response);
    }
}
