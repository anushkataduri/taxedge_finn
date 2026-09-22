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
public class ContactAmendmentViewDto {
    private String gstId;
    private String currentMobileNumber;
    private String currentEmail;
    private String newMobileNumber;
    private String newEmail;
    private String fileName;
    private AmendmentStatus status;
    private LocalDateTime requestedAt;
}
