package com.taxedge.gst.service;

import com.taxedge.gst.dto.AdditionalPlaceAmendmentViewDto;
import com.taxedge.gst.enums.NatureOfBusiness;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface AdditionalPlaceAmendmentService {

    List<AdditionalPlaceAmendmentViewDto> getExistingAdditionalPlaces(String gstId);

    List<AdditionalPlaceAmendmentViewDto> getNewAmendmentPlaces(String gstId);

    String submitAdditionalPlace(String gstId, String address, String city, String pinCode,
                                 NatureOfBusiness natureOfBusiness, MultipartFile file) throws IOException;
}
