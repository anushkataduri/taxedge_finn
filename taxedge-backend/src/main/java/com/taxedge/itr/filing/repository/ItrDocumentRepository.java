package com.taxedge.itr.filing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.filing.entity.ItrDocument;

@Repository
public interface ItrDocumentRepository extends JpaRepository<ItrDocument, String> {

	List<ItrDocument> findByItrFilingItrId(String itrId);
}
