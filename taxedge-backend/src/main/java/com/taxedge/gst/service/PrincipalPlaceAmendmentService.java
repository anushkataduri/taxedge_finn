package com.taxedge.gst.service;

import com.taxedge.gst.dto.PrincipalPlaceAmendmentViewDto;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface PrincipalPlaceAmendmentService {

    PrincipalPlaceAmendmentViewDto getAmendmentDetails(String gstId);

    String submitAmendment(String gstId, String address, String city, String district,
                           String state, String pinCode, MultipartFile file) throws IOException;
}
