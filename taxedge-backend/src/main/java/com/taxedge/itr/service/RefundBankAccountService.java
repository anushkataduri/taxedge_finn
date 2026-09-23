package com.taxedge.itr.service;

import com.taxedge.itr.dto.RefundBankAccountDto;

public interface RefundBankAccountService {

    String saveBankAccount(RefundBankAccountDto dto);

    String updateBankAccount(String id, RefundBankAccountDto dto);
    
    RefundBankAccountDto getBankAccount(String id);

    RefundBankAccountDto getBankAccountByCustId(String custId);
}

