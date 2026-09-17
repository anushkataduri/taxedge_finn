package com.taxedge.application.interfaces.rest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.application.application.dto.ApplicationDto;
import com.taxedge.application.application.service.ApplicationService;
import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<?> getApplications(
            @RequestHeader(value = "X-Customer-Id", required = false) String headerCustId,
            @RequestHeader(value = "X-Customer-Mobile", required = false) String headerMobile,
            @RequestParam(value = "customerId", required = false) String queryCustId,
            @RequestParam(value = "mobileNumber", required = false) String queryMobile,
            Authentication authentication) {

        String customerId = resolveCustomerId(headerCustId, queryCustId, authentication);
        String mobileNumber = resolveCustomerMobile(headerMobile, queryMobile, authentication);

        // If customerId is known, lookup customer to fill mobile if missing
        if ((mobileNumber == null || mobileNumber.isBlank()) && customerId != null && !customerId.isBlank()) {
            customerRepository.findById(customerId).ifPresent(c -> {});
            Optional<Customer> cOpt = customerRepository.findById(customerId);
            if (cOpt.isPresent()) {
                mobileNumber = cOpt.get().getMobileNumber();
            }
        }

        // If mobile is known, lookup customer to fill customerId if missing
        if ((customerId == null || customerId.isBlank()) && mobileNumber != null && !mobileNumber.isBlank()) {
            Optional<Customer> cOpt = customerRepository.findByMobileNumber(mobileNumber.replaceAll("\\D", ""));
            if (cOpt.isPresent()) {
                customerId = cOpt.get().getCustId();
            }
        }

        if ((customerId == null || customerId.isBlank()) && (mobileNumber == null || mobileNumber.isBlank())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Customer authentication or identification is required"));
        }

        List<ApplicationDto> applications = applicationService.getApplicationsForCustomer(customerId, mobileNumber);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(
            @PathVariable String id,
            @RequestHeader(value = "X-Customer-Id", required = false) String headerCustId,
            @RequestHeader(value = "X-Customer-Mobile", required = false) String headerMobile,
            @RequestParam(value = "customerId", required = false) String queryCustId,
            @RequestParam(value = "mobileNumber", required = false) String queryMobile,
            Authentication authentication) {

        String customerId = resolveCustomerId(headerCustId, queryCustId, authentication);
        String mobileNumber = resolveCustomerMobile(headerMobile, queryMobile, authentication);

        Optional<ApplicationDto> appOpt = applicationService.getApplicationById(id, customerId, mobileNumber);
        if (appOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Application not found: " + id));
        }

        return ResponseEntity.ok(appOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createApplication(
            @RequestBody ApplicationDto requestDto,
            @RequestHeader(value = "X-Customer-Id", required = false) String headerCustId,
            @RequestHeader(value = "X-Customer-Mobile", required = false) String headerMobile,
            Authentication authentication) {

        if (requestDto == null || requestDto.getId() == null || requestDto.getId().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Application payload with id is required"));
        }

        String customerId = resolveCustomerId(headerCustId, requestDto.getCustomerId(), authentication);
        String mobileNumber = resolveCustomerMobile(headerMobile, requestDto.getMobileNumber(), authentication);

        ApplicationDto created = applicationService.createOrUpdateApplication(requestDto, customerId, mobileNumber);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    private String resolveCustomerId(String header, String explicit, Authentication auth) {
        if (header != null && !header.isBlank()) return header.trim();
        if (explicit != null && !explicit.isBlank()) return explicit.trim();
        if (auth != null && auth.getPrincipal() instanceof Customer) {
            return ((Customer) auth.getPrincipal()).getCustId();
        }
        return null;
    }

    private String resolveCustomerMobile(String header, String explicit, Authentication auth) {
        if (header != null && !header.isBlank()) return header.replaceAll("\\D", "");
        if (explicit != null && !explicit.isBlank()) return explicit.replaceAll("\\D", "");
        if (auth != null && auth.getPrincipal() instanceof Customer) {
            return ((Customer) auth.getPrincipal()).getMobileNumber();
        }
        return null;
    }
}
