package com.taxedge.gst.dto;

import com.taxedge.gst.enums.PrincipalPlaceAddressType;

import lombok.Data;

@Data
public class DocumentsDto {

    private String gstId;

    private String panCard;

    private String aadhaarCard;

    private String businessRegistrationProof;

    private PrincipalPlaceAddressType principalPlaceAddressType;

    private String principalPlaceAddressProof;

    private String bankPassbookOrCancelledCheque;

    private String passportSizePhotograph;
}