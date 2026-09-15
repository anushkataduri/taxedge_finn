package com.taxedge.security.otp.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.security.otp.entity.Otp;
import com.taxedge.security.otp.service.OtpService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {

	@Autowired
    private final OtpService otpService;

	@Autowired
    private final CustomerRepository customerRepository;

    @PostMapping("/generate")
    public ResponseEntity<String> generateOtp(@RequestBody Otp otp) {
        String result = otpService.generateOtp(otp);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Otp otp) {
        try {
            boolean isValid = otpService.verifyOtp(otp);

            if (isValid) {
                String cleanMobile = otp.getMobileNumber() != null ? otp.getMobileNumber().replaceAll("\\D", "") : "";
                Optional<Customer> opt = customerRepository.findByMobileNumber(cleanMobile);
                boolean isExisting = opt.isPresent();
                boolean hasPasscode = false;
                boolean profileCompleted = false;

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "OTP verified successfully");
                response.put("isExistingUser", isExisting);
                response.put("customerExists", isExisting);

                if (isExisting) {
                    Customer c = opt.get();
                    hasPasscode = c.getPassword() != null && !c.getPassword().isBlank();
                    profileCompleted = hasPasscode && c.getName() != null && !c.getName().isBlank() && c.getCustomerType() != null;
                    response.put("profileCompleted", profileCompleted);
                    response.put("hasPasscode", hasPasscode);

                    Map<String, Object> customerSummary = new HashMap<>();
                    customerSummary.put("custId", c.getCustId());
                    customerSummary.put("name", c.getName());
                    customerSummary.put("email", c.getEmail());
                    customerSummary.put("mobileNumber", c.getMobileNumber());
                    customerSummary.put("customerType", c.getCustomerType() != null ? c.getCustomerType().name() : "INDIVIDUAL");
                    response.put("customer", customerSummary);
                } else {
                    response.put("profileCompleted", false);
                    response.put("hasPasscode", false);
                }

                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", e.getMessage() != null ? e.getMessage() : "Invalid OTP");
            return ResponseEntity.status(400).body(err);
        }

        return ResponseEntity.status(400).body(Map.of(
            "success", false,
            "message", "Invalid OTP"
        ));
    }
}