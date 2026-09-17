package com.taxedge.gst.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.GstCompliance;

public interface GstComplianceRepository extends JpaRepository<GstCompliance, Long> {

    List<GstCompliance> findByGstId(String gstId);
}