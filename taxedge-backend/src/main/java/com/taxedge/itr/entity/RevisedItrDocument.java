package com.taxedge.itr.entity;

import com.taxedge.itr.enums.RevisedItrDocumentType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "revised_itr_document")
@Data
public class RevisedItrDocument {

    @Id
    @Column(name = "document_id", nullable = false, unique = true)
    private String documentId;

    @Column(name = "revised_itr_id", nullable = false)
    private String revisedItrId;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private RevisedItrDocumentType documentType;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "image_data", columnDefinition = "TEXT")
    private String imageData;
}