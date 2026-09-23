package com.taxedge.itr.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.itr.dto.RefundBankAccountDto;
import com.taxedge.itr.entity.RefundBankAccount;
import com.taxedge.itr.helper.RandomNumberGenerator;
import com.taxedge.itr.repository.RefundBankAccountRepository;

import jakarta.transaction.Transactional;

@Service
public class RefundBankAccountServiceImpl implements RefundBankAccountService {

	@Autowired
    private  RefundBankAccountRepository repository;

    

    @Override
    @Transactional
    public String saveBankAccount(RefundBankAccountDto dto) {


        RefundBankAccount account = RefundBankAccount.builder()
        		.id(RandomNumberGenerator.generateTdsRefundId())
                .custId(dto.getCustId())
                .accountHolderName(dto.getAccountHolderName().trim())
                .accountNumber(dto.getAccountNumber())
                .ifscCode(dto.getIfscCode().trim().toUpperCase())
                .bankName(dto.getBankName())
                .branchName(dto.getBranchName())
                .accountType(dto.getAccountType())
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(account);

        return "Bank account saved successfully";
    }

    @Override
    @Transactional
    public String updateBankAccount(String id, RefundBankAccountDto dto) {

        RefundBankAccount existing = repository.findByIdAndCustId(id, dto.getCustId())
                .orElseThrow(() -> new RuntimeException("Bank account not found"));

        RefundBankAccount updated = RefundBankAccount.builder()
                .id(existing.getId())                       // same id -> UPDATE, not INSERT
                .custId(existing.getCustId())               // keep owner
                .createdAt(existing.getCreatedAt())         // keep original timestamp
                .accountHolderName(dto.getAccountHolderName())
                .accountNumber(dto.getAccountNumber())
                .ifscCode(dto.getIfscCode())
                .bankName(dto.getBankName())
                .branchName(dto.getBranchName())
                .accountType(dto.getAccountType())
                .build();

        repository.save(updated);

        return "Bank account updated successfully";
    }
    
}