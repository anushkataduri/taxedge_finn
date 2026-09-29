package com.taxedge.gst.dto;

import com.taxedge.gst.enums.FilingFrequency;
import com.taxedge.gst.enums.FilingType;
import com.taxedge.gst.enums.ReturnType;
import com.taxedge.gst.enums.TaxCalculationMethod;

import lombok.Data;

@Data
public class GstFilingDto {

    private String gstin;

    private String financialYear;

    private String filingPeriod;

    private FilingFrequency filingFrequency;

    private ReturnType returnType;

    private FilingType filingType;

    private TaxCalculationMethod taxCalculationMethod;

    private Long estimatedTaxableSales;

    private Long estimatedTaxablePurchases;

    private Long estimatedEligibleItc;
}