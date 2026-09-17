package com.taxedge.itr.application.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.itr.application.dto.TdsRefundDto.ApplicationResponse;
import com.taxedge.itr.application.dto.TdsRefundDto.CreateApplicationRequest;
import com.taxedge.itr.application.dto.TdsRefundDto.PaymentRequest;
import com.taxedge.itr.application.dto.TdsRefundDto.TaxCalculationRequest;
import com.taxedge.itr.application.dto.TdsRefundDto.TaxCalculationResponse;
import com.taxedge.itr.domain.model.TdsRefundApplication;
import com.taxedge.itr.domain.model.TdsRefundStatus;
import com.taxedge.itr.infrastructure.repository.TdsRefundApplicationRepository;

@Service
public class TdsRefundService {

    @Autowired
    private TdsRefundApplicationRepository repository;

    private static final String CA_DISCLAIMER =
            "Preliminary estimate based on the information provided. Final refund/tax payable will be determined after CA verification, ITR filing and Income Tax Department processing.";

    /**
     * Dynamically calculates estimated income tax liability and TDS refund/payable.
     */
    public TaxCalculationResponse calculateEstimatedTax(TaxCalculationRequest req) {
        BigDecimal salary = req.getSalaryIncome();
        BigDecimal other = req.getOtherIncome();
        BigDecimal interest = req.getInterestIncome();
        BigDecimal rental = req.getRentalIncome();
        BigDecimal capitalGains = req.getCapitalGainsIncome();
        BigDecimal business = req.getBusinessIncome();

        BigDecimal grossTotalIncome = salary.add(other).add(interest).add(rental).add(capitalGains).add(business);

        boolean isOldRegime = "OLD".equalsIgnoreCase(req.getTaxRegime());

        // Standard Deduction: for salary earners
        BigDecimal standardDeduction = BigDecimal.ZERO;
        if (salary.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal maxStd = isOldRegime ? new BigDecimal("50000") : new BigDecimal("75000");
            standardDeduction = salary.min(maxStd);
        }

        // Chapter VI-A Deductions
        BigDecimal deductions80C = req.getDeductions80C().min(new BigDecimal("150000"));
        BigDecimal deductions80D = req.getDeductions80D().min(new BigDecimal("50000"));
        BigDecimal homeLoanInterest = req.getHomeLoanInterest().min(new BigDecimal("200000"));
        BigDecimal otherDeductions = req.getOtherDeductions();

        BigDecimal eligibleDeductions;
        if (isOldRegime) {
            eligibleDeductions = standardDeduction
                    .add(deductions80C)
                    .add(deductions80D)
                    .add(homeLoanInterest)
                    .add(otherDeductions);
        } else {
            // New Tax Regime u/s 115BAC allows standard deduction for salaried individuals
            eligibleDeductions = standardDeduction;
        }

        eligibleDeductions = eligibleDeductions.min(grossTotalIncome);
        BigDecimal taxableIncome = grossTotalIncome.subtract(eligibleDeductions).max(BigDecimal.ZERO);

        // Slab Tax Calculation
        BigDecimal slabTax = BigDecimal.ZERO;
        BigDecimal rebate87A = BigDecimal.ZERO;

        if (isOldRegime) {
            // Old Regime Slabs: Up to 2.5L: 0, 2.5L-5L: 5%, 5L-10L: 20%, Above 10L: 30%
            if (taxableIncome.compareTo(new BigDecimal("250000")) > 0) {
                BigDecimal slab1 = taxableIncome.min(new BigDecimal("500000")).subtract(new BigDecimal("250000"));
                slabTax = slabTax.add(slab1.multiply(new BigDecimal("0.05")));
            }
            if (taxableIncome.compareTo(new BigDecimal("500000")) > 0) {
                BigDecimal slab2 = taxableIncome.min(new BigDecimal("1000000")).subtract(new BigDecimal("500000"));
                slabTax = slabTax.add(slab2.multiply(new BigDecimal("0.20")));
            }
            if (taxableIncome.compareTo(new BigDecimal("1000000")) > 0) {
                BigDecimal slab3 = taxableIncome.subtract(new BigDecimal("1000000"));
                slabTax = slabTax.add(slab3.multiply(new BigDecimal("0.30")));
            }
            // 87A rebate for Old Regime: if taxable income <= 5L, rebate up to 12,500
            if (taxableIncome.compareTo(new BigDecimal("500000")) <= 0) {
                rebate87A = slabTax.min(new BigDecimal("12500"));
            }
        } else {
            // New Regime Slabs (AY 2025-26):
            // 0 - 3L: Nil
            // 3L - 7L: 5%
            // 7L - 10L: 10%
            // 10L - 12L: 15%
            // 12L - 15L: 20%
            // Above 15L: 30%
            if (taxableIncome.compareTo(new BigDecimal("300000")) > 0) {
                BigDecimal s1 = taxableIncome.min(new BigDecimal("700000")).subtract(new BigDecimal("300000"));
                slabTax = slabTax.add(s1.multiply(new BigDecimal("0.05")));
            }
            if (taxableIncome.compareTo(new BigDecimal("700000")) > 0) {
                BigDecimal s2 = taxableIncome.min(new BigDecimal("1000000")).subtract(new BigDecimal("700000"));
                slabTax = slabTax.add(s2.multiply(new BigDecimal("0.10")));
            }
            if (taxableIncome.compareTo(new BigDecimal("1000000")) > 0) {
                BigDecimal s3 = taxableIncome.min(new BigDecimal("1200000")).subtract(new BigDecimal("1000000"));
                slabTax = slabTax.add(s3.multiply(new BigDecimal("0.15")));
            }
            if (taxableIncome.compareTo(new BigDecimal("1200000")) > 0) {
                BigDecimal s4 = taxableIncome.min(new BigDecimal("1500000")).subtract(new BigDecimal("1200000"));
                slabTax = slabTax.add(s4.multiply(new BigDecimal("0.20")));
            }
            if (taxableIncome.compareTo(new BigDecimal("1500000")) > 0) {
                BigDecimal s5 = taxableIncome.subtract(new BigDecimal("1500000"));
                slabTax = slabTax.add(s5.multiply(new BigDecimal("0.30")));
            }
            // 87A rebate for New Regime: if taxable income <= 7L, rebate up to 25,000
            if (taxableIncome.compareTo(new BigDecimal("700000")) <= 0) {
                rebate87A = slabTax.min(new BigDecimal("25000"));
            }
        }

        BigDecimal taxAfterRebate = slabTax.subtract(rebate87A).max(BigDecimal.ZERO);
        BigDecimal cess = taxAfterRebate.multiply(new BigDecimal("0.04")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal estimatedTaxLiability = taxAfterRebate.add(cess).setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalTaxCredits = req.getTotalTdsDeducted()
                .add(req.getTcsAmount())
                .add(req.getAdvanceTaxPaid())
                .add(req.getSelfAssessmentTaxPaid())
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal estimatedRefund = BigDecimal.ZERO;
        BigDecimal estimatedTaxPayable = BigDecimal.ZERO;
        boolean isAdditionalTaxPayable = false;

        if (totalTaxCredits.compareTo(estimatedTaxLiability) >= 0) {
            estimatedRefund = totalTaxCredits.subtract(estimatedTaxLiability).setScale(2, RoundingMode.HALF_UP);
        } else {
            estimatedTaxPayable = estimatedTaxLiability.subtract(totalTaxCredits).setScale(2, RoundingMode.HALF_UP);
            isAdditionalTaxPayable = true;
        }

        // TaxEdge Service Fee: Configurable percentage or base tier
        BigDecimal serviceFee;
        if (estimatedRefund.compareTo(BigDecimal.ZERO) > 0) {
            // 10% of refund, min 499, max 4999
            BigDecimal pctFee = estimatedRefund.multiply(new BigDecimal("0.10")).setScale(2, RoundingMode.HALF_UP);
            serviceFee = pctFee.max(new BigDecimal("499")).min(new BigDecimal("4999"));
        } else {
            serviceFee = new BigDecimal("499.00"); // Base ITR preparation fee
        }

        BigDecimal gstAmount = serviceFee.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalPayableFee = serviceFee.add(gstAmount).setScale(2, RoundingMode.HALF_UP);

        TaxCalculationResponse res = new TaxCalculationResponse();
        res.setGrossTotalIncome(grossTotalIncome.setScale(2, RoundingMode.HALF_UP));
        res.setTotalDeductions(eligibleDeductions.setScale(2, RoundingMode.HALF_UP));
        res.setTaxableIncome(taxableIncome.setScale(2, RoundingMode.HALF_UP));
        res.setStandardDeduction(standardDeduction.setScale(2, RoundingMode.HALF_UP));
        res.setSlabTax(slabTax.setScale(2, RoundingMode.HALF_UP));
        res.setRebate87A(rebate87A.setScale(2, RoundingMode.HALF_UP));
        res.setCess(cess);
        res.setEstimatedTaxLiability(estimatedTaxLiability);
        res.setTotalTaxCredits(totalTaxCredits);
        res.setEstimatedRefund(estimatedRefund);
        res.setEstimatedTaxPayable(estimatedTaxPayable);
        res.setAdditionalTaxPayable(isAdditionalTaxPayable);
        res.setServiceFee(serviceFee);
        res.setGstAmount(gstAmount);
        res.setTotalPayableFee(totalPayableFee);
        res.setDisclaimer(CA_DISCLAIMER);

        return res;
    }

    /**
     * Creates or updates a TDS Refund application draft.
     */
    @Transactional
    public ApplicationResponse createOrUpdateApplication(CreateApplicationRequest req) {
        String appId = req.getApplicationId();
        if (appId == null || appId.trim().isEmpty()) {
            appId = generateApplicationId();
        }

        TdsRefundApplication app = repository.findByApplicationId(appId)
                .orElse(new TdsRefundApplication());

        app.setApplicationId(appId);
        app.setFullName(req.getFullName());
        app.setPan(req.getPan() != null ? req.getPan().toUpperCase().trim() : "");
        app.setAadhaar(req.getAadhaar());
        app.setDob(req.getDob());
        app.setMobileNumber(req.getMobileNumber());
        app.setEmail(req.getEmail());
        app.setAddress(req.getAddress());
        app.setCity(req.getCity());
        app.setState(req.getState());
        app.setPinCode(req.getPinCode());

        app.setAccountHolderName(req.getAccountHolderName());
        app.setAccountNumber(req.getAccountNumber());
        app.setIfscCode(req.getIfscCode() != null ? req.getIfscCode().toUpperCase().trim() : "");
        app.setBankName(req.getBankName());
        app.setBranchName(req.getBranchName());
        app.setAccountType(req.getAccountType());

        app.setAssessmentYear(req.getAssessmentYear());
        app.setFinancialYear(req.getFinancialYear());
        app.setTaxRegime(req.getTaxRegime());

        if (req.getSalaryIncome() != null) app.setSalaryIncome(req.getSalaryIncome());
        if (req.getOtherIncome() != null) app.setOtherIncome(req.getOtherIncome());
        if (req.getInterestIncome() != null) app.setInterestIncome(req.getInterestIncome());
        if (req.getRentalIncome() != null) app.setRentalIncome(req.getRentalIncome());
        if (req.getCapitalGainsIncome() != null) app.setCapitalGainsIncome(req.getCapitalGainsIncome());
        if (req.getBusinessIncome() != null) app.setBusinessIncome(req.getBusinessIncome());

        if (req.getTotalTdsDeducted() != null) app.setTotalTdsDeducted(req.getTotalTdsDeducted());
        if (req.getTcsAmount() != null) app.setTcsAmount(req.getTcsAmount());
        if (req.getAdvanceTaxPaid() != null) app.setAdvanceTaxPaid(req.getAdvanceTaxPaid());
        if (req.getSelfAssessmentTaxPaid() != null) app.setSelfAssessmentTaxPaid(req.getSelfAssessmentTaxPaid());
        if (req.getCarryForwardLoss() != null) app.setCarryForwardLoss(req.getCarryForwardLoss());

        if (req.getDeductions80C() != null) app.setDeductions80C(req.getDeductions80C());
        if (req.getDeductions80D() != null) app.setDeductions80D(req.getDeductions80D());
        if (req.getHomeLoanInterest() != null) app.setHomeLoanInterest(req.getHomeLoanInterest());
        if (req.getOtherDeductions() != null) app.setOtherDeductions(req.getOtherDeductions());

        if (req.getGrossTotalIncome() != null) app.setGrossTotalIncome(req.getGrossTotalIncome());
        if (req.getTotalDeductions() != null) app.setTotalDeductions(req.getTotalDeductions());
        if (req.getTaxableIncome() != null) app.setTaxableIncome(req.getTaxableIncome());
        if (req.getEstimatedTaxLiability() != null) app.setEstimatedTaxLiability(req.getEstimatedTaxLiability());
        if (req.getTotalTaxCredits() != null) app.setTotalTaxCredits(req.getTotalTaxCredits());
        if (req.getEstimatedRefund() != null) app.setEstimatedRefund(req.getEstimatedRefund());
        if (req.getIsAdditionalTaxPayable() != null) app.setIsAdditionalTaxPayable(req.getIsAdditionalTaxPayable());

        if (req.getDocumentsJson() != null) {
            app.setDocumentsJson(req.getDocumentsJson());
        }

        if (app.getStatus() == null || app.getStatus() == TdsRefundStatus.DRAFT) {
            app.setStatus(TdsRefundStatus.PAYMENT_PENDING);
        }

        app = repository.save(app);
        return mapToResponse(app);
    }

    /**
     * Processes payment and transitions application to APPLICATION_SUBMITTED / UNDER_VERIFICATION.
     */
    @Transactional
    public ApplicationResponse processPayment(PaymentRequest req) {
        if (req.getApplicationId() == null || req.getApplicationId().trim().isEmpty()) {
            throw new IllegalArgumentException("Application ID is required for payment");
        }

        TdsRefundApplication app = repository.findByApplicationId(req.getApplicationId())
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + req.getApplicationId()));

