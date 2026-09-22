package com.taxedge.itr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taxedge.itr.entity.SalaryIncome;

@Repository
public interface SalaryIncomeRepository extends JpaRepository<SalaryIncome, String> {
}