package com.taxedge.itr.service;

import com.taxedge.itr.dto.RevisedItrDto;

public interface RevisedItrService {

    String createRevisedItr(RevisedItrDto dto);

    String updateRevisedItr(String revisedItrId, RevisedItrDto dto);

    RevisedItrDto getRevisedItr(String revisedItrId);
}