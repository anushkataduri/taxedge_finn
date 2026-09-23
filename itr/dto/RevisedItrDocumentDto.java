package com.taxedge.itr.dto;

import com.taxedge.itr.enums.RevisedItrDocumentType;

import lombok.Data;

@Data
public class RevisedItrDocumentDto {

    private RevisedItrDocumentType documentType;

    private String fileName;

    private String fileType;

    private String imageData;
}