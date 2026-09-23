package com.taxedge.itr.service;

import com.taxedge.itr.dto.RevisedItrDetailsDto;

public interface RevisedItrDetailsService {

	String createRevisedItrDetails(RevisedItrDetailsDto dto);

	String updateRevisedItrDetails(String detailsId, RevisedItrDetailsDto dto);

	RevisedItrDetailsDto getRevisedItrDetails(String detailsId);
}