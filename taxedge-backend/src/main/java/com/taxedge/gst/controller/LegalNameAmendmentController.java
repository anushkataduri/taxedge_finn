package com.taxedge.gst.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.LegalNameAmendmentViewDto;
import com.taxedge.gst.service.LegalNameAmendmentService;

@RestController
@RequestMapping("/gst/amendments/legal-name")
public class LegalNameAmendmentController {

    private final LegalNameAmendmentService amendmentService;

    public LegalNameAmendmentController(LegalNameAmendmentService amendmentService) {
        this.amendmentService = amendmentService;
    }

    // 1. GET Existing baseline details
    @GetMapping("/{gstId}/existing")
    public ResponseEntity<LegalNameAmendmentViewDto> getExistingLegalNameDetails(@PathVariable String gstId) {
        LegalNameAmendmentViewDto response = amendmentService.getExistingLegalNameDetails(gstId);
        return ResponseEntity.ok(response);
    }

    // 2. POST Submit new legal name amendment with file
    @PostMapping("/{gstId}")
    public ResponseEntity<String> submitLegalNameAmendment(
            @PathVariable String gstId,
            @RequestParam("newLegalName") String newLegalName,
            @RequestParam("file") MultipartFile file) throws IOException {

        String result = amendmentService.submitLegalNameAmendment(gstId, newLegalName, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // 3. GET New / Pending details
    @GetMapping("/{gstId}/new")
    public ResponseEntity<LegalNameAmendmentViewDto> getNewLegalNameAmendmentDetails(@PathVariable String gstId) {
        LegalNameAmendmentViewDto response = amendmentService.getNewLegalNameAmendmentDetails(gstId);
        return ResponseEntity.ok(response);
    }
}
