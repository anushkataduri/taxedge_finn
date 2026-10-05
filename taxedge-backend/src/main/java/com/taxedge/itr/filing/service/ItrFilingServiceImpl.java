package com.taxedge.itr.filing.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.filing.dto.ItrFilingPostDto;
import com.taxedge.itr.filing.entity.ItrFiling;
import com.taxedge.itr.filing.helper.FilingRandomNumberGenerator;
import com.taxedge.itr.filing.repository.ItrFilingRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ItrFilingServiceImpl implements ItrFilingService {

	
	private final ItrFilingRepository itrFilingRepository;

	
	private final CustomerRepository customerRepository;

	@Autowired
	@Qualifier("itrModelMapper")
	private ModelMapper modelMapper;

	@Override
	public String createItrFiling(ItrFilingPostDto dto) {

		Customer customer = customerRepository.findById(dto.getCustomerId())
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + dto.getCustomerId()));

		ItrFiling itrFiling = modelMapper.map(dto, ItrFiling.class);

		itrFiling.setCustomer(customer);

		String itrId = FilingRandomNumberGenerator.generateItrId();

		itrFiling.setItrId(itrId);

		itrFilingRepository.save(itrFiling);

		return "ITR Filing details registered successfully. ITR ID: " + itrId;
	}

	@Override
	public String updateItrFiling(String itrId, ItrFilingPostDto dto) {

	    ItrFiling itrFiling = itrFilingRepository.findById(itrId)
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "ITR Filing details not found with ITR ID: " + itrId));

	    modelMapper.typeMap(ItrFilingPostDto.class, ItrFiling.class)
	            .addMappings(mapper -> {
	                mapper.skip(ItrFiling::setItrId);
	                mapper.skip(ItrFiling::setCustomer);
	            });

	    modelMapper.map(dto, itrFiling);

	    itrFilingRepository.save(itrFiling);

	    return "ITR Filing details updated successfully";
	}

	@Override
	public ItrFiling getItrFiling(String itrId) {

		ItrFiling itrFiling = itrFilingRepository.findById(itrId)
				.orElseThrow(() -> new ResourceNotFoundException("ITR Filing details not found with ITR ID: " + itrId));

		return itrFiling;
	}
}
