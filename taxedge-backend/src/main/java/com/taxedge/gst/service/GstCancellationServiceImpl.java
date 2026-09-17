package com.taxedge.gst.service;

import java.io.IOException;
import java.util.Base64;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.gst.dto.GstCancellationDto;
import com.taxedge.gst.entity.GstCancellation;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.GstCancellationRepository;

@Service
public class GstCancellationServiceImpl
        implements GstCancellationService {

    @Autowired
    private GstCancellationRepository cancellationRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public String createCancellation(
            GstCancellationDto gstCancellationDto)
            throws IOException {

        if (cancellationRepository.existsById(
                gstCancellationDto.getGstId())) {

            throw new IllegalArgumentException(
                    "GST cancellation already exists for GST ID: "
                            + gstCancellationDto.getGstId());
        }

        GstCancellation cancellation =
                modelMapper.map(
                        gstCancellationDto,
                        GstCancellation.class);

        if (gstCancellationDto.getSupportingProofDocument() != null
                && !gstCancellationDto
                        .getSupportingProofDocument()
                        .isEmpty()) {

            String base64Data =
                    Base64.getEncoder()
                            .encodeToString(
                                    gstCancellationDto
                                            .getSupportingProofDocument()
                                            .getBytes());

            cancellation.setSupportingProofDocument(
                    base64Data);
        }

        cancellationRepository.save(cancellation);

        return "GST cancellation details saved successfully";
    }

    @Override
    public GstCancellation getCancellation(
            String gstId) {

        return cancellationRepository.findById(gstId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "GST cancellation details not found for GST ID: "
                                        + gstId));
    }
}