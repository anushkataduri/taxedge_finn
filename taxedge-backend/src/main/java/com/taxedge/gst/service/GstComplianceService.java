//package com.taxedge.gst.service;
//
//import java.io.IOException;
//import java.util.List;
//
//import org.springframework.web.multipart.MultipartFile;
//
//import com.taxedge.gst.dto.GstComplianceDto;
//
//public interface GstComplianceService {
//
//    String createCompliance(
//            String gstId,
//            String financialYear,
//            String requestType,
//            String gstr2bNumber,
//            MultipartFile reconciliationFile1,
//            MultipartFile reconciliationFile2,
//            String noticeNumber,
//            String noticeIssueDate,
//            String replyDueDate,
//            MultipartFile noticeFile,
//            String message) throws IOException;
//
//    List<GstComplianceDto> getComplianceByGstId(String gstId);
//
//    String updateCompliance(
//            String gstId,
//            String id,
//            String financialYear,
//            String requestType,
//            String gstr2bNumber,
//            MultipartFile reconciliationFile1,
//            MultipartFile reconciliationFile2,
//            String noticeNumber,
//            String noticeIssueDate,
//            String replyDueDate,
//            MultipartFile noticeFile,
//            String message) throws IOException;
//
//    String deleteCompliance(String gstId, String id);
//}

package com.taxedge.gst.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.GstComplianceDto;

public interface GstComplianceService {

    String createCompliance(
            GstComplianceDto dto,
            MultipartFile reconciliationFile1,
            MultipartFile reconciliationFile2,
            MultipartFile noticeFile) throws IOException;

    List<GstComplianceDto> getComplianceByGstin(String gstin);

    String updateCompliance(
            String gstin,
            String id,
            GstComplianceDto dto,
            MultipartFile reconciliationFile1,
            MultipartFile reconciliationFile2,
            MultipartFile noticeFile) throws IOException;

    String deleteCompliance(
            String gstin,
            String id);
}