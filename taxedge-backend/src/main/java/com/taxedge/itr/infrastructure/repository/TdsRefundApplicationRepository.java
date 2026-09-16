package com.taxedge.itr.infrastructure.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.domain.model.TdsRefundApplication;

@Repository
public interface TdsRefundApplicationRepository extends JpaRepository<TdsRefundApplication, Long> {
    Optional<TdsRefundApplication> findByApplicationId(String applicationId);
    Optional<TdsRefundApplication> findByPan(String pan);
    Optional<TdsRefundApplication> findByMobileNumber(String mobileNumber);
}
