package com.taxedge.gst.controller;

import com.taxedge.gst.dto.BankAccountAmendmentViewDto;
import com.taxedge.gst.enums.AccountType;
import com.taxedge.gst.service.BankAccountAmendmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/gst/amendments/bank-account")
public class BankAccountAmendmentController {

    private final BankAccountAmendmentService service;

    public BankAccountAmendmentController(BankAccountAmendmentService service) {
        this.service = service;
    }

    // 1. GET Method: Returns existing/live bank details from the main business table (business_details)
    @GetMapping("/{gstId}/existing")
    public ResponseEntity<BankAccountAmendmentViewDto> getExistingBankAccountDetails(@PathVariable String gstId) {
        BankAccountAmendmentViewDto response = service.getExistingBankAccountDetails(gstId);
        return ResponseEntity.ok(response);
    }

    // 2. POST Method: Takes new bank details and supporting document from frontend, saving to amendment table as PENDING
    @PostMapping("/{gstId}")
    public ResponseEntity<String> submitBankAccountAmendment(
            @PathVariable String gstId,
            @RequestParam("bankName") String bankName,
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("ifscCode") String ifscCode,
            @RequestParam("accountType") AccountType accountType,
            @RequestParam("file") MultipartFile file) throws IOException {

        String result = service.submitBankAccountAmendment(gstId, bankName, accountNumber, ifscCode, accountType, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    // 3. GET Method: Returns new/pending bank amendment details from the bank_account_amendments table
    @GetMapping("/{gstId}/new")
    public ResponseEntity<BankAccountAmendmentViewDto> getNewBankAccountAmendmentDetails(@PathVariable String gstId) {
        BankAccountAmendmentViewDto response = service.getNewBankAccountAmendmentDetails(gstId);
        return ResponseEntity.ok(response);
    }
}
