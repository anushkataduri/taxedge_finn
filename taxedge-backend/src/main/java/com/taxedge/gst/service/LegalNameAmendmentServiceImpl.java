package com.taxedge.gst.service;

import java.io.IOException;
import java.util.Base64;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.LegalNameAmendmentViewDto;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.entity.LegalNameAmendmentEntity;
import com.taxedge.gst.enums.AmendmentStatus;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.BusinessRepository;
import com.taxedge.gst.repository.LegalNameAmendmentRepository;

@Service
public class LegalNameAmendmentServiceImpl implements LegalNameAmendmentService {

    private final BusinessRepository businessRepository;
    private final LegalNameAmendmentRepository amendmentRepository;

    public LegalNameAmendmentServiceImpl(BusinessRepository businessRepository,
                                         LegalNameAmendmentRepository amendmentRepository) {
        this.businessRepository = businessRepository;
        this.amendmentRepository = amendmentRepository;
    }

    @Override
    public LegalNameAmendmentViewDto getExistingLegalNameDetails(String gstId) {
        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        return LegalNameAmendmentViewDto.builder()
                .gstId(business.getGstId())
                .currentLegalName(business.getLegalName())
                .build();
    }

    @Override
    public LegalNameAmendmentViewDto getNewLegalNameAmendmentDetails(String gstId) {
        businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        LegalNameAmendmentEntity pendingAmendment = amendmentRepository
                .findByGstIdAndStatus(gstId, AmendmentStatus.PENDING)
                .orElse(null);

        if (pendingAmendment == null) {
            return LegalNameAmendmentViewDto.builder().gstId(gstId).build();
        }

        return LegalNameAmendmentViewDto.builder()
                .amendmentId(pendingAmendment.getId())
                .gstId(pendingAmendment.getGstId())
                .currentLegalName(pendingAmendment.getCurrentLegalName())
                .newLegalName(pendingAmendment.getNewLegalName())
                .fileName(pendingAmendment.getFileName())
                .status(pendingAmendment.getStatus())
                .requestedAt(pendingAmendment.getRequestedAt())
                .build();
    }

    @Override
    @Transactional
    public String submitLegalNameAmendment(String gstId, String newLegalName, MultipartFile file) throws IOException {
        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting document is required for core field amendment");
        }

        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

        LegalNameAmendmentEntity amendment = LegalNameAmendmentEntity.builder()
                .gstId(gstId)
                .currentLegalName(business.getLegalName())
                .newLegalName(newLegalName)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .imageData(base64Data)
                .status(AmendmentStatus.PENDING)
                .build();

        amendmentRepository.save(amendment);

        return "Legal name amendment submitted successfully and is pending agent review.";
    }
}
