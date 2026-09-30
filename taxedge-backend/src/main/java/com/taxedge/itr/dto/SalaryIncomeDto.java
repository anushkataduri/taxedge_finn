package com.taxedge.itr.dto;

import lombok.Data;

@Data
public class SalaryIncomeDto {
	private String incomeSource;
    private String employerLegalName;
    private Double grossSalary;
    private Double exemptAllowances;
    private Double tdsDeductedByEmployer;
}