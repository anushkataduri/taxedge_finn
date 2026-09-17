package com.taxedge.gst.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.entity.GstCompliance;

public interface GstComplianceService {

    String createCompliance(String gstId,String financialYear,String requestType,String gstr2bNumber,MultipartFile reconciliationFile1,MultipartFile reconciliationFile2,String noticeNumber,String noticeIssueDate,String replyDueDate,MultipartFile noticeFile,String message) throws IOException;

    List<GstCompliance> getComplianceByGstId(String gstId);

    String updateCompliance(String gstId,Long id,String financialYear,String requestType,String gstr2bNumber,MultipartFile reconciliationFile1,MultipartFile reconciliationFile2,String noticeNumber,String noticeIssueDate,String replyDueDate,MultipartFile noticeFile,String message) throws IOException;

    String deleteCompliance(String gstId,Long id);
}