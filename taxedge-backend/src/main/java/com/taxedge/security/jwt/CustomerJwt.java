package com.taxedge.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerJwt {

    private String accessToken;

    private String refreshToken;

    private String custId;

    private String name;

    private String mobileNumber;

    private String customerType;

    private Boolean profileCompleted;

    private Boolean hasPasscode;

    public CustomerJwt(String accessToken, String refreshToken, String custId, String name, String mobileNumber) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.custId = custId;
        this.name = name;
        this.mobileNumber = mobileNumber;
        this.profileCompleted = true;
        this.hasPasscode = true;
    }
}