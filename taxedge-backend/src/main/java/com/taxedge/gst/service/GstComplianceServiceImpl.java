package com.taxedge.gst.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.entity.GstCompliance;
import com.taxedge.gst.enums.ComplianceRequestType;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.BusinessRepository;
import com.taxedge.gst.repository.GstComplianceRepository;

@Service
public class GstComplianceServiceImpl implements GstComplianceService {

    @Autowired
    private GstComplianceRepository complianceRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Override
    public String createCompliance(String gstId,String financialYear,String requestType,String gstr2bNumber,MultipartFile reconciliationFile1,MultipartFile reconciliationFile2,String noticeNumber,String noticeIssueDate,String replyDueDate,MultipartFile noticeFile,String message) throws IOException {

        businessRepository.findById(gstId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business not found with gstId: " + gstId));

        if (financialYear == null || financialYear.trim().isEmpty()) {
            throw new IllegalArgumentException("Financial year is required");
        }

        ComplianceRequestType type =
                ComplianceRequestType.valueOf(requestType);

        GstCompliance compliance = new GstCompliance();

        compliance.setGstId(gstId);
        compliance.setFinancialYear(financialYear);
        compliance.setRequestType(type);
        compliance.setMessage(message);

        if (type == ComplianceRequestType.RECONCILIATION_SUPPORT) {

            if (gstr2bNumber == null || gstr2bNumber.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "GSTR-2B number is required");
            }

            if (reconciliationFile1 == null || reconciliationFile1.isEmpty()) {
                throw new IllegalArgumentException(
                        "First reconciliation file is required");
            }

            if (reconciliationFile2 == null || reconciliationFile2.isEmpty()) {
                throw new IllegalArgumentException(
                        "Second reconciliation file is required");
            }

            if (message == null || message.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Message is required");
            }

            compliance.setGstr2bNumber(gstr2bNumber);

            compliance.setReconciliationFile1(
                    Base64.getEncoder().encodeToString(
                            reconciliationFile1.getBytes()));

            compliance.setReconciliationFile2(
                    Base64.getEncoder().encodeToString(
                            reconciliationFile2.getBytes()));

        } else if (type == ComplianceRequestType.NOTICE_RESPONSE) {

            if (noticeNumber == null || noticeNumber.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Notice number is required");
            }

            if (noticeIssueDate == null || noticeIssueDate.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Notice issue date is required");
            }

            if (replyDueDate == null || replyDueDate.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Reply due date is required");
            }

            if (noticeFile == null || noticeFile.isEmpty()) {
                throw new IllegalArgumentException(
                        "Notice response file is required");
            }

            if (message == null || message.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Message is required");
            }

            compliance.setNoticeNumber(noticeNumber);

            compliance.setNoticeIssueDate(
                    LocalDate.parse(noticeIssueDate));

            compliance.setReplyDueDate(
                    LocalDate.parse(replyDueDate));

            compliance.setNoticeFile(
                    Base64.getEncoder().encodeToString(
                            noticeFile.getBytes()));
        }

        complianceRepository.save(compliance);

        return "GST compliance request created successfully";
    }

    @Override
    public List<GstCompliance> getComplianceByGstId(String gstId) {

        businessRepository.findById(gstId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business not found with gstId: " + gstId));

        return complianceRepository.findByGstId(gstId);
    }

    @Override
    public String updateCompliance(String gstId,Long id,String financialYear,String requestType,String gstr2bNumber,MultipartFile reconciliationFile1,MultipartFile reconciliationFile2,String noticeNumber,String noticeIssueDate,String replyDueDate,MultipartFile noticeFile,String message) throws IOException {

        businessRepository.findById(gstId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business not found with gstId: " + gstId));

        GstCompliance compliance = complianceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Compliance request not found with id: " + id));

        if (!compliance.getGstId().equals(gstId)) {
            throw new ResourceNotFoundException(
                    "Compliance request does not belong to gstId: " + gstId);
        }

        ComplianceRequestType type =
                ComplianceRequestType.valueOf(requestType);

        compliance.setFinancialYear(financialYear);
        compliance.setRequestType(type);
        compliance.setMessage(message);

        if (type == ComplianceRequestType.RECONCILIATION_SUPPORT) {

            if (gstr2bNumber == null || gstr2bNumber.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "GSTR-2B number is required");
            }

            if (reconciliationFile1 != null && !reconciliationFile1.isEmpty()) {

                compliance.setReconciliationFile1(
                        Base64.getEncoder().encodeToString(
                                reconciliationFile1.getBytes()));
            }

            if (reconciliationFile2 != null && !reconciliationFile2.isEmpty()) {

                compliance.setReconciliationFile2(
                        Base64.getEncoder().encodeToString(
                                reconciliationFile2.getBytes()));
            }

            compliance.setGstr2bNumber(gstr2bNumber);

            compliance.setNoticeNumber(null);
            compliance.setNoticeIssueDate(null);
            compliance.setReplyDueDate(null);
            compliance.setNoticeFile(null);

        } else if (type == ComplianceRequestType.NOTICE_RESPONSE) {

            if (noticeNumber == null || noticeNumber.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Notice number is required");
            }

            if (noticeIssueDate == null || noticeIssueDate.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Notice issue date is required");
            }

            if (replyDueDate == null || replyDueDate.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Reply due date is required");
            }

            if (noticeFile != null && !noticeFile.isEmpty()) {

                compliance.setNoticeFile(
                        Base64.getEncoder().encodeToString(
                                noticeFile.getBytes()));
            }

            compliance.setNoticeNumber(noticeNumber);

            compliance.setNoticeIssueDate(
                    LocalDate.parse(noticeIssueDate));

            compliance.setReplyDueDate(
                    LocalDate.parse(replyDueDate));

            compliance.setGstr2bNumber(null);
            compliance.setReconciliationFile1(null);
            compliance.setReconciliationFile2(null);
        }

        complianceRepository.save(compliance);

        return "GST compliance request updated successfully";
    }

    @Override
    public String deleteCompliance(String gstId,Long id) {

        businessRepository.findById(gstId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business not found with gstId: " + gstId));

        GstCompliance compliance = complianceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Compliance request not found with id: " + id));

        if (!compliance.getGstId().equals(gstId)) {
            throw new ResourceNotFoundException(
                    "Compliance request does not belong to gstId: " + gstId);
        }

        complianceRepository.delete(compliance);

        return "GST compliance request deleted successfully";
    }
}