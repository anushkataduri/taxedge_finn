package com.taxedge.itr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.itr.dto.IncomeTaxInfoDto;
import com.taxedge.itr.entity.IncomeTaxInfo;
import com.taxedge.itr.repository.IncomeTaxInfoRepository;

@Service
public class IncomeTaxInfoServiceImpl implements IncomeTaxInfoService {

    @Autowired
    private IncomeTaxInfoRepository repository;

    @Override
    @Transactional
    public String saveIncomeTaxInfo(IncomeTaxInfoDto dto) {

        IncomeTaxInfo entity = IncomeTaxInfo.builder()
                .salaryIncome(dto.getSalaryIncome())
                .otherIncome(dto.getOtherIncome())
                .interestIncome(dto.getInterestIncome())
                .rentalIncome(dto.getRentalIncome())
                .municipalTaxesPaid(dto.getMunicipalTaxesPaid())
                .shortTermCapitalGains(dto.getShortTermCapitalGains())
                .longTermCapitalGains(dto.getLongTermCapitalGains())
                .grossTurnover(dto.getGrossTurnover())
                .netBusinessProfit(dto.getNetBusinessProfit())
                .homeLoanInterestSec24b(dto.getHomeLoanInterestSec24b())
                .deductions80C(dto.getDeductions80C())
                .deductions80D(dto.getDeductions80D())
                .build();

        IncomeTaxInfo saved = repository.save(entity);

        return "Income and tax information saved successfully. ID: " + saved.getId();
    }

    @Override
    @Transactional
    public String updateIncomeTaxInfo(Long id, IncomeTaxInfoDto dto) {

        IncomeTaxInfo existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income tax info not found"));

        IncomeTaxInfo updated = IncomeTaxInfo.builder()
                .id(existing.getId())                                   // same id -> UPDATE
                .createdAt(existing.getCreatedAt())                     // keep original timestamp
                .refundBankAccount(existing.getRefundBankAccount())     // keep existing link
                .salaryIncome(dto.getSalaryIncome())
                .otherIncome(dto.getOtherIncome())
                .interestIncome(dto.getInterestIncome())
                .rentalIncome(dto.getRentalIncome())
                .municipalTaxesPaid(dto.getMunicipalTaxesPaid())
                .shortTermCapitalGains(dto.getShortTermCapitalGains())
                .longTermCapitalGains(dto.getLongTermCapitalGains())
                .grossTurnover(dto.getGrossTurnover())
                .netBusinessProfit(dto.getNetBusinessProfit())
                .homeLoanInterestSec24b(dto.getHomeLoanInterestSec24b())
                .deductions80C(dto.getDeductions80C())
                .deductions80D(dto.getDeductions80D())
                .build();

        repository.save(updated);

        return "Income and tax information updated successfully";
    }
}