package com.taxedge.gst.repository;

import com.taxedge.gst.entity.SignatoryAmendmentEntity;
import com.taxedge.gst.enums.AmendmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SignatoryAmendmentRepository extends JpaRepository<SignatoryAmendmentEntity, Long> {

    Optional<SignatoryAmendmentEntity> findByGstIdAndStatus(String gstId, AmendmentStatus status);
}
