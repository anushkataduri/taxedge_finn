package com.taxedge.itr.service;

import com.taxedge.itr.dto.RevisionReasonDto;

public interface RevisionReasonService {

	String createRevisionReason(RevisionReasonDto dto);

	String updateRevisionReason(String revisionReasonId, RevisionReasonDto dto);

	RevisionReasonDto getRevisionReason(String revisionReasonId);
}