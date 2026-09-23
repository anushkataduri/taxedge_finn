package com.taxedge.itr.service;

import com.taxedge.itr.dto.IncomeTaxInfoDto;

public interface IncomeTaxInfoService {

    String saveIncomeTaxInfo(IncomeTaxInfoDto dto);

    String updateIncomeTaxInfo(Long id, IncomeTaxInfoDto dto);
}