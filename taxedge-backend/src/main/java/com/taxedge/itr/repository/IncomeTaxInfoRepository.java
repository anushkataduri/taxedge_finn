package com.taxedge.itr.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.itr.entity.IncomeTaxInfo;

public interface IncomeTaxInfoRepository extends JpaRepository<IncomeTaxInfo, Long> {
}