package com.taxedge.gst.service;

import java.io.IOException;
import java.util.Base64;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.DocumentsDto;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.entity.Documents;
import com.taxedge.gst.enums.PrincipalPlaceAddressType;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.helper.RandomNumberGenerator;
import com.taxedge.gst.repository.BusinessRepository;
import com.taxedge.gst.repository.DocumentsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentsServiceImpl implements DocumentsService {

	
	private final DocumentsRepository documentsRepository;

	private final BusinessRepository businessRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public String uploadFile(String gstId, MultipartFile panCard, MultipartFile aadhaarCard,
			MultipartFile businessRegistrationProof, PrincipalPlaceAddressType principalPlaceAddressType,
			MultipartFile principalPlaceAddressProof, MultipartFile bankPassbookOrCancelledCheque,
			MultipartFile passportSizePhotograph) throws IOException {

		Business business = businessRepository.findById(gstId)
				.orElseThrow(() -> new ResourceNotFoundException("Business not found with gstId: " + gstId));

		if (panCard == null && aadhaarCard == null && businessRegistrationProof == null
				&& principalPlaceAddressProof == null && bankPassbookOrCancelledCheque == null
				&& passportSizePhotograph == null) {

			throw new IllegalArgumentException("Please select at least one document");
		}

		if (principalPlaceAddressProof != null && !principalPlaceAddressProof.isEmpty()) {

			if (principalPlaceAddressType == null) {
				throw new IllegalArgumentException("Principal place address type is required");
			}
		}

		Documents document = documentsRepository.findByBusiness_GstId(gstId).orElse(new Documents());

		document.setBusiness(business);

		if (document.getDocumentId() == null) {
			document.setDocumentId(RandomNumberGenerator.generateDocumentId());
		}

		if (panCard != null && !panCard.isEmpty()) {
			document.setPanCard(convertFile(panCard));
		}

		if (aadhaarCard != null && !aadhaarCard.isEmpty()) {
			document.setAadhaarCard(convertFile(aadhaarCard));
		}

		if (businessRegistrationProof != null && !businessRegistrationProof.isEmpty()) {

			document.setBusinessRegistrationProof(convertFile(businessRegistrationProof));
		}

		if (principalPlaceAddressProof != null && !principalPlaceAddressProof.isEmpty()) {

			document.setPrincipalPlaceAddressType(principalPlaceAddressType);

			document.setPrincipalPlaceAddressProof(convertFile(principalPlaceAddressProof));
		}

		if (bankPassbookOrCancelledCheque != null && !bankPassbookOrCancelledCheque.isEmpty()) {

			document.setBankPassbookOrCancelledCheque(convertFile(bankPassbookOrCancelledCheque));
		}

		if (passportSizePhotograph != null && !passportSizePhotograph.isEmpty()) {

			document.setPassportSizePhotograph(convertFile(passportSizePhotograph));
		}

		documentsRepository.save(document);

		return "Documents uploaded successfully. Document ID: " + document.getDocumentId();
	}

	@Override
	public DocumentsDto getDocuments(String documentId) {

		Documents document = documentsRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Documents not found with ID: " + documentId));

		DocumentsDto dto = modelMapper.map(document, DocumentsDto.class);

		dto.setGstId(document.getBusiness().getGstId());

		return dto;
	}

	@Override
	public String updateFile(String documentId, MultipartFile panCard, MultipartFile aadhaarCard,
			MultipartFile businessRegistrationProof, PrincipalPlaceAddressType principalPlaceAddressType,
			MultipartFile principalPlaceAddressProof, MultipartFile bankPassbookOrCancelledCheque,
			MultipartFile passportSizePhotograph) throws IOException {

		Documents document = documentsRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Documents not found with ID: " + documentId));

		if (panCard == null && aadhaarCard == null && businessRegistrationProof == null
				&& principalPlaceAddressProof == null && bankPassbookOrCancelledCheque == null
				&& passportSizePhotograph == null) {

			throw new IllegalArgumentException("Please select at least one document");
		}

		if (principalPlaceAddressProof != null && !principalPlaceAddressProof.isEmpty()) {

			if (principalPlaceAddressType == null) {
				throw new IllegalArgumentException("Principal place address type is required");
			}

			document.setPrincipalPlaceAddressType(principalPlaceAddressType);

			document.setPrincipalPlaceAddressProof(convertFile(principalPlaceAddressProof));
		}

		if (panCard != null && !panCard.isEmpty()) {
			document.setPanCard(convertFile(panCard));
		}

		if (aadhaarCard != null && !aadhaarCard.isEmpty()) {
			document.setAadhaarCard(convertFile(aadhaarCard));
		}

		if (businessRegistrationProof != null && !businessRegistrationProof.isEmpty()) {

			document.setBusinessRegistrationProof(convertFile(businessRegistrationProof));
		}

		if (bankPassbookOrCancelledCheque != null && !bankPassbookOrCancelledCheque.isEmpty()) {

			document.setBankPassbookOrCancelledCheque(convertFile(bankPassbookOrCancelledCheque));
		}

		if (passportSizePhotograph != null && !passportSizePhotograph.isEmpty()) {

			document.setPassportSizePhotograph(convertFile(passportSizePhotograph));
		}

		documentsRepository.save(document);

		return "Documents updated successfully. Document ID: " + document.getDocumentId();
	}

	@Override
	public String deleteFile(String documentId) {

		Documents document = documentsRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Documents not found with ID: " + documentId));

		documentsRepository.delete(document);

		return "Documents deleted successfully";
	}

	private String convertFile(MultipartFile file) throws IOException {

		return Base64.getEncoder().encodeToString(file.getBytes());
	}
}