package com.taxedge.gst.service;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.dto.GstFilingDto;
import com.taxedge.gst.entity.GstFiling;
import com.taxedge.gst.enums.FilingType;
import com.taxedge.gst.enums.TaxCalculationMethod;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.helper.RandomNumberGenerator;
import com.taxedge.gst.repository.GstFilingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GstFilingServiceImpl implements GstFilingService {

	
	private  final GstFilingRepository gstFilingRepository;

	
	private final  CustomerRepository customerRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public String createFiling(GstFilingDto gstFilingDto) {

		validateFiling(gstFilingDto);

		Customer customer = customerRepository.findById(gstFilingDto.getCustomerId()).orElseThrow(
				() -> new ResourceNotFoundException("Customer not found with ID: " + gstFilingDto.getCustomerId()));

		GstFiling filing = modelMapper.map(gstFilingDto, GstFiling.class);

		filing.setCustomer(customer);

		filing.setGstfilingId(RandomNumberGenerator.generateFilingId());

		filing.setCreatedAt(LocalDateTime.now());

		gstFilingRepository.save(filing);

		return "GST filing created successfully. Filing ID: " + filing.getGstfilingId();
	}

	@Override
	public GstFiling getFilingById(String id) {
	    return gstFilingRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "GST filing not found with ID: " + id));
	}

	@Override
	public String updateFiling(String id, GstFilingDto gstFilingDto) {

	    GstFiling filing = gstFilingRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "GST filing not found with ID: " + id));

	    if (!filing.getGstin().equals(gstFilingDto.getGstin())) {
	        throw new ResourceNotFoundException(
	                "GST filing does not belong to GSTIN: " + gstFilingDto.getGstin());
	    }

	    validateFiling(gstFilingDto);

	    modelMapper.typeMap(GstFilingDto.class, GstFiling.class)
	            .addMappings(mapper -> {
	                mapper.skip(GstFiling::setGstfilingId);
	                mapper.skip(GstFiling::setCustomer);
	            });

	    modelMapper.map(gstFilingDto, filing);

	    gstFilingRepository.save(filing);

	    return "GST filing updated successfully";
	}

	@Override
	public String deleteFiling(String id) {

		GstFiling filing = gstFilingRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("GST filing not found with ID: " + id));

		gstFilingRepository.delete(filing);

		return "GST filing deleted successfully";
	}

	private void validateFiling(GstFilingDto dto) {

		if (dto.getGstin() == null || dto.getGstin().trim().isEmpty() || dto.getCustomerId() == null
				|| dto.getCustomerId().trim().isEmpty() || dto.getFinancialYear() == null
				|| dto.getFinancialYear().trim().isEmpty() || dto.getFilingPeriod() == null
				|| dto.getFilingPeriod().trim().isEmpty() || dto.getFilingFrequency() == null
				|| dto.getReturnType() == null || dto.getFilingType() == null) {

			throw new IllegalArgumentException("All mandatory fields are required for GST filing");
		}

		if (dto.getFilingType() == FilingType.NIL_RETURN) {

			dto.setTaxCalculationMethod(null);
			dto.setEstimatedTaxableSales(null);
			dto.setEstimatedTaxablePurchases(null);
			dto.setEstimatedEligibleItc(null);

			return;
		}

		if (dto.getFilingType() == FilingType.REGULAR) {

			if (dto.getTaxCalculationMethod() == null) {

				throw new IllegalArgumentException("Tax calculation method is required for regular filing");
			}

			if (dto.getTaxCalculationMethod() == TaxCalculationMethod.ESTIMATION_FIGURES) {

				if (dto.getEstimatedTaxableSales() == null || dto.getEstimatedTaxablePurchases() == null
						|| dto.getEstimatedEligibleItc() == null) {

					throw new IllegalArgumentException(
							"Estimated taxable sales, estimated taxable purchases and estimated eligible ITC are required");
				}
			}

			else if (dto.getTaxCalculationMethod() == TaxCalculationMethod.TAXEDGE_CA_CALCULATION) {

				dto.setEstimatedTaxableSales(null);
				dto.setEstimatedTaxablePurchases(null);
				dto.setEstimatedEligibleItc(null);
			}
		}
	}
}