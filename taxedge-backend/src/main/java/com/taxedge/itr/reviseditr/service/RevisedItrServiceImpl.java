package com.taxedge.itr.reviseditr.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.reviseditr.dto.RevisedItrDto;
import com.taxedge.itr.reviseditr.entity.RevisedItr;
import com.taxedge.itr.reviseditr.helper.RevisedItrRandomNumberGenerator;
import com.taxedge.itr.reviseditr.repository.RevisedItrRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RevisedItrServiceImpl implements RevisedItrService {

	
	private final RevisedItrRepository revisedItrRepository;

	
	private final  CustomerRepository customerRepository;

	@Autowired
	@Qualifier("itrModelMapper")
	private ModelMapper modelMapper;

	@Override
	public String createRevisedItr(RevisedItrDto dto) {

		Customer customer = customerRepository.findById(dto.getCustomerId())
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));

		RevisedItr revisedItr = modelMapper.map(dto, RevisedItr.class);

		revisedItr.setCustomer(customer);

		String revisedItrId = RevisedItrRandomNumberGenerator.generateRevisedItrId();

		revisedItr.setRevisedItrId(revisedItrId);

		revisedItrRepository.save(revisedItr);

		return "Revised ITR details registered successfully. Revised ITR ID: " + revisedItrId;
	}

	@Override
	public RevisedItrDto getRevisedItr(String revisedItrId) {

		RevisedItr revisedItr = revisedItrRepository.findById(revisedItrId)
				.orElseThrow(() -> new ResourceNotFoundException("Revised ITR not found with ID: " + revisedItrId));

		RevisedItrDto dto = modelMapper.map(revisedItr, RevisedItrDto.class);

		dto.setCustomerId(revisedItr.getCustomer().getCustId());

		return dto;
	}

	@Override
	public String updateRevisedItr(String revisedItrId, RevisedItrDto dto) {

	    RevisedItr revisedItr = revisedItrRepository.findById(revisedItrId)
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "Revised ITR not found with ID: " + revisedItrId));

	    modelMapper.typeMap(RevisedItrDto.class, RevisedItr.class)
	            .addMappings(mapper -> {
	                mapper.skip(RevisedItr::setRevisedItrId);
	                mapper.skip(RevisedItr::setCustomer);
	            });

	    modelMapper.map(dto, revisedItr);

	    revisedItrRepository.save(revisedItr);

	    return "Revised ITR details updated successfully";
	}
}
