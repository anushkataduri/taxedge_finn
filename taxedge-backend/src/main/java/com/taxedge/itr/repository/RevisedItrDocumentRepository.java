package com.taxedge.itr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.entity.RevisedItrDocument;
import com.taxedge.itr.enums.RevisedItrDocumentType;

@Repository
public interface RevisedItrDocumentRepository extends JpaRepository<RevisedItrDocument, String> {

	boolean existsByRevisedItrIdAndDocumentType(String revisedItrId, RevisedItrDocumentType documentType);

	List<RevisedItrDocument> findByRevisedItrId(String revisedItrId);
}