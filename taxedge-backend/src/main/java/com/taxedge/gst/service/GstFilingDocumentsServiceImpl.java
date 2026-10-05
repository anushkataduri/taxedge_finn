package com.taxedge.gst.service;

import java.io.IOException;
import java.util.Base64;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.GstFilingDocumentsDto;
import com.taxedge.gst.entity.GstFiling;
import com.taxedge.gst.entity.GstFilingDocuments;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.helper.RandomNumberGenerator;
import com.taxedge.gst.repository.GstFilingDocumentsRepository;
import com.taxedge.gst.repository.GstFilingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GstFilingDocumentsServiceImpl implements GstFilingDocumentsService {

	
	private final GstFilingDocumentsRepository documentsRepository;

	
	private final GstFilingRepository filingRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public String uploadDocuments(String gstfilingId, MultipartFile salesInvoice, MultipartFile purchaseInvoices,
			MultipartFile gstr2bItcStatement, MultipartFile creditNotes, MultipartFile debitNotes,
			MultipartFile eInvoiceData, MultipartFile eWayBillData, MultipartFile expenseInvoicesAndVouchers,
			MultipartFile bankStatement, MultipartFile previousGstReturns, MultipartFile previousFilingAcknowledgement,
			MultipartFile otherSupportingDocuments) throws IOException {

		GstFiling filing = filingRepository.findById(gstfilingId)
				.orElseThrow(() -> new ResourceNotFoundException("GST filing not found with ID: " + gstfilingId));

		if (salesInvoice == null && purchaseInvoices == null && gstr2bItcStatement == null && creditNotes == null
				&& debitNotes == null && eInvoiceData == null && eWayBillData == null
				&& expenseInvoicesAndVouchers == null && bankStatement == null && previousGstReturns == null
				&& previousFilingAcknowledgement == null && otherSupportingDocuments == null) {

			throw new IllegalArgumentException("Please select at least one document");
		}

		if (documentsRepository.findByGstFiling_GstfilingId(gstfilingId).isPresent()) {

			throw new IllegalArgumentException("Documents already exist for this GST filing");
		}

		GstFilingDocuments documents = new GstFilingDocuments();

		documents.setGstFiling(filing);

		documents.setDocumentId(RandomNumberGenerator.generateDocumentId());

		if (salesInvoice != null && !salesInvoice.isEmpty()) {
			documents.setSalesInvoice(convertFile(salesInvoice));
		}

		if (purchaseInvoices != null && !purchaseInvoices.isEmpty()) {
			documents.setPurchaseInvoices(convertFile(purchaseInvoices));
		}

		if (gstr2bItcStatement != null && !gstr2bItcStatement.isEmpty()) {
			documents.setGstr2bItcStatement(convertFile(gstr2bItcStatement));
		}

		if (creditNotes != null && !creditNotes.isEmpty()) {
			documents.setCreditNotes(convertFile(creditNotes));
		}

		if (debitNotes != null && !debitNotes.isEmpty()) {
			documents.setDebitNotes(convertFile(debitNotes));
		}

		if (eInvoiceData != null && !eInvoiceData.isEmpty()) {
			documents.setEInvoiceData(convertFile(eInvoiceData));
		}

		if (eWayBillData != null && !eWayBillData.isEmpty()) {
			documents.setEWayBillData(convertFile(eWayBillData));
		}

		if (expenseInvoicesAndVouchers != null && !expenseInvoicesAndVouchers.isEmpty()) {
			documents.setExpenseInvoicesAndVouchers(convertFile(expenseInvoicesAndVouchers));
		}

		if (bankStatement != null && !bankStatement.isEmpty()) {
			documents.setBankStatement(convertFile(bankStatement));
		}

		if (previousGstReturns != null && !previousGstReturns.isEmpty()) {
			documents.setPreviousGstReturns(convertFile(previousGstReturns));
		}

		if (previousFilingAcknowledgement != null && !previousFilingAcknowledgement.isEmpty()) {
			documents.setPreviousFilingAcknowledgement(convertFile(previousFilingAcknowledgement));
		}

		if (otherSupportingDocuments != null && !otherSupportingDocuments.isEmpty()) {
			documents.setOtherSupportingDocuments(convertFile(otherSupportingDocuments));
		}

		documentsRepository.save(documents);

		return "GST filing documents uploaded successfully. Document ID: " + documents.getDocumentId();
	}

	@Override
	public GstFilingDocumentsDto getDocuments(String gstfilingId) {

		GstFilingDocuments documents = documentsRepository.findByGstFiling_GstfilingId(gstfilingId).orElseThrow(
				() -> new ResourceNotFoundException("GST filing documents not found for filing ID: " + gstfilingId));

		GstFilingDocumentsDto dto = modelMapper.map(documents, GstFilingDocumentsDto.class);

		dto.setFilingId(documents.getGstFiling().getGstfilingId());

		return dto;
	}

	@Override
	public String updateDocuments(String gstfilingId, MultipartFile salesInvoice, MultipartFile purchaseInvoices,
			MultipartFile gstr2bItcStatement, MultipartFile creditNotes, MultipartFile debitNotes,
			MultipartFile eInvoiceData, MultipartFile eWayBillData, MultipartFile expenseInvoicesAndVouchers,
			MultipartFile bankStatement, MultipartFile previousGstReturns, MultipartFile previousFilingAcknowledgement,
			MultipartFile otherSupportingDocuments) throws IOException {

		GstFilingDocuments documents = documentsRepository.findByGstFiling_GstfilingId(gstfilingId).orElseThrow(
				() -> new ResourceNotFoundException("GST filing documents not found for filing ID: " + gstfilingId));

		if (salesInvoice == null && purchaseInvoices == null && gstr2bItcStatement == null && creditNotes == null
				&& debitNotes == null && eInvoiceData == null && eWayBillData == null
				&& expenseInvoicesAndVouchers == null && bankStatement == null && previousGstReturns == null
				&& previousFilingAcknowledgement == null && otherSupportingDocuments == null) {

			throw new IllegalArgumentException("Please select at least one document");
		}

		if (salesInvoice != null && !salesInvoice.isEmpty()) {
			documents.setSalesInvoice(convertFile(salesInvoice));
		}

		if (purchaseInvoices != null && !purchaseInvoices.isEmpty()) {
			documents.setPurchaseInvoices(convertFile(purchaseInvoices));
		}

		if (gstr2bItcStatement != null && !gstr2bItcStatement.isEmpty()) {
			documents.setGstr2bItcStatement(convertFile(gstr2bItcStatement));
		}

		if (creditNotes != null && !creditNotes.isEmpty()) {
			documents.setCreditNotes(convertFile(creditNotes));
		}

		if (debitNotes != null && !debitNotes.isEmpty()) {
			documents.setDebitNotes(convertFile(debitNotes));
		}

		if (eInvoiceData != null && !eInvoiceData.isEmpty()) {
			documents.setEInvoiceData(convertFile(eInvoiceData));
		}

		if (eWayBillData != null && !eWayBillData.isEmpty()) {
			documents.setEWayBillData(convertFile(eWayBillData));
		}

		if (expenseInvoicesAndVouchers != null && !expenseInvoicesAndVouchers.isEmpty()) {
			documents.setExpenseInvoicesAndVouchers(convertFile(expenseInvoicesAndVouchers));
		}

		if (bankStatement != null && !bankStatement.isEmpty()) {
			documents.setBankStatement(convertFile(bankStatement));
		}

		if (previousGstReturns != null && !previousGstReturns.isEmpty()) {
			documents.setPreviousGstReturns(convertFile(previousGstReturns));
		}

		if (previousFilingAcknowledgement != null && !previousFilingAcknowledgement.isEmpty()) {
			documents.setPreviousFilingAcknowledgement(convertFile(previousFilingAcknowledgement));
		}

		if (otherSupportingDocuments != null && !otherSupportingDocuments.isEmpty()) {
			documents.setOtherSupportingDocuments(convertFile(otherSupportingDocuments));
		}

		documentsRepository.save(documents);

		return "GST filing documents updated successfully. Document ID: " + documents.getDocumentId();
	}

	@Override
	public String deleteDocuments(String gstfilingId) {

		GstFilingDocuments documents = documentsRepository.findByGstFiling_GstfilingId(gstfilingId).orElseThrow(
				() -> new ResourceNotFoundException("GST filing documents not found for filing ID: " + gstfilingId));

		documentsRepository.delete(documents);

		return "GST filing documents deleted successfully";
	}

	private String convertFile(MultipartFile file) throws IOException {

		return Base64.getEncoder().encodeToString(file.getBytes());
	}
}