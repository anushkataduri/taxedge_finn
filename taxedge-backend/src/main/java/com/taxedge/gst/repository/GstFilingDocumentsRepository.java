package com.taxedge.gst.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.GstFilingDocuments;
import com.taxedge.gst.enums.GstFilingDocumentType;

public interface GstFilingDocumentsRepository
            extends JpaRepository<GstFilingDocuments, Long> {

     List<GstFilingDocuments> findByFilingId(String filingId);

     Optional<GstFilingDocuments> findByFilingIdAndDocumentType(
        String filingId,
       GstFilingDocumentType documentType);

     boolean existsByFilingIdAndDocumentType(
        String filingId,
       GstFilingDocumentType documentType);
}