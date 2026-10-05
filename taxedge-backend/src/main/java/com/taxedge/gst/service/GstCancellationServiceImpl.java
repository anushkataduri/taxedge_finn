package com.taxedge.gst.service;

import java.io.IOException;
import java.util.Base64;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.dto.GstCancellationDto;
import com.taxedge.gst.entity.GstCancellation;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.helper.RandomNumberGenerator;
import com.taxedge.gst.repository.GstCancellationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GstCancellationServiceImpl implements GstCancellationService {

	
	private final GstCancellationRepository gstCancellationRepository;

	
	private final CustomerRepository customerRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public String createCancellation(GstCancellationDto gstCancellationDto, MultipartFile supportingProofDocument)
			throws IOException {

		Customer customer = customerRepository.findById(gstCancellationDto.getCustomerId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Customer not found with ID: " + gstCancellationDto.getCustomerId()));

		GstCancellation gstCancellation = modelMapper.map(gstCancellationDto, GstCancellation.class);

		gstCancellation.setCustomer(customer);

		String cancellationId = RandomNumberGenerator.generateCancellationId();

		gstCancellation.setCancellationId(cancellationId);

		if (supportingProofDocument != null && !supportingProofDocument.isEmpty()) {

			String base64Data = Base64.getEncoder().encodeToString(supportingProofDocument.getBytes());

			gstCancellation.setSupportingProofDocument(base64Data);
		}

		gstCancellationRepository.save(gstCancellation);

		return "GST cancellation details registered successfully. Cancellation ID: " + cancellationId;
	}

	@Override
	public GstCancellation getCancellation(String cancellationId) {

		GstCancellation gstCancellation = gstCancellationRepository.findById(cancellationId).orElseThrow(
				() -> new ResourceNotFoundException("GST cancellation details not found with ID: " + cancellationId));

		return gstCancellation;
	}
}