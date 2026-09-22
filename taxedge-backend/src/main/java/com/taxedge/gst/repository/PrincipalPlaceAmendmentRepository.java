package com.taxedge.gst.repository;

import com.taxedge.gst.entity.PrincipalPlaceAmendmentEntity;
import com.taxedge.gst.enums.AmendmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrincipalPlaceAmendmentRepository extends JpaRepository<PrincipalPlaceAmendmentEntity, Long> {

    Optional<PrincipalPlaceAmendmentEntity> findByGstIdAndStatus(String gstId, AmendmentStatus status);
}
