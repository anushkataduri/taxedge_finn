package com.taxedge.gst.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.taxedge.gst.enums.AmendmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SignatoryAmendmentViewDto {
    private String gstId;
    private String currentSignatoryName;
    private String currentSignatoryPan;
    private LocalDate currentSignatoryDob;
    private String currentDesignation;
    private String currentSignatoryMobile;
    private String currentSignatoryEmail;

    private String newSignatoryName;
    private String newSignatoryPan;
    private LocalDate newSignatoryDob;
    private String newDesignation;
    private String newSignatoryMobile;
    private String newSignatoryEmail;
    private String fileName;
    private AmendmentStatus status;
    private LocalDateTime requestedAt;
}
