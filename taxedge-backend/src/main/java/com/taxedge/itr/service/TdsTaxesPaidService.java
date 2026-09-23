package com.taxedge.itr.service;

import com.taxedge.itr.dto.TdsTaxesPaidDto;

public interface TdsTaxesPaidService {

    String saveTaxesPaid(TdsTaxesPaidDto dto);

    String updateTaxesPaid(Long id, TdsTaxesPaidDto dto);
}