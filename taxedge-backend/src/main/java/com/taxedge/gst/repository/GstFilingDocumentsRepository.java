package com.taxedge.gst.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.GstFilingDocuments;

public interface GstFilingDocumentsRepository extends JpaRepository<GstFilingDocuments, String> {

	Optional<GstFilingDocuments> findByGstFiling_GstfilingId(String gstfilingId);
}