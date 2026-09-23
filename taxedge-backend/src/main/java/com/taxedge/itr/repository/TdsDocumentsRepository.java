package com.taxedge.itr.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxedge.itr.entity.TdsDocuments;

public interface TdsDocumentsRepository extends JpaRepository<TdsDocuments, Long> {
}