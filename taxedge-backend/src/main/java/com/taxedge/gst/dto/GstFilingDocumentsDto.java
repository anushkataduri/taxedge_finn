package com.taxedge.gst.dto;

import com.taxedge.gst.enums.GstFilingDocumentType;

import lombok.Data;

@Data
public class GstFilingDocumentsDto {

    private String filingId;
    private GstFilingDocumentType documentType;
    private String fileName;
    private String fileType;
}