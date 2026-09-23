package com.taxedge.itr.service;

import com.taxedge.itr.dto.TdsDocumentsDto;

public interface TdsDocumentsService {

    String saveDocuments(TdsDocumentsDto dto);

    String updateDocuments(Long id, TdsDocumentsDto dto);
}