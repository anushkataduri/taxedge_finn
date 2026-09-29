package com.taxedge.itr.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.itr.dto.RevisedItrDocumentDto;

public interface RevisedItrDocumentService {

	String registerDocument(String revisedItrId, String documentType, MultipartFile file) throws IOException;

	String updateDocument(String documentId, MultipartFile file) throws IOException;

	RevisedItrDocumentDto getDocument(String documentId);

	List<RevisedItrDocumentDto> getDocuments(String revisedItrId);

	String deleteDocument(String documentId);
}