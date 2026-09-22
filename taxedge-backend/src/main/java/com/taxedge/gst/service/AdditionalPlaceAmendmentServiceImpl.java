package com.taxedge.gst.service;

import com.taxedge.gst.dto.AdditionalPlaceAmendmentViewDto;
import com.taxedge.gst.entity.AdditionalPlaceAmendmentEntity;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.enums.AmendmentStatus;
import com.taxedge.gst.enums.NatureOfBusiness;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.AdditionalPlaceAmendmentRepository;
import com.taxedge.gst.repository.BusinessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdditionalPlaceAmendmentServiceImpl implements AdditionalPlaceAmendmentService {

    private final BusinessRepository businessRepository;
    private final AdditionalPlaceAmendmentRepository additionalPlaceRepository;

    public AdditionalPlaceAmendmentServiceImpl(BusinessRepository businessRepository,
                                               AdditionalPlaceAmendmentRepository additionalPlaceRepository) {
        this.businessRepository = businessRepository;
        this.additionalPlaceRepository = additionalPlaceRepository;
    }

    @Override
    public List<AdditionalPlaceAmendmentViewDto> getExistingAdditionalPlaces(String gstId) {
        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        AdditionalPlaceAmendmentViewDto existingDto = AdditionalPlaceAmendmentViewDto.builder()
                .gstId(business.getGstId())
                .address(business.getBusinessAddress())
                .city(business.getCity())
                .pinCode(business.getPinCode())
                .natureOfBusiness(business.getNatureOfBusiness())
                .status(null)
                .build();

        return Collections.singletonList(existingDto);
    }

    @Override
    public List<AdditionalPlaceAmendmentViewDto> getNewAmendmentPlaces(String gstId) {
        businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        List<AdditionalPlaceAmendmentEntity> pendingEntities =
                additionalPlaceRepository.findByGstIdAndStatus(gstId, AmendmentStatus.PENDING);

        return pendingEntities.stream().map(entity -> AdditionalPlaceAmendmentViewDto.builder()
                .id(entity.getId())
                .gstId(entity.getGstId())
                .address(entity.getAddress())
                .city(entity.getCity())
                .pinCode(entity.getPinCode())
                .natureOfBusiness(entity.getNatureOfBusiness())
                .fileName(entity.getFileName())
                .status(entity.getStatus())
                .requestedAt(entity.getRequestedAt())
                .build()).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public String submitAdditionalPlace(String gstId, String address, String city, String pinCode,
                                        NatureOfBusiness natureOfBusiness, MultipartFile file) throws IOException {

        businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for an additional place of business");
        }

        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

        AdditionalPlaceAmendmentEntity entity = AdditionalPlaceAmendmentEntity.builder()
                .gstId(gstId)
                .address(address)
                .city(city)
                .pinCode(pinCode)
                .natureOfBusiness(natureOfBusiness)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .imageData(base64Data)
                .status(AmendmentStatus.PENDING)
                .build();

        additionalPlaceRepository.save(entity);

        return "Additional place of business submitted successfully and is pending agent review.";
    }
}
