package com.taxedge.security.otp.service;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.security.otp.entity.Otp;
import com.taxedge.security.otp.repository.OtpRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

	@Autowired
    private final OtpRepository otpRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public String generateOtp(Otp otp) {
        int code = 100000 + secureRandom.nextInt(900000);
        String otpCode = String.valueOf(code);

        Otp otpEntity = otpRepository.findTopByMobileNumberOrderByIdDesc(otp.getMobileNumber());
        if (otpEntity != null) {
            otpEntity.setOtpCode(otpCode);
        } else {
            otpEntity = Otp.builder()
                    .mobileNumber(otp.getMobileNumber())
                    .otpCode(otpCode)
                    .build();
        }

        otpRepository.save(otpEntity);

        System.out.println("OTP for " + otp.getMobileNumber() + " is: " + otpCode);

        return "OTP sent successfully";
    }

    @Override
    public boolean verifyOtp(Otp otp) {
        if (otp.getMobileNumber() == null || otp.getOtpCode() == null) {
            return false;
        }

        Otp savedOtp = otpRepository.findTopByMobileNumberOrderByIdDesc(otp.getMobileNumber());

        if (savedOtp == null) {
            return false;
        }

        return otp.getOtpCode().equals(savedOtp.getOtpCode());
    }
}