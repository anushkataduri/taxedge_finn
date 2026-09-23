package com.taxedge.itr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "revised_itr_details")
@Data
public class RevisedItrDetails {

    @Id
    @Column(name = "details_id", nullable = false, unique = true)
    private String detailsId;

    @Column(name = "salary_business_income", nullable = false)
    private Double salaryBusinessIncome;

    @Column(name = "other_income", nullable = false)
    private Double otherIncome;

    @Column(name = "taxable_income", nullable = false)
    private Double taxableIncome;
}