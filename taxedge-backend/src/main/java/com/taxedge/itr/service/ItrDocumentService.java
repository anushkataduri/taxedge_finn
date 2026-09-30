package com.taxedge.itr.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.itr.dto.DocumentDto;

public interface ItrDocumentService {

	String registerDocument(String itrId, String documentType, MultipartFile file) throws IOException;

	String updateDocument(String documentId, MultipartFile file) throws IOException;

	DocumentDto getDocument(String documentId);
	
	List<DocumentDto> getDocuments(String itrId);
}