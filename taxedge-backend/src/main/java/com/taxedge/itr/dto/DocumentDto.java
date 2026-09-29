package com.taxedge.itr.dto;

import com.taxedge.itr.enums.ItrDocumentType;

import lombok.Data;

@Data
public class DocumentDto {

    private ItrDocumentType documentType;

    private String fileName;

    private String fileType;

    private String imageData;
}