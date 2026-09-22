package com.taxedge.gst.repository;

import com.taxedge.gst.entity.LegalNameAmendmentEntity;
import com.taxedge.gst.enums.AmendmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LegalNameAmendmentRepository extends JpaRepository<LegalNameAmendmentEntity, Long> {
    Optional<LegalNameAmendmentEntity> findByGstIdAndStatus(String gstId, AmendmentStatus status);
}
