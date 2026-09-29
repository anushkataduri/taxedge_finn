package com.taxedge.itr.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.dto.RevisedItrDto;
import com.taxedge.itr.entity.RevisedItr;
import com.taxedge.itr.helper.RandomNumberGenerator;
import com.taxedge.itr.repository.RevisedItrRepository;

@Service
public class RevisedItrServiceImpl implements RevisedItrService {

	@Autowired
	private RevisedItrRepository revisedItrRepository;

	@Autowired
	@Qualifier("itrModelMapper")
	private ModelMapper modelMapper;

	@Override
	public String createRevisedItr(RevisedItrDto dto) {

		RevisedItr revisedItr = modelMapper.map(dto, RevisedItr.class);

		String revisedItrId = RandomNumberGenerator.generateRevisedItrId();

		revisedItr.setRevisedItrId(revisedItrId);

		revisedItrRepository.save(revisedItr);

		return "Revised ITR details registered successfully. Revised ITR ID: " + revisedItrId;
	}

	@Override
	public String updateRevisedItr(String revisedItrId, RevisedItrDto dto) {

		RevisedItr revisedItr = revisedItrRepository.findById(revisedItrId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Revised ITR details not found with revisedItrId: " + revisedItrId));

		modelMapper.map(dto, revisedItr);

		revisedItrRepository.save(revisedItr);

		return "Revised ITR details updated successfully";
	}

	@Override
	public RevisedItrDto getRevisedItr(String revisedItrId) {

		RevisedItr revisedItr = revisedItrRepository.findById(revisedItrId)
				.orElseThrow(() -> new ResourceNotFoundException(
						"Revised ITR details not found with revisedItrId: " + revisedItrId));

		return modelMapper.map(revisedItr, RevisedItrDto.class);
	}
}