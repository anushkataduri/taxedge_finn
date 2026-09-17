package com.taxedge.gst.service;

import com.taxedge.gst.dto.BusinessDto;

public interface BusinessService {

	String registerBusiness(BusinessDto businessDto);

	String updateBusiness(String gstId, BusinessDto businessDto);

	BusinessDto getBusinessId(String gstId);
}