package com.taxedge.gst.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.GstFilingDocumentsDto;

public interface GstFilingDocumentsService {

	String uploadDocument(String filingId, String documentType, MultipartFile file)
	        throws IOException;

	List<GstFilingDocumentsDto> getDocuments(String filingId);

	String updateDocument(String filingId, Long id, MultipartFile file)
	        throws IOException;

	String deleteDocument(String filingId, Long id);

}