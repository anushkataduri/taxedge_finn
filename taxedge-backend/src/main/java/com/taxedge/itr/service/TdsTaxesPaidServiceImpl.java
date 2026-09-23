package com.taxedge.itr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.itr.dto.TdsTaxesPaidDto;
import com.taxedge.itr.entity.RefundBankAccount;
import com.taxedge.itr.entity.TdsTaxesPaid;
import com.taxedge.itr.repository.RefundBankAccountRepository;
import com.taxedge.itr.repository.TdsTaxesPaidRepository;
@Service
public class TdsTaxesPaidServiceImpl implements TdsTaxesPaidService {

    @Autowired
    private TdsTaxesPaidRepository repository;

    @Autowired
    private RefundBankAccountRepository bankAccountRepository;

    @Override
    @Transactional
    public String saveTaxesPaid(TdsTaxesPaidDto dto) {

        TdsTaxesPaid entity = TdsTaxesPaid.builder()
                .totalTdsDeducted(dto.getTotalTdsDeducted())
                .tcsAmount(dto.getTcsAmount())
                .advanceTax(dto.getAdvanceTax())
                .selfAssessmentTax(dto.getSelfAssessmentTax())
                .build();

        TdsTaxesPaid saved = repository.save(entity);

        return "Taxes paid saved successfully. ID: " + saved.getId();
    }

    @Override
    @Transactional
    public String updateTaxesPaid(Long id, TdsTaxesPaidDto dto) {

        TdsTaxesPaid existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("TDS record not found"));

        if (dto.getTotalTdsDeducted() != null) existing.setTotalTdsDeducted(dto.getTotalTdsDeducted());
        if (dto.getTcsAmount() != null) existing.setTcsAmount(dto.getTcsAmount());
        if (dto.getAdvanceTax() != null) existing.setAdvanceTax(dto.getAdvanceTax());
        if (dto.getSelfAssessmentTax() != null) existing.setSelfAssessmentTax(dto.getSelfAssessmentTax());

        repository.save(existing);

        return "Taxes paid updated successfully";
    }

   
}