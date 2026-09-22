package com.taxedge.gst.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.taxedge.gst.enums.AmendmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PrincipalPlaceAmendmentViewDto {

    private String gstId;

    // Current GST Registration Details
    private String currentBusinessAddress;
    private String currentCity;
    private String currentDistrict;
    private String currentState;
    private String currentPinCode;

    // New Proposed Amendment Details (if pending)
    private String newBusinessAddress;
    private String newCity;
    private String newDistrict;
    private String newState;
    private String newPinCode;

    private String fileName;
    private AmendmentStatus status;
    private LocalDateTime requestedAt;
}
