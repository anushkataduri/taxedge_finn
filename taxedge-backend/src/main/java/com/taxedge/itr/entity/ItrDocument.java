package com.taxedge.itr.entity;

import com.taxedge.itr.enums.ItrDocumentType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "itr_document")
@Data
public class ItrDocument {

    @Id
    @Column(name = "document_id", nullable = false, unique = true)
    private String documentId;

    @ManyToOne
    @JoinColumn(name = "itr_id", nullable = false)
    private ItrFiling itrFiling;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "image_data", columnDefinition = "TEXT")
    private String imageData;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private ItrDocumentType documentType;
}