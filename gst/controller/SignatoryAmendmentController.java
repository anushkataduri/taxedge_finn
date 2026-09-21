package com.taxedge.gst.controller;

import com.taxedge.gst.dto.SignatoryAmendmentViewDto;
import com.taxedge.gst.service.SignatoryAmendmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/gst/amendments/signatory")
public class SignatoryAmendmentController {

    private final SignatoryAmendmentService service;

    public SignatoryAmendmentController(SignatoryAmendmentService service) {
        this.service = service;
    }

    // 1. GET Method: Returns existing/live signatory details from the main business table (business_details)
    @GetMapping("/{gstId}/existing")
    public ResponseEntity<SignatoryAmendmentViewDto> getExistingSignatoryDetails(@PathVariable String gstId) {
        SignatoryAmendmentViewDto response = service.getExistingSignatoryDetails(gstId);
        return ResponseEntity.ok(response);
    }

    // 2. POST Method: Takes new signatory details and supporting document from frontend, saving to amendment table as PENDING
    @PostMapping("/{gstId}")
    public ResponseEntity<String> submitSignatoryAmendment(
            @PathVariable String gstId,
            @RequestParam("signatoryName") String signatoryName,
            @RequestParam("signatoryPan") String signatoryPan,
            @RequestParam(value = "signatoryDob", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate signatoryDob,
            @RequestParam(value = "designation", required = false) String designation,
            @RequestParam(value = "signatoryMobile", required = false) String signatoryMobile,
            @RequestParam(value = "signatoryEmail", required = false) String signatoryEmail,
            @RequestParam("file") MultipartFile file) throws IOException {

        String result = service.submitSignatoryAmendment(
                gstId, signatoryName, signatoryPan, signatoryDob, designation, signatoryMobile, signatoryEmail, file);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // 3. GET Method: Returns new/pending signatory amendment details from the signatory_amendments table
    @GetMapping("/{gstId}/new")
    public ResponseEntity<SignatoryAmendmentViewDto> getNewSignatoryAmendmentDetails(@PathVariable String gstId) {
        SignatoryAmendmentViewDto response = service.getNewSignatoryAmendmentDetails(gstId);
        return ResponseEntity.ok(response);
    }
}
