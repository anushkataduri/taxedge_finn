package com.taxedge.itr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.entity.ItrDocument;
import com.taxedge.itr.enums.ItrDocumentType;

@Repository
public interface ItrDocumentRepository extends JpaRepository<ItrDocument, String> {
	
	boolean existsByItrFilingItrIdAndDocumentType(
            String itrId,
            ItrDocumentType documentType);
	
	List<ItrDocument> findByItrFilingItrId(String itrId);
}