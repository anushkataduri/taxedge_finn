package com.taxedge.itr.filing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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

    @Lob
    @Column(name = "form_16_part_a_part_b", columnDefinition = "LONGTEXT")
    private String form16PartAPartB;

    @Lob
    @Column(name = "form_26as", columnDefinition = "LONGTEXT")
    private String form26as;

    @Lob
    @Column(name = "ais_tis", columnDefinition = "LONGTEXT")
    private String aisTis;

    @Lob
    @Column(name = "bank_account_statement", columnDefinition = "LONGTEXT")
    private String bankAccountStatement;

    @Lob
    @Column(name = "salary_payslips", columnDefinition = "LONGTEXT")
    private String salaryPayslips;
}
