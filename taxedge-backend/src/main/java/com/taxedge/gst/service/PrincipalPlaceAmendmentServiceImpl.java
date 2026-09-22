package com.taxedge.gst.service;

import com.taxedge.gst.dto.PrincipalPlaceAmendmentViewDto;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.entity.PrincipalPlaceAmendmentEntity;
import com.taxedge.gst.enums.AmendmentStatus;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.BusinessRepository;
import com.taxedge.gst.repository.PrincipalPlaceAmendmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class PrincipalPlaceAmendmentServiceImpl implements PrincipalPlaceAmendmentService {

    private final BusinessRepository businessRepository;
    private final PrincipalPlaceAmendmentRepository amendmentRepository;

    public PrincipalPlaceAmendmentServiceImpl(BusinessRepository businessRepository,
                                              PrincipalPlaceAmendmentRepository amendmentRepository) {
        this.businessRepository = businessRepository;
        this.amendmentRepository = amendmentRepository;
    }

    @Override
    public PrincipalPlaceAmendmentViewDto getAmendmentDetails(String gstId) {
        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        PrincipalPlaceAmendmentEntity pendingAmendment = amendmentRepository
                .findByGstIdAndStatus(gstId, AmendmentStatus.PENDING)
                .orElse(null);

        return PrincipalPlaceAmendmentViewDto.builder()
                .gstId(gstId)
                .currentBusinessAddress(business.getBusinessAddress())
                .currentCity(business.getCity())
                .currentDistrict(business.getDistrict())
                .currentState(business.getState())
                .currentPinCode(business.getPinCode())
                .newBusinessAddress(pendingAmendment != null ? pendingAmendment.getNewBusinessAddress() : null)
                .newCity(pendingAmendment != null ? pendingAmendment.getNewCity() : null)
                .newDistrict(pendingAmendment != null ? pendingAmendment.getNewDistrict() : null)
                .newState(pendingAmendment != null ? pendingAmendment.getNewState() : null)
                .newPinCode(pendingAmendment != null ? pendingAmendment.getNewPinCode() : null)
                .fileName(pendingAmendment != null ? pendingAmendment.getFileName() : null)
                .status(pendingAmendment != null ? pendingAmendment.getStatus() : null)
                .requestedAt(pendingAmendment != null ? pendingAmendment.getRequestedAt() : null)
                .build();
    }

    @Override
    @Transactional
    public String submitAmendment(String gstId, String address, String city, String district,
                                  String state, String pinCode, MultipartFile file) throws IOException {

        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for principal place amendment");
        }

        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

        PrincipalPlaceAmendmentEntity amendment = PrincipalPlaceAmendmentEntity.builder()
                .gstId(gstId)
                .currentBusinessAddress(business.getBusinessAddress())
                .currentCity(business.getCity())
                .currentDistrict(business.getDistrict())
                .currentState(business.getState())
                .currentPinCode(business.getPinCode())
                .newBusinessAddress(address)
                .newCity(city)
                .newDistrict(district)
                .newState(state)
                .newPinCode(pinCode)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .imageData(base64Data)
                .status(AmendmentStatus.PENDING)
                .build();

        amendmentRepository.save(amendment);

        return "Principal place of business amendment submitted successfully and is pending agent review.";
    }
}
