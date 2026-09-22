package com.taxedge.gst.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "gst_cancellation")
@Data
public class GstCancellation {

    @Id
    @Column(name = "gstin", nullable = false, unique = true, length = 15)
    private String gstin;

    @Column(name = "reason_for_cancellation", nullable = false)
    private String reasonForCancellation;

    @Column(name = "date_cancellation_is_sought", nullable = false)
    private LocalDate dateCancellationIsSought;

    @Column(name = "closing_stock_and_input_tax_reversal", columnDefinition = "TEXT")
    private String closingStockAndInputTaxReversal;

    @Column(name = "pending_dues_liabilities", columnDefinition = "TEXT")
    private String pendingDuesLiabilities;

    @Column(name = "last_gstr3b_filed_arn_period")
    private String lastGstr3bFiledArnPeriod;

    @Column(name = "supporting_proof_document", columnDefinition = "TEXT")
    private String supportingProofDocument;
}
