package com.taxedge.gst.service;

import com.taxedge.gst.dto.SignatoryAmendmentViewDto;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.entity.SignatoryAmendmentEntity;
import com.taxedge.gst.enums.AmendmentStatus;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.BusinessRepository;
import com.taxedge.gst.repository.SignatoryAmendmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;

@Service
public class SignatoryAmendmentServiceImpl implements SignatoryAmendmentService {

    private final BusinessRepository businessRepository;
    private final SignatoryAmendmentRepository signatoryAmendmentRepository;

    public SignatoryAmendmentServiceImpl(BusinessRepository businessRepository,
                                         SignatoryAmendmentRepository signatoryAmendmentRepository) {
        this.businessRepository = businessRepository;
        this.signatoryAmendmentRepository = signatoryAmendmentRepository;
    }

    /**
     * 1. GET EXISTING: Queries the main BusinessRepository (business_details table)
     * to return the current official signatory details.
     */
    @Override
    public SignatoryAmendmentViewDto getExistingSignatoryDetails(String gstId) {
        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        return SignatoryAmendmentViewDto.builder()
                .gstId(business.getGstId())
                .currentSignatoryName(business.getSignatoryName())
                .currentSignatoryPan(business.getSignatoryPan())
                .currentSignatoryDob(business.getSignatoryDob())
                .currentDesignation(business.getDesignation())
                .currentSignatoryMobile(business.getSignatoryMobile())
                .currentSignatoryEmail(business.getSignatoryEmail())
                .build();
    }

    /**
     * 2. GET NEW: Queries the SignatoryAmendmentRepository (signatory_amendments table)
     * to return unapproved/pending signatory changes.
     */
    @Override
    public SignatoryAmendmentViewDto getNewSignatoryAmendmentDetails(String gstId) {
        businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        SignatoryAmendmentEntity pendingAmendment = signatoryAmendmentRepository
                .findByGstIdAndStatus(gstId, AmendmentStatus.PENDING)
                .orElse(null);

        if (pendingAmendment == null) {
            return SignatoryAmendmentViewDto.builder().gstId(gstId).build();
        }

        return SignatoryAmendmentViewDto.builder()
                .gstId(gstId)
                // Map current snapshot fields stored in the amendment entity
                .currentSignatoryName(pendingAmendment.getCurrentSignatoryName())
                .currentSignatoryPan(pendingAmendment.getCurrentSignatoryPan())
                .currentSignatoryDob(pendingAmendment.getCurrentSignatoryDob())
                .currentDesignation(pendingAmendment.getCurrentDesignation())
                .currentSignatoryMobile(pendingAmendment.getCurrentSignatoryMobile())
                .currentSignatoryEmail(pendingAmendment.getCurrentSignatoryEmail())
                // New proposed updates
                .newSignatoryName(pendingAmendment.getNewSignatoryName())
                .newSignatoryPan(pendingAmendment.getNewSignatoryPan())
                .newSignatoryDob(pendingAmendment.getNewSignatoryDob())
                .newDesignation(pendingAmendment.getNewDesignation())
                .newSignatoryMobile(pendingAmendment.getNewSignatoryMobile())
                .newSignatoryEmail(pendingAmendment.getNewSignatoryEmail())
                .fileName(pendingAmendment.getFileName())
                .status(pendingAmendment.getStatus())
                .requestedAt(pendingAmendment.getRequestedAt())
                .build();
    }

    /**
     * 3. SUBMIT NEW: Saves incoming frontend data + file bytes into the new amendment table as PENDING.
     */
    @Override
    @Transactional
    public String submitSignatoryAmendment(String gstId, String signatoryName, String signatoryPan,
                                           LocalDate signatoryDob, String designation, String signatoryMobile,
                                           String signatoryEmail, MultipartFile file) throws IOException {

        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for authorized signatory amendment");
        }

        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

        SignatoryAmendmentEntity amendment = SignatoryAmendmentEntity.builder()
                .gstId(gstId)
                .currentSignatoryName(business.getSignatoryName())
                .currentSignatoryPan(business.getSignatoryPan())
                .currentSignatoryDob(business.getSignatoryDob())
                .currentDesignation(business.getDesignation())
                .currentSignatoryMobile(business.getSignatoryMobile())
                .currentSignatoryEmail(business.getSignatoryEmail())
                .newSignatoryName(signatoryName)
                .newSignatoryPan(signatoryPan)
                .newSignatoryDob(signatoryDob)
                .newDesignation(designation)
                .newSignatoryMobile(signatoryMobile)
                .newSignatoryEmail(signatoryEmail)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .imageData(base64Data)
                .status(AmendmentStatus.PENDING)
                .build();

        signatoryAmendmentRepository.save(amendment);

        return "Authorized signatory amendment submitted successfully and is pending review.";
    }
}
