package com.taxedge.gst.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.gst.dto.BusinessDto;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.helper.RandomNumberGenerator;
import com.taxedge.gst.repository.BusinessRepository;

@Service
public class BusinessServiceImpl implements BusinessService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private ModelMapper modelMapper;
//    @Override
//    public List<Documents> getDocumentsByBusinessId(String businessId) {
//
//        businessRepository.findById(businessId)
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Business not found with businessId: " + businessId));
//
//        return documentsRepository.findByBusinessId(businessId);
//    }
    
    @Override
    public String registerBusiness(BusinessDto businessDto) {

        Business business = modelMapper.map(businessDto, Business.class);

        String businessId = RandomNumberGenerator.generateGstId();

        business.setGstId(businessId);

        businessRepository.save(business);

        return "Business details registered successfully. Business ID: " + businessId;
    }

    @Override
    public String updateBusiness(String gstId, BusinessDto businessDto) {

        Business business = businessRepository.findById(gstId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business details not found with businessId: " + gstId));

        modelMapper.map(businessDto, business);

      //  business.setGstId(gstId);

        businessRepository.save(business);

        return "Business details updated successfully";
    }

    @Override
    public BusinessDto getBusinessId(String businessId) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Business details not found with businessId: " + businessId));

        return modelMapper.map(business, BusinessDto.class);
    }
}