        if (Boolean.TRUE.equals(app.getIsPaid())) {
            return mapToResponse(app);
        }

        String paymentId = req.getPaymentId();
        if (paymentId == null || paymentId.trim().isEmpty()) {
            paymentId = "PAY-" + System.currentTimeMillis() + "-" + (100 + new Random().nextInt(900));
        }

        app.setPaymentId(paymentId);
        app.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "UPI");
        app.setTotalPaid(req.getAmount() != null ? req.getAmount() : BigDecimal.ZERO);
        app.setIsPaid(true);
        app.setPaidAt(LocalDateTime.now());
        app.setStatus(TdsRefundStatus.APPLICATION_SUBMITTED);

        app = repository.save(app);
        return mapToResponse(app);
    }

    /**
     * Retrieves application by ID.
     */
    @Transactional(readOnly = true)
    public ApplicationResponse getApplication(String applicationId) {
        TdsRefundApplication app = repository.findByApplicationId(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + applicationId));
        return mapToResponse(app);
    }

    private ApplicationResponse mapToResponse(TdsRefundApplication app) {
        ApplicationResponse res = new ApplicationResponse();
        res.setApplicationId(app.getApplicationId());
        res.setFullName(app.getFullName());
        res.setPan(app.getPan());
        res.setMobileNumber(app.getMobileNumber());
        res.setEmail(app.getEmail());
        res.setBankName(app.getBankName());
        res.setMaskedAccountNumber(maskAccountNumber(app.getAccountNumber(), app.getBankName()));
        res.setAssessmentYear(app.getAssessmentYear());
        res.setGrossTotalIncome(app.getGrossTotalIncome());
        res.setTaxableIncome(app.getTaxableIncome());
        res.setEstimatedTaxLiability(app.getEstimatedTaxLiability());
        res.setTotalTaxCredits(app.getTotalTaxCredits());
        res.setEstimatedRefund(app.getEstimatedRefund());
        res.setIsAdditionalTaxPayable(app.getIsAdditionalTaxPayable());
        res.setStatus(app.getStatus());
        res.setIsPaid(app.getIsPaid());
        res.setPaymentId(app.getPaymentId());
        res.setTotalPaid(app.getTotalPaid());
        res.setCreatedAt(app.getCreatedAt());
        res.setPaidAt(app.getPaidAt());
        return res;
    }

    private String maskAccountNumber(String accNum, String bankName) {
        if (accNum == null || accNum.length() < 4) {
            return (bankName != null ? bankName : "Bank") + " ••••";
        }
        String last4 = accNum.substring(accNum.length() - 4);
        return (bankName != null ? bankName : "Bank") + " ••••" + last4;
    }

    private String generateApplicationId() {
        int year = LocalDateTime.now().getYear();
        int randomSeq = 10000 + new Random().nextInt(90000);
        return "TDS-" + year + "-" + randomSeq;
    }
}
