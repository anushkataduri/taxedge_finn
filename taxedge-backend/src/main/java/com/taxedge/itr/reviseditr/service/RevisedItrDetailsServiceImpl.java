package com.taxedge.itr.reviseditr.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.reviseditr.dto.RevisedItrDetailsDto;
import com.taxedge.itr.reviseditr.entity.RevisedItr;
import com.taxedge.itr.reviseditr.entity.RevisedItrDetails;
import com.taxedge.itr.reviseditr.helper.RevisedItrRandomNumberGenerator;
import com.taxedge.itr.reviseditr.repository.RevisedItrDetailsRepository;
import com.taxedge.itr.reviseditr.repository.RevisedItrRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RevisedItrDetailsServiceImpl implements RevisedItrDetailsService {

	
	private final  RevisedItrDetailsRepository revisedItrDetailsRepository;

	
	private final RevisedItrRepository revisedItrRepository;

	@Autowired
	@Qualifier("itrModelMapper")
	private ModelMapper modelMapper;

	@Override
	public String createRevisedItrDetails(RevisedItrDetailsDto dto) {

		RevisedItr revisedItr = revisedItrRepository.findById(dto.getRevisedItrId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Revised ITR not found with revisedItrId: " + dto.getRevisedItrId()));

		RevisedItrDetails details = modelMapper.map(dto, RevisedItrDetails.class);

		details.setRevisedItr(revisedItr);

		String detailsId = RevisedItrRandomNumberGenerator.generateRevisedItrDetailsId();

		details.setDetailsId(detailsId);

		revisedItrDetailsRepository.save(details);

		return "Revised ITR details registered successfully. Details ID: " + detailsId;
	}

	@Override
	public String updateRevisedItrDetails(String detailsId, RevisedItrDetailsDto dto) {

	    RevisedItrDetails details = revisedItrDetailsRepository.findById(detailsId)
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "Revised ITR details not found with detailsId: " + detailsId));

	    modelMapper.typeMap(RevisedItrDetailsDto.class, RevisedItrDetails.class)
	            .addMappings(mapper -> {
	                mapper.skip(RevisedItrDetails::setDetailsId);
	                mapper.skip(RevisedItrDetails::setRevisedItr);
	            });

	    modelMapper.map(dto, details);

	    revisedItrDetailsRepository.save(details);

	    return "Revised ITR details updated successfully";
	}

	@Override
	public RevisedItrDetailsDto getRevisedItrDetails(String detailsId) {

		RevisedItrDetails details = revisedItrDetailsRepository.findById(detailsId).orElseThrow(
				() -> new ResourceNotFoundException("Revised ITR details not found with detailsId: " + detailsId));

		RevisedItrDetailsDto dto = modelMapper.map(details, RevisedItrDetailsDto.class);

		dto.setRevisedItrId(details.getRevisedItr().getRevisedItrId());

		return dto;
	}
}
