package com.taxedge.gst.controller;

import com.taxedge.gst.dto.PrincipalPlaceAmendmentViewDto;
import com.taxedge.gst.service.PrincipalPlaceAmendmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/gst/amendments/principal-place")
public class PrincipalPlaceAmendmentController {

    private final PrincipalPlaceAmendmentService amendmentService;

    public PrincipalPlaceAmendmentController(PrincipalPlaceAmendmentService amendmentService) {
        this.amendmentService = amendmentService;
    }

    // 1. GET Method for EXISTING / Current Details from GST Registration
    @GetMapping("/{gstId}/existing")
    public ResponseEntity<PrincipalPlaceAmendmentViewDto> getExistingDetails(@PathVariable String gstId) {
        PrincipalPlaceAmendmentViewDto response = amendmentService.getAmendmentDetails(gstId);
        return ResponseEntity.ok(response);
    }

    // 2. POST Method to save NEW details and supporting document file coming from frontend
    @PostMapping("/{gstId}")
    public ResponseEntity<String> submitNewAmendment(
            @PathVariable String gstId,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam(value = "district", required = false) String district,
            @RequestParam("state") String state,
            @RequestParam("pinCode") String pinCode,
            @RequestParam("file") MultipartFile file) throws IOException {

        String result = amendmentService.submitAmendment(gstId, address, city, district, state, pinCode, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // 3. GET Method to retrieve NEW details to display on frontend (pending review status)
    @GetMapping("/{gstId}/new")
    public ResponseEntity<PrincipalPlaceAmendmentViewDto> getNewAmendmentDetails(@PathVariable String gstId) {
        PrincipalPlaceAmendmentViewDto response = amendmentService.getAmendmentDetails(gstId);
        return ResponseEntity.ok(response);
    }
}
