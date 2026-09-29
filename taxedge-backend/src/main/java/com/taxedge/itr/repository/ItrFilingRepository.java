package com.taxedge.itr.repository;

import com.taxedge.itr.entity.ItrFiling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItrFilingRepository extends JpaRepository<ItrFiling, String> {
}