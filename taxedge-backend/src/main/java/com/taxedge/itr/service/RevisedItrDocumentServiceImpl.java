package com.taxedge.itr.service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.dto.RevisedItrDocumentDto;
import com.taxedge.itr.entity.RevisedItrDocument;
import com.taxedge.itr.enums.RevisedItrDocumentType;
import com.taxedge.itr.helper.RandomNumberGenerator;
import com.taxedge.itr.repository.RevisedItrDocumentRepository;

@Service
public class RevisedItrDocumentServiceImpl implements RevisedItrDocumentService {

	@Autowired
	private RevisedItrDocumentRepository documentRepository;

	@Autowired
	@Qualifier("itrModelMapper")
	private ModelMapper modelMapper;

	@Override
	public String registerDocument(String revisedItrId, String documentType, MultipartFile file) throws IOException {

		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("File is required");
		}

		RevisedItrDocumentType type;

		try {
			type = RevisedItrDocumentType.valueOf(documentType.toUpperCase());
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Invalid document type: " + documentType);
		}

		boolean alreadyExists = documentRepository.existsByRevisedItrIdAndDocumentType(revisedItrId, type);

		if (alreadyExists) {
			throw new IllegalArgumentException("Document already uploaded for: " + type);
		}

		RevisedItrDocument document = new RevisedItrDocument();

		String documentId = RandomNumberGenerator.generateRevisedItrDocumentId();

		document.setDocumentId(documentId);
		document.setRevisedItrId(revisedItrId);
		document.setDocumentType(type);
		document.setFileName(file.getOriginalFilename());
		document.setFileType(file.getContentType());

		String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

		document.setImageData(base64Data);

		documentRepository.save(document);

		return "Revised ITR document uploaded successfully. Document ID: " + documentId;
	}

	@Override
	public String updateDocument(String documentId, MultipartFile file) throws IOException {

		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("File is required");
		}

		RevisedItrDocument document = documentRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Document not found with documentId: " + documentId));

		document.setFileName(file.getOriginalFilename());

		document.setFileType(file.getContentType());

		String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

		document.setImageData(base64Data);

		documentRepository.save(document);

		return "Revised ITR document updated successfully";
	}

	@Override
	public RevisedItrDocumentDto getDocument(String documentId) {

		RevisedItrDocument document = documentRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Document not found with documentId: " + documentId));

		return modelMapper.map(document, RevisedItrDocumentDto.class);
	}

	@Override
	public List<RevisedItrDocumentDto> getDocuments(String revisedItrId) {

		List<RevisedItrDocument> documents = documentRepository.findByRevisedItrId(revisedItrId);

		return documents.stream().map(document -> modelMapper.map(document, RevisedItrDocumentDto.class))
				.collect(Collectors.toList());
	}

	@Override
	public String deleteDocument(String documentId) {

		RevisedItrDocument document = documentRepository.findById(documentId)
				.orElseThrow(() -> new ResourceNotFoundException("Document not found with documentId: " + documentId));

		documentRepository.delete(document);

		return "Revised ITR document deleted successfully";
	}
}