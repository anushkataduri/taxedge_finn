package com.taxedge.gst.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.GstFiling;

public interface GstFilingRepository extends JpaRepository<GstFiling, String> {

    List<GstFiling> findByGstId(String gstId);
}