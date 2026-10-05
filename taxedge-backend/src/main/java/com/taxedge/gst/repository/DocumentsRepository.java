package com.taxedge.gst.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.Documents;

public interface DocumentsRepository extends JpaRepository<Documents, String> {

	Optional<Documents> findByDocumentId(String documentId);

	Optional<Documents> findByBusiness_GstId(String gstId);
}