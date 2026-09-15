package com.taxedge.customer.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taxedge.customer.dto.CustomerDto;
import com.taxedge.customer.dto.LoginRequest;
import com.taxedge.customer.dto.UpdatePasswordDto;
import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.exception.DuplicateResourceException;
import com.taxedge.customer.exception.InvalidCredentialsException;
import com.taxedge.customer.helper.CustomerHelper;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.notification.service.FcmNotificationService;
import com.taxedge.security.jwt.CustomerJwt;
import com.taxedge.security.jwt.service.JwtService;
import com.taxedge.security.jwt.service.RefreshTokenService;

import jakarta.transaction.Transactional;

@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private FcmNotificationService fcmNotificationService;
	
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    public CustomerJwt registerCustomer(CustomerDto customerDto) {
        String cleanMobile = customerDto.getMobileNumber() != null ? customerDto.getMobileNumber().replaceAll("\\D", "") : "";
        customerDto.setMobileNumber(cleanMobile);

        Optional<Customer> existingOpt = customerRepository.findByMobileNumber(cleanMobile);
        Customer savedCustomer;

        if (existingOpt.isPresent()) {
            Customer customer = existingOpt.get();
            customer.setName(customerDto.getName());
            if (customerDto.getEmail() != null && !customerDto.getEmail().isBlank()) {
                customer.setEmail(customerDto.getEmail());
            }
            if (customerDto.getAadhaar() != null && !customerDto.getAadhaar().isBlank()) {
                customer.setAadhaar(customerDto.getAadhaar());
            }
            if (customerDto.getPan() != null && !customerDto.getPan().isBlank()) {
                customer.setPan(customerDto.getPan());
            }
            if (customerDto.getDob() != null) {
                customer.setDob(customerDto.getDob());
            }
            if (customerDto.getGender() != null) {
                customer.setGender(customerDto.getGender());
            }
            if (customerDto.getFatherSpouseName() != null) {
                customer.setFatherSpouseName(customerDto.getFatherSpouseName());
            }
            if (customerDto.getCustomerType() != null) {
                customer.setCustomerType(customerDto.getCustomerType());
            }
            if (customerDto.getAddressLine1() != null) {
                customer.setAddressLine1(customerDto.getAddressLine1());
            }
            if (customerDto.getAddressLine2() != null) {
                customer.setAddressLine2(customerDto.getAddressLine2());
            }
            if (customerDto.getCity() != null) {
                customer.setCity(customerDto.getCity());
            }
            if (customerDto.getPincode() != null) {
                customer.setPincode(customerDto.getPincode());
            }
            if (customerDto.getState() != null) {
                customer.setState(customerDto.getState());
            }
            if (customerDto.getAddress() != null) {
                customer.setAddress(customerDto.getAddress());
            }
            if (customerDto.getPassword() != null && !customerDto.getPassword().isBlank()) {
                customer.setPassword(passwordEncoder.encode(customerDto.getPassword()));
            }
            if (customerDto.getPushToken() != null && !customerDto.getPushToken().isBlank()) {
                customer.setPushToken(customerDto.getPushToken());
            }
            savedCustomer = customerRepository.save(customer);
        } else {
            validateUniqueFields(customerDto);

            Customer customer = Customer.builder()
                    .custId(CustomerHelper.generateCustomerId())
                    .name(customerDto.getName())
                    .email(customerDto.getEmail())
                    .mobileNumber(cleanMobile)
                    .aadhaar(customerDto.getAadhaar())
                    .pan(customerDto.getPan())
                    .dob(customerDto.getDob())
                    .gender(customerDto.getGender())
                    .fatherSpouseName(customerDto.getFatherSpouseName())
                    .customerType(customerDto.getCustomerType())
                    .addressLine1(customerDto.getAddressLine1())
                    .addressLine2(customerDto.getAddressLine2())
                    .city(customerDto.getCity())
                    .pincode(customerDto.getPincode())
                    .state(customerDto.getState())
                    .address(customerDto.getAddress())
                    .password(passwordEncoder.encode(customerDto.getPassword()))
                    .pushToken(customerDto.getPushToken())
                    .createdAt(LocalDateTime.now())
                    .build();

            savedCustomer = customerRepository.save(customer);
        }
        
        if (savedCustomer.getPushToken() != null && !savedCustomer.getPushToken().isBlank()) {
            fcmNotificationService.sendRegistrationSuccessNotification(
                    savedCustomer.getPushToken(),
                    savedCustomer.getName()
            );
        }

        String accessToken = jwtService.generateToken(
                savedCustomer.getCustId(),
                savedCustomer.getName(),
                savedCustomer.getMobileNumber()
        );

        String refreshToken = refreshTokenService.createRefreshToken(savedCustomer);

        return new CustomerJwt(
                accessToken,
                refreshToken,
                savedCustomer.getCustId(),
                savedCustomer.getName(),
                savedCustomer.getMobileNumber(),
                savedCustomer.getCustomerType() != null ? savedCustomer.getCustomerType().name() : "INDIVIDUAL",
                Boolean.TRUE,
                Boolean.TRUE
        );
    }

  
    private void validateUniqueFields(CustomerDto dto) {

        if (isPresent(dto.getAadhaar()) && customerRepository.existsByAadhaar(dto.getAadhaar())) {
            throw new DuplicateResourceException("aadhaar", "Aadhaar already registered");
        }

        if (isPresent(dto.getPan()) && customerRepository.existsByPan(dto.getPan())) {
            throw new DuplicateResourceException("pan", "PAN already registered");
        }
    }

    private boolean isPresent(String value) {
        return value != null && !value.isBlank();
    }


    @Override
    public CustomerJwt loginCustomer(LoginRequest loginRequest) {
        String cleanMobile = loginRequest.getMobileNumber() != null ? loginRequest.getMobileNumber().replaceAll("\\D", "") : "";
        Customer customer = customerRepository.findByMobileNumber(cleanMobile)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid mobile number or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            throw new InvalidCredentialsException("Invalid mobile number or password");
        }

        String accessToken = jwtService.generateToken(
                customer.getCustId(),
                customer.getName(),
                customer.getMobileNumber()
        );

        String refreshToken = refreshTokenService.createRefreshToken(customer);

        boolean hasPasscode = customer.getPassword() != null && !customer.getPassword().isBlank();
        boolean profileCompleted = hasPasscode && customer.getName() != null && !customer.getName().isBlank() && customer.getCustomerType() != null;

        return new CustomerJwt(
                accessToken,
                refreshToken,
                customer.getCustId(),
                customer.getName(),
                customer.getMobileNumber(),
                customer.getCustomerType() != null ? customer.getCustomerType().name() : "INDIVIDUAL",
                profileCompleted,
                hasPasscode
        );
    }


    @Override
    @Transactional
    public String updatePassword(UpdatePasswordDto updatePasswordDto) {
        String cleanMobile = updatePasswordDto.getMobileNumber() != null ? updatePasswordDto.getMobileNumber().replaceAll("\\D", "") : "";
    	Optional<Customer> optionalCustomer = customerRepository.findByMobileNumber(cleanMobile);

    	if (optionalCustomer.isEmpty()) {
    	    return "Customer not found";
    	}

    	Customer customer = optionalCustomer.get();
    	customer.setPassword(passwordEncoder.encode(updatePasswordDto.getPassword()));
    	customerRepository.save(customer);

    	return "Password updated successfully";
    }

    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.trim().isEmpty()) {
            return false;
        }
        String cleanMobile = mobileNumber.replaceAll("\\D", "");
        return customerRepository.findByMobileNumber(cleanMobile).isPresent();
    }

    @Override
    public Map<String, Object> checkCustomerStatus(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.trim().isEmpty()) {
            return Map.of(
                "exists", false,
                "customerExists", false,
                "profileCompleted", false,
                "hasPasscode", false
            );
        }
        String cleanMobile = mobileNumber.replaceAll("\\D", "");
        Optional<Customer> opt = customerRepository.findByMobileNumber(cleanMobile);
        if (opt.isEmpty()) {
            return Map.of(
                "exists", false,
                "customerExists", false,
                "profileCompleted", false,
                "hasPasscode", false
            );
        }
        Customer c = opt.get();
        boolean hasPasscode = c.getPassword() != null && !c.getPassword().isBlank();
        boolean profileCompleted = hasPasscode && c.getName() != null && !c.getName().isBlank() && c.getCustomerType() != null;

        return Map.of(
            "exists", true,
            "customerExists", true,
            "profileCompleted", profileCompleted,
            "hasPasscode", hasPasscode
        );
    }
}