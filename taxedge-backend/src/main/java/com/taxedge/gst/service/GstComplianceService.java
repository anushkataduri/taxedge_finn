package com.taxedge.gst.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.GstComplianceDto;

public interface GstComplianceService {

	String createCompliance(GstComplianceDto gstComplianceDto, MultipartFile reconciliationFile1,
			MultipartFile reconciliationFile2, MultipartFile noticeFile) throws IOException;

	GstComplianceDto getCompliance(String gstin, String id);

	String updateCompliance(String gstin, String id, GstComplianceDto gstComplianceDto,
			MultipartFile reconciliationFile1, MultipartFile reconciliationFile2, MultipartFile noticeFile)
			throws IOException;

	String deleteCompliance(String gstin, String id);
}