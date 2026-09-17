package com.taxedge.customer.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.taxedge.customer.enums.CustomerType;
import com.taxedge.customer.enums.Gender;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomerDto {
    
    @JsonAlias({"customerId"})
    private String custId;

    @JsonAlias({"fullName"})
    private String name;

    private String email;

    @JsonAlias({"mobile"})
    private String mobileNumber;

    @JsonAlias({"adhar"})
    private String aadhaar;

    private String pan;

    @JsonAlias({"dateOfBirth"})
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dob;

    private Gender gender;
    private String fatherSpouseName;

    @JsonAlias({"custType"})
    private CustomerType customerType;

    private String addressLine1;
    private String addressLine2;
    private String city;

    @JsonAlias({"pinCode"})
    private String pincode;

    private String state;
    private String address;
    private String password;
    private LocalDateTime createdAt;
    private String pushToken;
}




