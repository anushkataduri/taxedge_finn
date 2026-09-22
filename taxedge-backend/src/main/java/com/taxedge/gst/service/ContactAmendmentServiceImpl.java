package com.taxedge.gst.service;

import com.taxedge.gst.dto.ContactAmendmentViewDto;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.entity.ContactAmendmentEntity;
import com.taxedge.gst.enums.AmendmentStatus;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.BusinessRepository;
import com.taxedge.gst.repository.ContactAmendmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class ContactAmendmentServiceImpl implements ContactAmendmentService {

    private final BusinessRepository businessRepository;
    private final ContactAmendmentRepository contactAmendmentRepository;

    public ContactAmendmentServiceImpl(BusinessRepository businessRepository,
                                       ContactAmendmentRepository contactAmendmentRepository) {
        this.businessRepository = businessRepository;
        this.contactAmendmentRepository = contactAmendmentRepository;
    }

    @Override
    public ContactAmendmentViewDto getExistingContactDetails(String gstId) {
        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        return ContactAmendmentViewDto.builder()
                .gstId(business.getGstId())
                .currentMobileNumber(business.getSignatoryMobile())
                .currentEmail(business.getSignatoryEmail())
                .build();
    }

    @Override
    public ContactAmendmentViewDto getNewContactAmendmentDetails(String gstId) {
        businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        ContactAmendmentEntity pendingAmendment = contactAmendmentRepository
                .findByGstIdAndStatus(gstId, AmendmentStatus.PENDING)
                .orElse(null);

        if (pendingAmendment == null) {
            return ContactAmendmentViewDto.builder().gstId(gstId).build();
        }

        return ContactAmendmentViewDto.builder()
                .gstId(gstId)
                .currentMobileNumber(pendingAmendment.getCurrentMobileNumber())
                .currentEmail(pendingAmendment.getCurrentEmail())
                .newMobileNumber(pendingAmendment.getNewMobileNumber())
                .newEmail(pendingAmendment.getNewEmail())
                .fileName(pendingAmendment.getFileName())
                .status(pendingAmendment.getStatus())
                .requestedAt(pendingAmendment.getRequestedAt())
                .build();
    }

    @Override
    @Transactional
    public String submitContactAmendment(String gstId, String mobileNumber, String email, MultipartFile file) throws IOException {
        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for contact details amendment");
        }

        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

        ContactAmendmentEntity amendment = ContactAmendmentEntity.builder()
                .gstId(gstId)
                .currentMobileNumber(business.getSignatoryMobile())
                .currentEmail(business.getSignatoryEmail())
                .newMobileNumber(mobileNumber)
                .newEmail(email)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .imageData(base64Data)
                .status(AmendmentStatus.PENDING)
                .build();

        contactAmendmentRepository.save(amendment);

        return "Contact details amendment submitted successfully and is pending review.";
    }
}
