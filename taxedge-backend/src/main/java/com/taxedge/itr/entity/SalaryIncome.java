package com.taxedge.itr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "salary_income")
@Data
public class SalaryIncome {

    @Id
    @Column(name = "income_id", nullable = false, unique = true)
    private String incomeId;

    @OneToOne
    @JoinColumn(name = "itr_id", nullable = false)
    private ItrFiling itrFiling;
    
    @Column(name = "income_source", nullable = false)
    private String incomeSource;
    
    @Column(name = "employer_legal_name", nullable = false)
    private String employerLegalName;

    @Column(name = "gross_salary", nullable = false)
    private Double grossSalary;

    @Column(name = "exempt_allowances", nullable = false)
    private Double exemptAllowances;

    @Column(name = "tds_deducted_by_employer", nullable = false)
    private Double tdsDeductedByEmployer;
}