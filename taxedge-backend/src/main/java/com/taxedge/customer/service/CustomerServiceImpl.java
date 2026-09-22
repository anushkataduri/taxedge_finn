package com.taxedge.customer.service;

import java.time.LocalDateTime;

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
import com.taxedge.notification.service.FcmNotificationServiceImpl;
import com.taxedge.security.jwt.CustomerJwt;
import com.taxedge.security.jwt.service.JwtService;
import com.taxedge.security.jwt.service.RefreshTokenService;

import jakarta.transaction.Transactional;

@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private FcmNotificationServiceImpl fcmNotificationService;
	
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

        validateUniqueFields(customerDto);

        Customer customer = Customer.builder()
                .custId(CustomerHelper.generateCustomerId())
                .name(customerDto.getName())
                .email(customerDto.getEmail())
                .mobileNumber(customerDto.getMobileNumber())
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

        Customer savedCustomer = customerRepository.save(customer);
        
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
                savedCustomer.getMobileNumber()
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
        Customer customer = customerRepository.findByMobileNumber(loginRequest.getMobileNumber())
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

        System.out.println("\n=========================================================================");
        System.out.println("🔑 [LOGIN SUCCESS] ACCESS TOKEN FOR EXISTING USER (" + customer.getCustId() + " / " + customer.getMobileNumber() + "):");
        System.out.println(accessToken);
        System.out.println("=========================================================================\n");

        return new CustomerJwt(
                accessToken,
                refreshToken,
                customer.getCustId(),
                customer.getName(),
                customer.getMobileNumber()
        );
    }


    @Override
    @Transactional
    public String updatePassword(UpdatePasswordDto updatePasswordDto) {
        Customer customer = customerRepository.findByMobileNumber(updatePasswordDto.getMobileNumber())
                .orElseThrow(() -> new InvalidCredentialsException("Customer not found"));

        customer.setPassword(passwordEncoder.encode(updatePasswordDto.getPassword()));
        customerRepository.save(customer);

        return "Password updated successfully";
    }

    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        return mobileNumber != null && customerRepository.findByMobileNumber(mobileNumber.trim()).isPresent();
    }


	@Override
	public CustomerDto getDetails(String custId) {
		Customer customer = customerRepository.findById(custId)
				.orElseThrow(() -> new RuntimeException("Customer not found with id: " + custId));

		CustomerDto customerDto = CustomerDto.builder()
				.custId(customer.getCustId())
				.name(customer.getName())
				.email(customer.getEmail())
				.mobileNumber(customer.getMobileNumber())
				.dob(customer.getDob())
				.gender(customer.getGender())
				.fatherSpouseName(customer.getFatherSpouseName())
				.customerType(customer.getCustomerType())
				.addressLine1(customer.getAddressLine1())
				.addressLine2(customer.getAddressLine2())
				.city(customer.getCity())
				.pincode(customer.getPincode())
				.state(customer.getState())
				.address(customer.getAddress())
				.pan(customer.getPan())
				.aadhaar(customer.getAadhaar())
				.createdAt(customer.getCreatedAt())
				.build();

		return customerDto;
	}


	@Override
	@Transactional
	public String updateCustomer(CustomerDto dto) {
		Customer customer = (dto.getCustId() != null && !dto.getCustId().isBlank())
				? customerRepository.findById(dto.getCustId()).orElse(null)
				: null;

		if (customer == null && dto.getMobileNumber() != null && !dto.getMobileNumber().isBlank()) {
			customer = customerRepository.findByMobileNumber(dto.getMobileNumber().trim()).orElse(null);
		}

		if (customer == null) {
			throw new RuntimeException("Customer not found with id: " + dto.getCustId());
		}

		if (dto.getName() != null) customer.setName(dto.getName());
		if (dto.getEmail() != null) customer.setEmail(dto.getEmail());
		if (dto.getMobileNumber() != null) customer.setMobileNumber(dto.getMobileNumber());
		if (dto.getAadhaar() != null) customer.setAadhaar(dto.getAadhaar());
		if (dto.getPan() != null) customer.setPan(dto.getPan());
		if (dto.getDob() != null) customer.setDob(dto.getDob());
		if (dto.getGender() != null) customer.setGender(dto.getGender());
		if (dto.getFatherSpouseName() != null) customer.setFatherSpouseName(dto.getFatherSpouseName());
		if (dto.getCustomerType() != null) customer.setCustomerType(dto.getCustomerType());
		if (dto.getAddressLine1() != null) customer.setAddressLine1(dto.getAddressLine1());
		if (dto.getAddressLine2() != null) customer.setAddressLine2(dto.getAddressLine2());
		if (dto.getCity() != null) customer.setCity(dto.getCity());
		if (dto.getPincode() != null) customer.setPincode(dto.getPincode());
		if (dto.getState() != null) customer.setState(dto.getState());
		if (dto.getAddress() != null) customer.setAddress(dto.getAddress());

		customerRepository.save(customer);
		return "Updated Successfully";
	}
    
    
    
    
}