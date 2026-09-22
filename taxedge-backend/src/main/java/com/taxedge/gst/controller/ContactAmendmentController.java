package com.taxedge.gst.controller;

import com.taxedge.gst.dto.ContactAmendmentViewDto;
import com.taxedge.gst.service.ContactAmendmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/gst/amendments/contact")
public class ContactAmendmentController {

    private final ContactAmendmentService contactAmendmentService;

    public ContactAmendmentController(ContactAmendmentService contactAmendmentService) {
        this.contactAmendmentService = contactAmendmentService;
    }

    @GetMapping("/{gstId}/existing")
    public ResponseEntity<ContactAmendmentViewDto> getExistingContact(@PathVariable String gstId) {
        return ResponseEntity.ok(contactAmendmentService.getExistingContactDetails(gstId));
    }

    @GetMapping("/{gstId}/new")
    public ResponseEntity<ContactAmendmentViewDto> getNewContact(@PathVariable String gstId) {
        return ResponseEntity.ok(contactAmendmentService.getNewContactAmendmentDetails(gstId));
    }

    @PostMapping("/{gstId}")
    public ResponseEntity<String> submitContactAmendment(
            @PathVariable String gstId,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("email") String email,
            @RequestParam("file") MultipartFile file) throws IOException {

        String response = contactAmendmentService.submitContactAmendment(gstId, mobileNumber, email, file);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
