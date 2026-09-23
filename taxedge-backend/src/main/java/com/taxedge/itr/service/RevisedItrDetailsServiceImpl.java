package com.taxedge.itr.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.dto.RevisedItrDetailsDto;
import com.taxedge.itr.entity.RevisedItrDetails;
import com.taxedge.itr.helper.RandomNumberGenerator;
import com.taxedge.itr.repository.RevisedItrDetailsRepository;

@Service
public class RevisedItrDetailsServiceImpl implements RevisedItrDetailsService {

	@Autowired
	private RevisedItrDetailsRepository revisedItrDetailsRepository;

	@Autowired
	@Qualifier("itrModelMapper")
	private ModelMapper modelMapper;

	@Override
	public String createRevisedItrDetails(RevisedItrDetailsDto dto) {

		RevisedItrDetails details = modelMapper.map(dto, RevisedItrDetails.class);

		String detailsId = RandomNumberGenerator.generateRevisedItrDetailsId();

		details.setDetailsId(detailsId);

		revisedItrDetailsRepository.save(details);

		return "Revised ITR details registered successfully. Details ID: " + detailsId;
	}

	@Override
	public String updateRevisedItrDetails(String detailsId, RevisedItrDetailsDto dto) {

		RevisedItrDetails details = revisedItrDetailsRepository.findById(detailsId).orElseThrow(
				() -> new ResourceNotFoundException("Revised ITR details not found with detailsId: " + detailsId));

		modelMapper.map(dto, details);

		revisedItrDetailsRepository.save(details);

		return "Revised ITR details updated successfully";
	}

	@Override
	public RevisedItrDetailsDto getRevisedItrDetails(String detailsId) {

		RevisedItrDetails details = revisedItrDetailsRepository.findById(detailsId).orElseThrow(
				() -> new ResourceNotFoundException("Revised ITR details not found with detailsId: " + detailsId));

		return modelMapper.map(details, RevisedItrDetailsDto.class);
	}
}