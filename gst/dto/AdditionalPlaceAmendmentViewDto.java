package com.taxedge.gst.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.taxedge.gst.enums.AmendmentStatus;
import com.taxedge.gst.enums.NatureOfBusiness;
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
public class AdditionalPlaceAmendmentViewDto {
    private Long id;
    private String gstId;
    private String address;
    private String city;
    private String pinCode;
    private NatureOfBusiness natureOfBusiness;
    private String fileName;
    private AmendmentStatus status;
    private LocalDateTime requestedAt;
}
