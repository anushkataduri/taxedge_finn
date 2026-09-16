package com.taxedge.itr.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "tds_refund_applications")
public class TdsRefundApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", unique = true, nullable = false, length = 50)
    private String applicationId;

    // Personal Details
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "pan", nullable = false, length = 10)
    private String pan;

    @Column(name = "aadhaar", length = 12)
    private String aadhaar;

    @Column(name = "dob")
    private String dob;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "pin_code", length = 10)
    private String pinCode;

    // Bank Details
    @Column(name = "account_holder_name")
    private String accountHolderName;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "ifsc_code", length = 15)
    private String ifscCode;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "account_type", length = 20)
    private String accountType;

    // Income & Tax details
    @Column(name = "assessment_year", length = 20)
    private String assessmentYear;

    @Column(name = "financial_year", length = 20)
    private String financialYear;

    @Column(name = "tax_regime", length = 20)
    private String taxRegime;

    @Column(name = "salary_income", precision = 12, scale = 2)
    private BigDecimal salaryIncome = BigDecimal.ZERO;

    @Column(name = "other_income", precision = 12, scale = 2)
    private BigDecimal otherIncome = BigDecimal.ZERO;

    @Column(name = "interest_income", precision = 12, scale = 2)
    private BigDecimal interestIncome = BigDecimal.ZERO;

    @Column(name = "rental_income", precision = 12, scale = 2)
    private BigDecimal rentalIncome = BigDecimal.ZERO;

    @Column(name = "capital_gains_income", precision = 12, scale = 2)
    private BigDecimal capitalGainsIncome = BigDecimal.ZERO;

    @Column(name = "business_income", precision = 12, scale = 2)
    private BigDecimal businessIncome = BigDecimal.ZERO;

    @Column(name = "total_tds_deducted", precision = 12, scale = 2)
    private BigDecimal totalTdsDeducted = BigDecimal.ZERO;

    @Column(name = "tcs_amount", precision = 12, scale = 2)
    private BigDecimal tcsAmount = BigDecimal.ZERO;

    @Column(name = "advance_tax_paid", precision = 12, scale = 2)
    private BigDecimal advanceTaxPaid = BigDecimal.ZERO;

    @Column(name = "self_assessment_tax_paid", precision = 12, scale = 2)
    private BigDecimal selfAssessmentTaxPaid = BigDecimal.ZERO;

    @Column(name = "carry_forward_loss", precision = 12, scale = 2)
    private BigDecimal carryForwardLoss = BigDecimal.ZERO;

    // Deductions
    @Column(name = "deductions_80c", precision = 12, scale = 2)
    private BigDecimal deductions80C = BigDecimal.ZERO;

    @Column(name = "deductions_80d", precision = 12, scale = 2)
    private BigDecimal deductions80D = BigDecimal.ZERO;

    @Column(name = "home_loan_interest", precision = 12, scale = 2)
    private BigDecimal homeLoanInterest = BigDecimal.ZERO;

    @Column(name = "other_deductions", precision = 12, scale = 2)
    private BigDecimal otherDeductions = BigDecimal.ZERO;

    // Calculation Results
    @Column(name = "gross_total_income", precision = 12, scale = 2)
    private BigDecimal grossTotalIncome = BigDecimal.ZERO;

    @Column(name = "total_deductions", precision = 12, scale = 2)
    private BigDecimal totalDeductions = BigDecimal.ZERO;

    @Column(name = "taxable_income", precision = 12, scale = 2)
    private BigDecimal taxableIncome = BigDecimal.ZERO;

    @Column(name = "estimated_tax_liability", precision = 12, scale = 2)
    private BigDecimal estimatedTaxLiability = BigDecimal.ZERO;

    @Column(name = "total_tax_credits", precision = 12, scale = 2)
    private BigDecimal totalTaxCredits = BigDecimal.ZERO;

    @Column(name = "estimated_refund", precision = 12, scale = 2)
    private BigDecimal estimatedRefund = BigDecimal.ZERO;

    @Column(name = "is_additional_tax_payable")
    private Boolean isAdditionalTaxPayable = false;

    // Document Metadata
    @Column(name = "documents_json", columnDefinition = "TEXT")
    private String documentsJson;

    // Payment details
    @Column(name = "payment_id", length = 100)
    private String paymentId;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "service_fee", precision = 10, scale = 2)
    private BigDecimal serviceFee = BigDecimal.ZERO;

    @Column(name = "gst_amount", precision = 10, scale = 2)
    private BigDecimal gstAmount = BigDecimal.ZERO;

    @Column(name = "total_paid", precision = 10, scale = 2)
    private BigDecimal totalPaid = BigDecimal.ZERO;

    @Column(name = "is_paid")
    private Boolean isPaid = false;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private TdsRefundStatus status = TdsRefundStatus.DRAFT;

    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getServiceFee() { return serviceFee; }
    public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }

    public BigDecimal getGstAmount() { return gstAmount; }
    public void setGstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; }

    public BigDecimal getTotalPaid() { return totalPaid; }
    public void setTotalPaid(BigDecimal totalPaid) { this.totalPaid = totalPaid; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public TdsRefundStatus getStatus() { return status; }
    public void setStatus(TdsRefundStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
