package com.taxedge.itr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.entity.RevisedItr;

@Repository
public interface RevisedItrRepository extends JpaRepository<RevisedItr, String> {

}