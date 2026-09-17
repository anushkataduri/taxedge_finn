package com.taxedge.gst.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.Documents;
import com.taxedge.gst.enums.DocumentType;

public interface DocumentsRepository extends JpaRepository<Documents, Long> {

    List<Documents> findByGstId(String gstId);

    Optional<Documents> findByGstIdAndDocumentType( String gstId,DocumentType documentType);

    boolean existsByGstIdAndDocumentType( String gstId,DocumentType documentType);

    long countByGstId(String gstId);
}