package com.taxedge.itr.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.dto.ItrFilingPostDto;
import com.taxedge.itr.entity.ItrFiling;
import com.taxedge.itr.helper.RandomNumberGenerator;
import com.taxedge.itr.repository.ItrFilingRepository;
import com.taxedge.itr.service.ItrFilingService;

@Service
public class ItrFilingServiceImpl implements ItrFilingService {

    @Autowired
    private ItrFilingRepository itrFilingRepository;

    @Autowired
    @Qualifier("itrModelMapper")
    private ModelMapper modelMapper;

    @Override
    public String createItrFiling(ItrFilingPostDto dto) {

        ItrFiling itrFiling = modelMapper.map(dto, ItrFiling.class);

        String itrId = RandomNumberGenerator.generateItrId();

        itrFiling.setItrId(itrId);

        itrFilingRepository.save(itrFiling);

        return "ITR Filing details registered successfully. ITR ID: " + itrId;
    }

    @Override
    public String updateItrFiling(
            String itrId,
            ItrFilingPostDto dto) {

        ItrFiling itrFiling = itrFilingRepository.findById(itrId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "ITR Filing details not found with ITR ID: " + itrId));

        modelMapper.map(dto, itrFiling);

        itrFilingRepository.save(itrFiling);

        return "ITR Filing details updated successfully";
    }

    @Override
    public ItrFiling getItrFiling(String itrId) {

        ItrFiling itrFiling = itrFilingRepository.findById(itrId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "ITR Filing details not found with ITR ID: " + itrId));

        return itrFiling;
    }
}