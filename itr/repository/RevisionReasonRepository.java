package com.taxedge.itr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.entity.RevisionReasonEntity;

@Repository
public interface RevisionReasonRepository
        extends JpaRepository<RevisionReasonEntity, String> {

}