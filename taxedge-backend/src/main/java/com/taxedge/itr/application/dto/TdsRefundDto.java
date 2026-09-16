package com.taxedge.itr.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.taxedge.itr.domain.model.TdsRefundStatus;

public class TdsRefundDto {

    public static class TaxCalculationRequest {
        private String assessmentYear;
        private String financialYear;
        private String taxRegime; // "NEW" or "OLD"
        private BigDecimal salaryIncome;
        private BigDecimal otherIncome;
        private BigDecimal interestIncome;
        private BigDecimal rentalIncome;
        private BigDecimal capitalGainsIncome;
        private BigDecimal businessIncome;
        private BigDecimal deductions80C;
        private BigDecimal deductions80D;
        private BigDecimal homeLoanInterest;
        private BigDecimal otherDeductions;
        private BigDecimal totalTdsDeducted;
        private BigDecimal tcsAmount;
        private BigDecimal advanceTaxPaid;
        private BigDecimal selfAssessmentTaxPaid;

        public String getAssessmentYear() { return assessmentYear; }
        public void setAssessmentYear(String assessmentYear) { this.assessmentYear = assessmentYear; }

        public String getFinancialYear() { return financialYear; }
        public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }

        public String getTaxRegime() { return taxRegime; }
        public void setTaxRegime(String taxRegime) { this.taxRegime = taxRegime; }

        public BigDecimal getSalaryIncome() { return salaryIncome != null ? salaryIncome : BigDecimal.ZERO; }
        public void setSalaryIncome(BigDecimal salaryIncome) { this.salaryIncome = salaryIncome; }

        public BigDecimal getOtherIncome() { return otherIncome != null ? otherIncome : BigDecimal.ZERO; }
        public void setOtherIncome(BigDecimal otherIncome) { this.otherIncome = otherIncome; }

        public BigDecimal getInterestIncome() { return interestIncome != null ? interestIncome : BigDecimal.ZERO; }
        public void setInterestIncome(BigDecimal interestIncome) { this.interestIncome = interestIncome; }

        public BigDecimal getRentalIncome() { return rentalIncome != null ? rentalIncome : BigDecimal.ZERO; }
        public void setRentalIncome(BigDecimal rentalIncome) { this.rentalIncome = rentalIncome; }

        public BigDecimal getCapitalGainsIncome() { return capitalGainsIncome != null ? capitalGainsIncome : BigDecimal.ZERO; }
        public void setCapitalGainsIncome(BigDecimal capitalGainsIncome) { this.capitalGainsIncome = capitalGainsIncome; }

        public BigDecimal getBusinessIncome() { return businessIncome != null ? businessIncome : BigDecimal.ZERO; }
        public void setBusinessIncome(BigDecimal businessIncome) { this.businessIncome = businessIncome; }

        public BigDecimal getDeductions80C() { return deductions80C != null ? deductions80C : BigDecimal.ZERO; }
        public void setDeductions80C(BigDecimal deductions80C) { this.deductions80C = deductions80C; }

        public BigDecimal getDeductions80D() { return deductions80D != null ? deductions80D : BigDecimal.ZERO; }
        public void setDeductions80D(BigDecimal deductions80D) { this.deductions80D = deductions80D; }

        public BigDecimal getHomeLoanInterest() { return homeLoanInterest != null ? homeLoanInterest : BigDecimal.ZERO; }
        public void setHomeLoanInterest(BigDecimal homeLoanInterest) { this.homeLoanInterest = homeLoanInterest; }

        public BigDecimal getOtherDeductions() { return otherDeductions != null ? otherDeductions : BigDecimal.ZERO; }
        public void setOtherDeductions(BigDecimal otherDeductions) { this.otherDeductions = otherDeductions; }

        public BigDecimal getTotalTdsDeducted() { return totalTdsDeducted != null ? totalTdsDeducted : BigDecimal.ZERO; }
        public void setTotalTdsDeducted(BigDecimal totalTdsDeducted) { this.totalTdsDeducted = totalTdsDeducted; }

        public BigDecimal getTcsAmount() { return tcsAmount != null ? tcsAmount : BigDecimal.ZERO; }
        public void setTcsAmount(BigDecimal tcsAmount) { this.tcsAmount = tcsAmount; }

        public BigDecimal getAdvanceTaxPaid() { return advanceTaxPaid != null ? advanceTaxPaid : BigDecimal.ZERO; }
        public void setAdvanceTaxPaid(BigDecimal advanceTaxPaid) { this.advanceTaxPaid = advanceTaxPaid; }

