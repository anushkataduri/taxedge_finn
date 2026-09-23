package com.taxedge.itr.service;

import com.taxedge.itr.dto.ItrFilingPostDto;
import com.taxedge.itr.entity.ItrFiling;

public interface ItrFilingService {

    String createItrFiling(ItrFilingPostDto dto);

    String updateItrFiling(String itrId, ItrFilingPostDto dto);

    ItrFiling getItrFiling(String itrId);
}