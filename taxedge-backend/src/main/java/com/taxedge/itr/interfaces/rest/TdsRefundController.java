package com.taxedge.itr.interfaces.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.itr.application.dto.TdsRefundDto.ApplicationResponse;
import com.taxedge.itr.application.dto.TdsRefundDto.CreateApplicationRequest;
import com.taxedge.itr.application.dto.TdsRefundDto.PaymentRequest;
import com.taxedge.itr.application.dto.TdsRefundDto.TaxCalculationRequest;
import com.taxedge.itr.application.dto.TdsRefundDto.TaxCalculationResponse;
import com.taxedge.itr.application.service.TdsRefundService;

@RestController
@RequestMapping("/tds-refund")
@CrossOrigin(origins = "*")
public class TdsRefundController {

    @Autowired
    private TdsRefundService tdsRefundService;

    /**
     * Dynamically calculates estimated tax liability and refund/payable breakdown.
     */
    @PostMapping("/calculate")
    public ResponseEntity<TaxCalculationResponse> calculateEstimatedTax(@RequestBody TaxCalculationRequest request) {
        TaxCalculationResponse response = tdsRefundService.calculateEstimatedTax(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Creates or updates a TDS Refund application draft.
     */
    @PostMapping("/apply")
    public ResponseEntity<ApplicationResponse> applyTdsRefund(@RequestBody CreateApplicationRequest request) {
        ApplicationResponse response = tdsRefundService.createOrUpdateApplication(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Confirms payment and submits application.
     */
    @PostMapping("/pay")
    public ResponseEntity<ApplicationResponse> payAndSubmit(@RequestBody PaymentRequest request) {
        ApplicationResponse response = tdsRefundService.processPayment(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Gets status and details of a TDS Refund application.
     */
    @GetMapping("/status/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplicationStatus(@PathVariable String applicationId) {
        ApplicationResponse response = tdsRefundService.getApplication(applicationId);
        return ResponseEntity.ok(response);
    }
}
