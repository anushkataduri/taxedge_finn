package com.taxedge.gst.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.gst.dto.BusinessDto;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.helper.RandomNumberGenerator;
import com.taxedge.gst.repository.BusinessRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BusinessServiceImpl implements BusinessService {
    
	private final BusinessRepository businessRepository;

	private final CustomerRepository customerRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public String registerBusiness(BusinessDto businessDto) {

		Customer customer = customerRepository.findById(businessDto.getCustomerId()).orElseThrow(
				() -> new ResourceNotFoundException("Customer not found with ID: " + businessDto.getCustomerId()));

		Business business = modelMapper.map(businessDto, Business.class);

		business.setCustomer(customer);

		String gstId = RandomNumberGenerator.generateGstId();

		business.setGstId(gstId);

		businessRepository.save(business);

		return "Business details registered successfully. Business ID: " + gstId;
	}

	@Override
	public BusinessDto getBusinessId(String gstId) {

		Business business = businessRepository.findById(gstId)
				.orElseThrow(() -> new ResourceNotFoundException("Business not found with gstId: " + gstId));

		BusinessDto dto = modelMapper.map(business, BusinessDto.class);

		if (business.getCustomer() != null) {
			dto.setCustomerId(business.getCustomer().getCustId());
		}

		return dto;
	}

	@Override
	public String updateBusiness(String gstId, BusinessDto businessDto) {

	    Business business = businessRepository.findById(gstId)
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "Business not found with gstId: " + gstId));

	    modelMapper.typeMap(BusinessDto.class, Business.class)
	            .addMappings(mapper -> {
	                mapper.skip(Business::setGstId);
	                mapper.skip(Business::setCustomer);
	            });

	    modelMapper.map(businessDto, business);

	    businessRepository.save(business);

	    return "Business details updated successfully";
	}

	@Override
	public String deleteBusiness(String gstId) {

		Business business = businessRepository.findById(gstId)
				.orElseThrow(() -> new ResourceNotFoundException("Business not found with gstId: " + gstId));

		businessRepository.delete(business);

		return "Business details deleted successfully";
	}
}