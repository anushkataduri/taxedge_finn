package com.taxedge.gst.repository;

import com.taxedge.gst.entity.ContactAmendmentEntity;
import com.taxedge.gst.enums.AmendmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactAmendmentRepository extends JpaRepository<ContactAmendmentEntity, Long> {
    Optional<ContactAmendmentEntity> findByGstIdAndStatus(String gstId, AmendmentStatus status);
}
