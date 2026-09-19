//package com.taxedge.gst.repository;
//
//import java.util.List;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.taxedge.gst.entity.GstCompliance;
//
//public interface GstComplianceRepository extends JpaRepository<GstCompliance, String> {
//
//    List<GstCompliance> findByGstId(String gstId);
//}

package com.taxedge.gst.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.gst.entity.GstCompliance;

public interface GstComplianceRepository extends JpaRepository<GstCompliance, String> {

    List<GstCompliance> findByGstin(String gstin);

    Optional<GstCompliance> findByIdAndGstin(String id, String gstin);
}