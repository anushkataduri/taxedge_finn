package com.taxedge.gst.controller;

import com.taxedge.gst.dto.*;
import com.taxedge.gst.enums.AccountType;
import com.taxedge.gst.enums.NatureOfBusiness;
import com.taxedge.gst.service.*;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/gst/amendments")
public class GstAmendmentController {

    private final AdditionalPlaceAmendmentService additionalPlaceService;
    private final BankAccountAmendmentService bankAccountService;
    private final ContactAmendmentService contactService;
    private final LegalNameAmendmentService legalNameService;
    private final PrincipalPlaceAmendmentService principalPlaceService;
    private final SignatoryAmendmentService signatoryService;

    public GstAmendmentController(
            AdditionalPlaceAmendmentService additionalPlaceService,
            BankAccountAmendmentService bankAccountService,
            ContactAmendmentService contactService,
            LegalNameAmendmentService legalNameService,
            PrincipalPlaceAmendmentService principalPlaceService,
            SignatoryAmendmentService signatoryService) {
        this.additionalPlaceService = additionalPlaceService;
        this.bankAccountService = bankAccountService;
        this.contactService = contactService;
        this.legalNameService = legalNameService;
        this.principalPlaceService = principalPlaceService;
        this.signatoryService = signatoryService;
    }

    // ==========================================
    // 1. ADDITIONAL PLACE AMENDMENTS
    // ==========================================

    @GetMapping("/additional-place/{gstId}/existing")
    public ResponseEntity<List<AdditionalPlaceAmendmentViewDto>> getExistingAdditionalPlaces(@PathVariable String gstId) {
        return ResponseEntity.ok(additionalPlaceService.getExistingAdditionalPlaces(gstId));
    }

