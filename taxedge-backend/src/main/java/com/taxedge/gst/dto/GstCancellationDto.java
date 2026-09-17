package com.taxedge.gst.dto;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class GstCancellationDto {

    private String gstId;
    private String reasonForCancellation;
    private LocalDate dateCancellationIsSought;
    private String closingStockAndInputTaxReversal;
    private String pendingDuesLiabilities;
    private String lastGstr3bFiledArnPeriod;
    private MultipartFile supportingProofDocument;
}