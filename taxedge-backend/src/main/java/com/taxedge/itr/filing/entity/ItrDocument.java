package com.taxedge.itr.filing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "itr_document")
@Data
public class ItrDocument {

    @Id
    @Column(name = "document_id", nullable = false, unique = true)
    private String documentId;

    @ManyToOne
    @JoinColumn(name = "itr_id", nullable = false)
    private ItrFiling itrFiling;

    @Column(name = "form_16_part_a_part_b", columnDefinition = "TEXT")
    private String form16PartAPartB;

    @Column(name = "form_26as", columnDefinition = "TEXT")
    private String form26as;

    @Column(name = "ais_tis", columnDefinition = "TEXT")
    private String aisTis;

    @Column(name = "bank_account_statement", columnDefinition = "TEXT")
    private String bankAccountStatement;

    @Column(name = "salary_payslips", columnDefinition = "TEXT")
    private String salaryPayslips;
}