    @PostMapping("/additional-place/{gstId}")
    public ResponseEntity<String> submitNewAdditionalPlace(
            @PathVariable String gstId,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam("pinCode") String pinCode,
            @RequestParam("natureOfBusiness") NatureOfBusiness natureOfBusiness,
            @RequestParam("file") MultipartFile file) throws IOException {
        String result = additionalPlaceService.submitAdditionalPlace(gstId, address, city, pinCode, natureOfBusiness, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/additional-place/{gstId}/new")
    public ResponseEntity<List<AdditionalPlaceAmendmentViewDto>> getNewAdditionalPlaces(@PathVariable String gstId) {
        return ResponseEntity.ok(additionalPlaceService.getNewAmendmentPlaces(gstId));
    }


    // ==========================================
    // 2. BANK ACCOUNT AMENDMENTS
    // ==========================================

    @GetMapping("/bank-account/{gstId}/existing")
    public ResponseEntity<BankAccountAmendmentViewDto> getExistingBankAccountDetails(@PathVariable String gstId) {
        return ResponseEntity.ok(bankAccountService.getExistingBankAccountDetails(gstId));
    }

    @PostMapping("/bank-account/{gstId}")
    public ResponseEntity<String> submitBankAccountAmendment(
            @PathVariable String gstId,
            @RequestParam("bankName") String bankName,
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("ifscCode") String ifscCode,
            @RequestParam("accountType") AccountType accountType,
            @RequestParam("file") MultipartFile file) throws IOException {
        String result = bankAccountService.submitBankAccountAmendment(gstId, bankName, accountNumber, ifscCode, accountType, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/bank-account/{gstId}/new")
    public ResponseEntity<BankAccountAmendmentViewDto> getNewBankAccountAmendmentDetails(@PathVariable String gstId) {
        return ResponseEntity.ok(bankAccountService.getNewBankAccountAmendmentDetails(gstId));
    }


    // ==========================================
    // 3. CONTACT AMENDMENTS
    // ==========================================

    @GetMapping("/contact/{gstId}/existing")
    public ResponseEntity<ContactAmendmentViewDto> getExistingContact(@PathVariable String gstId) {
        return ResponseEntity.ok(contactService.getExistingContactDetails(gstId));
    }

    @PostMapping("/contact/{gstId}")
    public ResponseEntity<String> submitContactAmendment(
            @PathVariable String gstId,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("email") String email,
            @RequestParam("file") MultipartFile file) throws IOException {
        String response = contactService.submitContactAmendment(gstId, mobileNumber, email, file);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/contact/{gstId}/new")
    public ResponseEntity<ContactAmendmentViewDto> getNewContact(@PathVariable String gstId) {
        return ResponseEntity.ok(contactService.getNewContactAmendmentDetails(gstId));
    }


    // ==========================================
    // 4. LEGAL NAME AMENDMENTS
    // ==========================================

    @GetMapping("/legal-name/{gstId}/existing")
    public ResponseEntity<LegalNameAmendmentViewDto> getExistingLegalNameDetails(@PathVariable String gstId) {
        return ResponseEntity.ok(legalNameService.getExistingLegalNameDetails(gstId));
    }

    @PostMapping("/legal-name/{gstId}")
    public ResponseEntity<String> submitLegalNameAmendment(
            @PathVariable String gstId,
            @RequestParam("newLegalName") String newLegalName,
            @RequestParam("file") MultipartFile file) throws IOException {
        String result = legalNameService.submitLegalNameAmendment(gstId, newLegalName, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/legal-name/{gstId}/new")
    public ResponseEntity<LegalNameAmendmentViewDto> getNewLegalNameAmendmentDetails(@PathVariable String gstId) {
        return ResponseEntity.ok(legalNameService.getNewLegalNameAmendmentDetails(gstId));
    }


    // ==========================================
    // 5. PRINCIPAL PLACE AMENDMENTS
    // ==========================================

    @GetMapping("/principal-place/{gstId}/existing")
    public ResponseEntity<PrincipalPlaceAmendmentViewDto> getExistingPrincipalPlaceDetails(@PathVariable String gstId) {
        return ResponseEntity.ok(principalPlaceService.getAmendmentDetails(gstId));
    }

    @PostMapping("/principal-place/{gstId}")
    public ResponseEntity<String> submitNewPrincipalPlaceAmendment(
            @PathVariable String gstId,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam(value = "district", required = false) String district,
            @RequestParam("state") String state,
            @RequestParam("pinCode") String pinCode,
            @RequestParam("file") MultipartFile file) throws IOException {
        String result = principalPlaceService.submitAmendment(gstId, address, city, district, state, pinCode, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/principal-place/{gstId}/new")
    public ResponseEntity<PrincipalPlaceAmendmentViewDto> getNewPrincipalPlaceAmendmentDetails(@PathVariable String gstId) {
        return ResponseEntity.ok(principalPlaceService.getAmendmentDetails(gstId));
    }


    // ==========================================
    // 6. SIGNATORY AMENDMENTS
    // ==========================================

    @GetMapping("/signatory/{gstId}/existing")
    public ResponseEntity<SignatoryAmendmentViewDto> getExistingSignatoryDetails(@PathVariable String gstId) {
        return ResponseEntity.ok(signatoryService.getExistingSignatoryDetails(gstId));
    }

    @PostMapping("/signatory/{gstId}")
    public ResponseEntity<String> submitSignatoryAmendment(
            @PathVariable String gstId,
            @RequestParam("signatoryName") String signatoryName,
            @RequestParam("signatoryPan") String signatoryPan,
            @RequestParam(value = "signatoryDob", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate signatoryDob,
            @RequestParam(value = "designation", required = false) String designation,
            @RequestParam(value = "signatoryMobile", required = false) String signatoryMobile,
            @RequestParam(value = "signatoryEmail", required = false) String signatoryEmail,
            @RequestParam("file") MultipartFile file) throws IOException {
        String result = signatoryService.submitSignatoryAmendment(
                gstId, signatoryName, signatoryPan, signatoryDob, designation, signatoryMobile, signatoryEmail, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/signatory/{gstId}/new")
    public ResponseEntity<SignatoryAmendmentViewDto> getNewSignatoryAmendmentDetails(@PathVariable String gstId) {
        return ResponseEntity.ok(signatoryService.getNewSignatoryAmendmentDetails(gstId));
    }
}

