package com.taxedge.itr.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.itr.entity.IncomeTaxInfo;

public interface IncomeTaxInfoRepository extends JpaRepository<IncomeTaxInfo, Long> {
	
	Optional<IncomeTaxInfo> findByRefundBankAccount_Id(String tdsRefundId);
}