        public BigDecimal getSelfAssessmentTaxPaid() { return selfAssessmentTaxPaid != null ? selfAssessmentTaxPaid : BigDecimal.ZERO; }
        public void setSelfAssessmentTaxPaid(BigDecimal selfAssessmentTaxPaid) { this.selfAssessmentTaxPaid = selfAssessmentTaxPaid; }
    }

    public static class TaxCalculationResponse {
        private BigDecimal grossTotalIncome;
        private BigDecimal totalDeductions;
        private BigDecimal taxableIncome;
        private BigDecimal standardDeduction;
        private BigDecimal slabTax;
        private BigDecimal rebate87A;
        private BigDecimal cess;
        private BigDecimal estimatedTaxLiability;
        private BigDecimal totalTaxCredits;
        private BigDecimal estimatedRefund;
        private BigDecimal estimatedTaxPayable;
        private boolean isAdditionalTaxPayable;
        private BigDecimal serviceFee;
        private BigDecimal gstAmount;
        private BigDecimal totalPayableFee;
        private String disclaimer;

        public BigDecimal getGrossTotalIncome() { return grossTotalIncome; }
        public void setGrossTotalIncome(BigDecimal grossTotalIncome) { this.grossTotalIncome = grossTotalIncome; }

        public BigDecimal getTotalDeductions() { return totalDeductions; }
        public void setTotalDeductions(BigDecimal totalDeductions) { this.totalDeductions = totalDeductions; }

        public BigDecimal getTaxableIncome() { return taxableIncome; }
        public void setTaxableIncome(BigDecimal taxableIncome) { this.taxableIncome = taxableIncome; }

        public BigDecimal getStandardDeduction() { return standardDeduction; }
        public void setStandardDeduction(BigDecimal standardDeduction) { this.standardDeduction = standardDeduction; }

        public BigDecimal getSlabTax() { return slabTax; }
        public void setSlabTax(BigDecimal slabTax) { this.slabTax = slabTax; }

        public BigDecimal getRebate87A() { return rebate87A; }
        public void setRebate87A(BigDecimal rebate87A) { this.rebate87A = rebate87A; }

        public BigDecimal getCess() { return cess; }
        public void setCess(BigDecimal cess) { this.cess = cess; }

        public BigDecimal getEstimatedTaxLiability() { return estimatedTaxLiability; }
        public void setEstimatedTaxLiability(BigDecimal estimatedTaxLiability) { this.estimatedTaxLiability = estimatedTaxLiability; }

        public BigDecimal getTotalTaxCredits() { return totalTaxCredits; }
        public void setTotalTaxCredits(BigDecimal totalTaxCredits) { this.totalTaxCredits = totalTaxCredits; }

        public BigDecimal getEstimatedRefund() { return estimatedRefund; }
        public void setEstimatedRefund(BigDecimal estimatedRefund) { this.estimatedRefund = estimatedRefund; }

        public BigDecimal getEstimatedTaxPayable() { return estimatedTaxPayable; }
        public void setEstimatedTaxPayable(BigDecimal estimatedTaxPayable) { this.estimatedTaxPayable = estimatedTaxPayable; }

        public boolean isAdditionalTaxPayable() { return isAdditionalTaxPayable; }
        public void setAdditionalTaxPayable(boolean additionalTaxPayable) { isAdditionalTaxPayable = additionalTaxPayable; }

        public BigDecimal getServiceFee() { return serviceFee; }
        public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }

        public BigDecimal getGstAmount() { return gstAmount; }
        public void setGstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; }

        public BigDecimal getTotalPayableFee() { return totalPayableFee; }
        public void setTotalPayableFee(BigDecimal totalPayableFee) { this.totalPayableFee = totalPayableFee; }

        public String getDisclaimer() { return disclaimer; }
        public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
    }

    public static class CreateApplicationRequest {
        private String applicationId;
        private String fullName;
        private String pan;
        private String aadhaar;
        private String dob;
        private String mobileNumber;
        private String email;
        private String address;
        private String city;
        private String state;
        private String pinCode;

        private String accountHolderName;
        private String accountNumber;
        private String ifscCode;
        private String bankName;
        private String branchName;
        private String accountType;

        private String assessmentYear;
        private String financialYear;
        private String taxRegime;

        private BigDecimal salaryIncome;
        private BigDecimal otherIncome;
        private BigDecimal interestIncome;
        private BigDecimal rentalIncome;
        private BigDecimal capitalGainsIncome;
        private BigDecimal businessIncome;

        private BigDecimal totalTdsDeducted;
        private BigDecimal tcsAmount;
        private BigDecimal advanceTaxPaid;
        private BigDecimal selfAssessmentTaxPaid;
        private BigDecimal carryForwardLoss;

        private BigDecimal deductions80C;
        private BigDecimal deductions80D;
        private BigDecimal homeLoanInterest;
        private BigDecimal otherDeductions;

        private BigDecimal grossTotalIncome;
        private BigDecimal totalDeductions;
        private BigDecimal taxableIncome;
        private BigDecimal estimatedTaxLiability;
        private BigDecimal totalTaxCredits;
        private BigDecimal estimatedRefund;
        private Boolean isAdditionalTaxPayable;

        private String documentsJson;

        public String getApplicationId() { return applicationId; }
        public void setApplicationId(String applicationId) { this.applicationId = applicationId; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getPan() { return pan; }
        public void setPan(String pan) { this.pan = pan; }

        public String getAadhaar() { return aadhaar; }
        public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }

        public String getDob() { return dob; }
        public void setDob(String dob) { this.dob = dob; }

        public String getMobileNumber() { return mobileNumber; }
        public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getPinCode() { return pinCode; }
        public void setPinCode(String pinCode) { this.pinCode = pinCode; }

        public String getAccountHolderName() { return accountHolderName; }
        public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }

        public String getAccountNumber() { return accountNumber; }
        public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

        public String getIfscCode() { return ifscCode; }
        public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }

        public String getBankName() { return bankName; }
        public void setBankName(String bankName) { this.bankName = bankName; }

        public String getBranchName() { return branchName; }
        public void setBranchName(String branchName) { this.branchName = branchName; }

        public String getAccountType() { return accountType; }
        public void setAccountType(String accountType) { this.accountType = accountType; }

        public String getAssessmentYear() { return assessmentYear; }
        public void setAssessmentYear(String assessmentYear) { this.assessmentYear = assessmentYear; }

        public String getFinancialYear() { return financialYear; }
        public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }

        public String getTaxRegime() { return taxRegime; }
        public void setTaxRegime(String taxRegime) { this.taxRegime = taxRegime; }

        public BigDecimal getSalaryIncome() { return salaryIncome; }
        public void setSalaryIncome(BigDecimal salaryIncome) { this.salaryIncome = salaryIncome; }

        public BigDecimal getOtherIncome() { return otherIncome; }
        public void setOtherIncome(BigDecimal otherIncome) { this.otherIncome = otherIncome; }

        public BigDecimal getInterestIncome() { return interestIncome; }
        public void setInterestIncome(BigDecimal interestIncome) { this.interestIncome = interestIncome; }

        public BigDecimal getRentalIncome() { return rentalIncome; }
        public void setRentalIncome(BigDecimal rentalIncome) { this.rentalIncome = rentalIncome; }

        public BigDecimal getCapitalGainsIncome() { return capitalGainsIncome; }
        public void setCapitalGainsIncome(BigDecimal capitalGainsIncome) { this.capitalGainsIncome = capitalGainsIncome; }

        public BigDecimal getBusinessIncome() { return businessIncome; }
        public void setBusinessIncome(BigDecimal businessIncome) { this.businessIncome = businessIncome; }

        public BigDecimal getTotalTdsDeducted() { return totalTdsDeducted; }
        public void setTotalTdsDeducted(BigDecimal totalTdsDeducted) { this.totalTdsDeducted = totalTdsDeducted; }

        public BigDecimal getTcsAmount() { return tcsAmount; }
        public void setTcsAmount(BigDecimal tcsAmount) { this.tcsAmount = tcsAmount; }

        public BigDecimal getAdvanceTaxPaid() { return advanceTaxPaid; }
        public void setAdvanceTaxPaid(BigDecimal advanceTaxPaid) { this.advanceTaxPaid = advanceTaxPaid; }

        public BigDecimal getSelfAssessmentTaxPaid() { return selfAssessmentTaxPaid; }
        public void setSelfAssessmentTaxPaid(BigDecimal selfAssessmentTaxPaid) { this.selfAssessmentTaxPaid = selfAssessmentTaxPaid; }

        public BigDecimal getCarryForwardLoss() { return carryForwardLoss; }
        public void setCarryForwardLoss(BigDecimal carryForwardLoss) { this.carryForwardLoss = carryForwardLoss; }

        public BigDecimal getDeductions80C() { return deductions80C; }
        public void setDeductions80C(BigDecimal deductions80C) { this.deductions80C = deductions80C; }

        public BigDecimal getDeductions80D() { return deductions80D; }
        public void setDeductions80D(BigDecimal deductions80D) { this.deductions80D = deductions80D; }

        public BigDecimal getHomeLoanInterest() { return homeLoanInterest; }
        public void setHomeLoanInterest(BigDecimal homeLoanInterest) { this.homeLoanInterest = homeLoanInterest; }

        public BigDecimal getOtherDeductions() { return otherDeductions; }
        public void setOtherDeductions(BigDecimal otherDeductions) { this.otherDeductions = otherDeductions; }

        public BigDecimal getGrossTotalIncome() { return grossTotalIncome; }
        public void setGrossTotalIncome(BigDecimal grossTotalIncome) { this.grossTotalIncome = grossTotalIncome; }

        public BigDecimal getTotalDeductions() { return totalDeductions; }
        public void setTotalDeductions(BigDecimal totalDeductions) { this.totalDeductions = totalDeductions; }

        public BigDecimal getTaxableIncome() { return taxableIncome; }
        public void setTaxableIncome(BigDecimal taxableIncome) { this.taxableIncome = taxableIncome; }

        public BigDecimal getEstimatedTaxLiability() { return estimatedTaxLiability; }
        public void setEstimatedTaxLiability(BigDecimal estimatedTaxLiability) { this.estimatedTaxLiability = estimatedTaxLiability; }

        public BigDecimal getTotalTaxCredits() { return totalTaxCredits; }
        public void setTotalTaxCredits(BigDecimal totalTaxCredits) { this.totalTaxCredits = totalTaxCredits; }

        public BigDecimal getEstimatedRefund() { return estimatedRefund; }
        public void setEstimatedRefund(BigDecimal estimatedRefund) { this.estimatedRefund = estimatedRefund; }

        public Boolean getIsAdditionalTaxPayable() { return isAdditionalTaxPayable; }
        public void setIsAdditionalTaxPayable(Boolean isAdditionalTaxPayable) { this.isAdditionalTaxPayable = isAdditionalTaxPayable; }

        public String getDocumentsJson() { return documentsJson; }
        public void setDocumentsJson(String documentsJson) { this.documentsJson = documentsJson; }
    }

    public static class PaymentRequest {
        private String applicationId;
        private String paymentMethod;
        private String paymentId;
        private BigDecimal amount;

        public String getApplicationId() { return applicationId; }
        public void setApplicationId(String applicationId) { this.applicationId = applicationId; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }

    public static class ApplicationResponse {
        private String applicationId;
        private String fullName;
        private String pan;
        private String mobileNumber;
        private String email;
        private String bankName;
        private String maskedAccountNumber;
        private String assessmentYear;
        private BigDecimal grossTotalIncome;
        private BigDecimal taxableIncome;
        private BigDecimal estimatedTaxLiability;
        private BigDecimal totalTaxCredits;
        private BigDecimal estimatedRefund;
        private Boolean isAdditionalTaxPayable;
        private TdsRefundStatus status;
        private Boolean isPaid;
        private String paymentId;
        private BigDecimal totalPaid;
        private LocalDateTime createdAt;
        private LocalDateTime paidAt;

        public String getApplicationId() { return applicationId; }
        public void setApplicationId(String applicationId) { this.applicationId = applicationId; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getPan() { return pan; }
        public void setPan(String pan) { this.pan = pan; }

        public String getMobileNumber() { return mobileNumber; }
        public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getBankName() { return bankName; }
        public void setBankName(String bankName) { this.bankName = bankName; }

        public String getMaskedAccountNumber() { return maskedAccountNumber; }
        public void setMaskedAccountNumber(String maskedAccountNumber) { this.maskedAccountNumber = maskedAccountNumber; }

        public String getAssessmentYear() { return assessmentYear; }
        public void setAssessmentYear(String assessmentYear) { this.assessmentYear = assessmentYear; }

        public BigDecimal getGrossTotalIncome() { return grossTotalIncome; }
        public void setGrossTotalIncome(BigDecimal grossTotalIncome) { this.grossTotalIncome = grossTotalIncome; }

        public BigDecimal getTaxableIncome() { return taxableIncome; }
        public void setTaxableIncome(BigDecimal taxableIncome) { this.taxableIncome = taxableIncome; }

        public BigDecimal getEstimatedTaxLiability() { return estimatedTaxLiability; }
        public void setEstimatedTaxLiability(BigDecimal estimatedTaxLiability) { this.estimatedTaxLiability = estimatedTaxLiability; }

        public BigDecimal getTotalTaxCredits() { return totalTaxCredits; }
        public void setTotalTaxCredits(BigDecimal totalTaxCredits) { this.totalTaxCredits = totalTaxCredits; }

        public BigDecimal getEstimatedRefund() { return estimatedRefund; }
        public void setEstimatedRefund(BigDecimal estimatedRefund) { this.estimatedRefund = estimatedRefund; }

        public Boolean getIsAdditionalTaxPayable() { return isAdditionalTaxPayable; }
        public void setIsAdditionalTaxPayable(Boolean isAdditionalTaxPayable) { this.isAdditionalTaxPayable = isAdditionalTaxPayable; }

        public TdsRefundStatus getStatus() { return status; }
        public void setStatus(TdsRefundStatus status) { this.status = status; }

        public Boolean getIsPaid() { return isPaid; }
        public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

        public BigDecimal getTotalPaid() { return totalPaid; }
        public void setTotalPaid(BigDecimal totalPaid) { this.totalPaid = totalPaid; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getPaidAt() { return paidAt; }
        public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    }
}
