package com.taxedge.application.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.application.domain.model.ApplicationEntity;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, String> {

    List<ApplicationEntity> findAllByCustomerIdOrderByCreatedAtDesc(String customerId);

    List<ApplicationEntity> findAllByMobileNumberOrderByCreatedAtDesc(String mobileNumber);

    Optional<ApplicationEntity> findByIdAndCustomerId(String id, String customerId);

    Optional<ApplicationEntity> findByIdAndMobileNumber(String id, String mobileNumber);
}
