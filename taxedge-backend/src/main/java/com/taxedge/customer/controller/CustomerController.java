package com.taxedge.customer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.dto.LoginRequest;
import com.taxedge.customer.dto.UpdatePasswordDto;
import com.taxedge.customer.service.CustomerService;
import com.taxedge.security.jwt.CustomerJwt;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/customer")
public class CustomerController {
	
	@Autowired
	private CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<CustomerJwt> registerCustomer(@RequestBody CustomerDto customerDto) {
        CustomerJwt customerJwt = customerService.registerCustomer(customerDto);
        return new ResponseEntity<>(customerJwt, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<CustomerJwt> loginCustomer(@RequestBody LoginRequest loginRequest) {
        CustomerJwt customerJwt = customerService.loginCustomer(loginRequest);
        return new ResponseEntity<>(customerJwt, HttpStatus.OK);
    }
    
    @PatchMapping("/update_password")
    public ResponseEntity<String> updatePassword(@Valid @RequestBody UpdatePasswordDto updatePasswordDto) {

        String message = customerService.updatePassword(updatePasswordDto);

        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @GetMapping("/exists/{mobileNumber}")
    public ResponseEntity<java.util.Map<String, Object>> checkUserExists(@PathVariable String mobileNumber) {
        java.util.Map<String, Object> status = customerService.checkCustomerStatus(mobileNumber);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCustomerProfile(
            @org.springframework.web.bind.annotation.RequestParam(value = "identifier", required = false) String identifier,
            @org.springframework.web.bind.annotation.RequestParam(value = "mobileNumber", required = false) String mobileNumber,
            @org.springframework.web.bind.annotation.RequestParam(value = "customerId", required = false) String customerId,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Customer-Mobile", required = false) String headerMobile,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Customer-Id", required = false) String headerCustId,
            org.springframework.security.core.Authentication authentication) {

        String targetIdentifier = null;

        if (identifier != null && !identifier.isBlank()) {
            targetIdentifier = identifier;
        } else if (mobileNumber != null && !mobileNumber.isBlank()) {
            targetIdentifier = mobileNumber;
        } else if (customerId != null && !customerId.isBlank()) {
            targetIdentifier = customerId;
        } else if (headerMobile != null && !headerMobile.isBlank()) {
            targetIdentifier = headerMobile;
        } else if (headerCustId != null && !headerCustId.isBlank()) {
            targetIdentifier = headerCustId;
        } else if (authentication != null && authentication.getPrincipal() instanceof com.taxedge.customer.entity.Customer) {
            targetIdentifier = ((com.taxedge.customer.entity.Customer) authentication.getPrincipal()).getCustId();
        }

        if (targetIdentifier == null || targetIdentifier.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Customer identification is required"));
        }

        CustomerDto profile = customerService.getCustomerProfile(targetIdentifier);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("message", "Customer profile not found for: " + targetIdentifier));
        }

        return ResponseEntity.ok(profile);
    }

    @org.springframework.web.bind.annotation.PutMapping("/profile")
    public ResponseEntity<?> updateCustomerProfile(
            @RequestBody CustomerDto updateDto,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Customer-Mobile", required = false) String headerMobile,
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Customer-Id", required = false) String headerCustId,
            org.springframework.security.core.Authentication authentication) {

        if (updateDto == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Customer data required"));
        }

        if ((updateDto.getCustId() == null || updateDto.getCustId().isBlank()) && headerCustId != null && !headerCustId.isBlank()) {
            updateDto.setCustId(headerCustId.trim());
        }

        if ((updateDto.getMobileNumber() == null || updateDto.getMobileNumber().isBlank()) && headerMobile != null && !headerMobile.isBlank()) {
            updateDto.setMobileNumber(headerMobile.trim());
        }

        if ((updateDto.getCustId() == null || updateDto.getCustId().isBlank())
                && authentication != null && authentication.getPrincipal() instanceof com.taxedge.customer.entity.Customer) {
            updateDto.setCustId(((com.taxedge.customer.entity.Customer) authentication.getPrincipal()).getCustId());
        }

        CustomerDto updated = customerService.updateCustomerProfile(updateDto);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("message", "Customer not found for update"));
        }

        return ResponseEntity.ok(updated);
    }
}