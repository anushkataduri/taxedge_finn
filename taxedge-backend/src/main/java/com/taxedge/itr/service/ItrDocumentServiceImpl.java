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
import com.taxedge.itr.dto.DocumentDto;
import com.taxedge.itr.entity.ItrDocument;
import com.taxedge.itr.entity.ItrFiling;
import com.taxedge.itr.enums.ItrDocumentType;
import com.taxedge.itr.helper.RandomNumberGenerator;
import com.taxedge.itr.repository.ItrDocumentRepository;
import com.taxedge.itr.repository.ItrFilingRepository;

@Service
public class ItrDocumentServiceImpl implements ItrDocumentService {

    @Autowired
    private ItrDocumentRepository documentRepository;

    @Autowired
    private ItrFilingRepository itrFilingRepository;

    @Autowired
    @Qualifier("itrModelMapper")
    private ModelMapper modelMapper;

    @Override
    public String registerDocument(
            String itrId,
            String documentType,
            MultipartFile file) throws IOException {

        ItrFiling itrFiling = itrFilingRepository.findById(itrId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "ITR Filing not found with itrId: " + itrId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        ItrDocumentType type;

        try {
            type = ItrDocumentType.valueOf(documentType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid document type: " + documentType);
        }

        boolean alreadyExists =
                documentRepository
                        .existsByItrFilingItrIdAndDocumentType(
                                itrId, type);

        if (alreadyExists) {
            throw new IllegalArgumentException(
                    "Document already uploaded for: " + type);
        }

        ItrDocument document = new ItrDocument();

        String documentId =
                RandomNumberGenerator.generateDocumentId();

        document.setDocumentId(documentId);
        document.setItrFiling(itrFiling);
        document.setDocumentType(type);
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());

        String base64Data =
                Base64.getEncoder().encodeToString(file.getBytes());

        document.setImageData(base64Data);

        documentRepository.save(document);

        return "ITR document uploaded successfully. Document ID: "
                + documentId;
    }

    @Override
    public String updateDocument(
            String documentId,
            MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        ItrDocument document =
                documentRepository.findById(documentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Document not found with documentId: "
                                                + documentId));

        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());

        String base64Data =
                Base64.getEncoder().encodeToString(file.getBytes());

        document.setImageData(base64Data);

        documentRepository.save(document);

        return "ITR document updated successfully";
    }

    @Override
    public DocumentDto getDocument(String documentId) {

        ItrDocument document =
                documentRepository.findById(documentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Document not found with documentId: "
                                                + documentId));

        return modelMapper.map(document, DocumentDto.class);
    }
    
    
    @Override
    public List<DocumentDto> getDocuments(String itrId) {

        itrFilingRepository.findById(itrId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "ITR Filing not found with itrId: " + itrId));

        List<ItrDocument> documents =
                documentRepository.findByItrFilingItrId(itrId);

        return documents.stream()
                .map(document ->
                        modelMapper.map(document, DocumentDto.class))
                .collect(Collectors.toList());
    }
}