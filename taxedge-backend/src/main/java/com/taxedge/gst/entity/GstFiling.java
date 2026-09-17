package com.taxedge.gst.entity;

import java.time.LocalDateTime;

import com.taxedge.gst.enums.FilingFrequency;
import com.taxedge.gst.enums.FilingType;
import com.taxedge.gst.enums.ReturnType;
import com.taxedge.gst.enums.TaxCalculationMethod;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gst_filing")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GstFiling {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
	
	@Id
	@Column(name = "id", nullable = false, unique = true, length = 9)
	private String id;

    @Column(name = "gst_id", nullable = false, length = 15)
    private String gstId;

    @Column(name = "financial_year", nullable = false, length = 7)
    private String financialYear;

    @Column(name = "filing_period", nullable = false, length = 30)
    private String filingPeriod;

    @Enumerated(EnumType.STRING)
    @Column(name = "filing_frequency", nullable = false, length = 30)
    private FilingFrequency filingFrequency;

    @Enumerated(EnumType.STRING)
    @Column(name = "return_type", nullable = false, length = 20)
    private ReturnType returnType;

    @Enumerated(EnumType.STRING)
    @Column(name = "filing_type", nullable = false, length = 20)
    private FilingType filingType;

    @Enumerated(EnumType.STRING)
    @Column(name = "tax_calculation_method", length = 40)
    private TaxCalculationMethod taxCalculationMethod;

    @Column(name = "estimated_taxable_sales")
    private Long estimatedTaxableSales;

    @Column(name = "estimated_taxable_purchases")
    private Long estimatedTaxablePurchases;

    @Column(name = "estimated_eligible_itc")
    private Long estimatedEligibleItc;

    @Column(name = "created_at",nullable = false, insertable = false,
    	    updatable = false
    	)
    	private LocalDateTime createdAt;
}