package com.taxedge.gst.service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.dto.GstComplianceDto;
import com.taxedge.gst.entity.GstCompliance;
import com.taxedge.gst.enums.ComplianceRequestType;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.helper.RandomNumberGenerator;
import com.taxedge.gst.repository.GstComplianceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GstComplianceServiceImpl implements GstComplianceService {

	
	private final GstComplianceRepository gstComplianceRepository;

	private final CustomerRepository customerRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public String createCompliance(GstComplianceDto gstComplianceDto, MultipartFile reconciliationFile1,
			MultipartFile reconciliationFile2, MultipartFile noticeFile) throws IOException {

		validateCompliance(gstComplianceDto);

		Customer customer = customerRepository.findById(gstComplianceDto.getCustomerId()).orElseThrow(
				() -> new ResourceNotFoundException("Customer not found with ID: " + gstComplianceDto.getCustomerId()));

		GstCompliance compliance = modelMapper.map(gstComplianceDto, GstCompliance.class);

		compliance.setCustomer(customer);

		compliance.setComplinaceId(RandomNumberGenerator.generateComplianceId());

		if (gstComplianceDto.getRequestType() == ComplianceRequestType.RECONCILIATION_SUPPORT) {

			compliance.setReconciliationFile1(convertFile(reconciliationFile1));

			compliance.setReconciliationFile2(convertFile(reconciliationFile2));

			compliance.setNoticeNumber(null);
			compliance.setNoticeIssueDate(null);
			compliance.setReplyDueDate(null);
			compliance.setNoticeFile(null);
		}

		if (gstComplianceDto.getRequestType() == ComplianceRequestType.NOTICE_RESPONSE) {

			compliance.setNoticeFile(convertFile(noticeFile));

			compliance.setGstr2bNumber(null);
			compliance.setReconciliationFile1(null);
			compliance.setReconciliationFile2(null);
		}

		gstComplianceRepository.save(compliance);

		return "GST compliance created successfully. Compliance ID: " + compliance.getComplinaceId();
	}

	@Override
	public GstComplianceDto getCompliance(String gstin, String id) {

		GstCompliance compliance = gstComplianceRepository.findByComplinaceIdAndGstin(id, gstin)
				.orElseThrow(() -> new ResourceNotFoundException(
						"GST compliance not found with ID: " + id + " and GSTIN: " + gstin));

		return modelMapper.map(compliance, GstComplianceDto.class);
	}

	@Override
	public String updateCompliance(String gstin, String id, GstComplianceDto gstComplianceDto,
	        MultipartFile reconciliationFile1, MultipartFile reconciliationFile2, MultipartFile noticeFile)
	        throws IOException {

	    GstCompliance compliance = gstComplianceRepository.findByComplinaceIdAndGstin(id, gstin)
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "GST compliance not found with ID: " + id + " and GSTIN: " + gstin));

	    validateCompliance(gstComplianceDto);

	    compliance.setGstin(gstComplianceDto.getGstin());
	    compliance.setFinancialYear(gstComplianceDto.getFinancialYear());
	    compliance.setRequestType(gstComplianceDto.getRequestType());
	    compliance.setMessage(gstComplianceDto.getMessage());

	    if (gstComplianceDto.getRequestType() == ComplianceRequestType.RECONCILIATION_SUPPORT) {

	        compliance.setGstr2bNumber(gstComplianceDto.getGstr2bNumber());
	        compliance.setNoticeNumber(null);
	        compliance.setNoticeIssueDate(null);
	        compliance.setReplyDueDate(null);
	        compliance.setNoticeFile(null);

	        if (reconciliationFile1 != null && !reconciliationFile1.isEmpty()) {
	            compliance.setReconciliationFile1(convertFile(reconciliationFile1));
	        }

	        if (reconciliationFile2 != null && !reconciliationFile2.isEmpty()) {
	            compliance.setReconciliationFile2(convertFile(reconciliationFile2));
	        }
	    }

	    if (gstComplianceDto.getRequestType() == ComplianceRequestType.NOTICE_RESPONSE) {

	        compliance.setNoticeNumber(gstComplianceDto.getNoticeNumber());
	        compliance.setNoticeIssueDate(gstComplianceDto.getNoticeIssueDate());
	        compliance.setReplyDueDate(gstComplianceDto.getReplyDueDate());
	        compliance.setGstr2bNumber(null);
	        compliance.setReconciliationFile1(null);
	        compliance.setReconciliationFile2(null);

	        if (noticeFile != null && !noticeFile.isEmpty()) {
	            compliance.setNoticeFile(convertFile(noticeFile));
	        }
	    }

	    gstComplianceRepository.save(compliance);

	    return "GST compliance updated successfully";
	}

	@Override
	public String deleteCompliance(String gstin, String id) {

		GstCompliance compliance = gstComplianceRepository.findByComplinaceIdAndGstin(id, gstin)
				.orElseThrow(() -> new ResourceNotFoundException(
						"GST compliance not found with ID: " + id + " and GSTIN: " + gstin));

		gstComplianceRepository.delete(compliance);

		return "GST compliance deleted successfully";
	}

	private void validateCompliance(GstComplianceDto dto) {

		if (dto.getGstin() == null || dto.getGstin().trim().isEmpty() || dto.getCustomerId() == null
				|| dto.getCustomerId().trim().isEmpty() || dto.getFinancialYear() == null
				|| dto.getFinancialYear().trim().isEmpty() || dto.getRequestType() == null) {

			throw new IllegalArgumentException("All mandatory fields are required for GST compliance");
		}

		if (dto.getRequestType() == ComplianceRequestType.RECONCILIATION_SUPPORT) {

			if (dto.getGstr2bNumber() == null || dto.getGstr2bNumber().trim().isEmpty()) {

				throw new IllegalArgumentException("GSTR-2B number is required for reconciliation support");
			}
		}

		if (dto.getRequestType() == ComplianceRequestType.NOTICE_RESPONSE) {

			if (dto.getNoticeNumber() == null || dto.getNoticeNumber().trim().isEmpty()
					|| dto.getNoticeIssueDate() == null || dto.getReplyDueDate() == null) {

				throw new IllegalArgumentException(
						"Notice number, notice issue date and reply due date are required for notice response");
			}
		}
	}

	private String convertFile(MultipartFile file) throws IOException {

		if (file == null || file.isEmpty()) {

			throw new IllegalArgumentException("Required document is missing");
		}

		return Base64.getEncoder().encodeToString(file.getBytes());
	}
}