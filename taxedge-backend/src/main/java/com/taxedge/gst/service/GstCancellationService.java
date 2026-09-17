package com.taxedge.gst.service;

import java.io.IOException;

import com.taxedge.gst.dto.GstCancellationDto;
import com.taxedge.gst.entity.GstCancellation;

public interface GstCancellationService {

    String createCancellation(
            GstCancellationDto gstCancellationDto)
            throws IOException;

    GstCancellation getCancellation(String gstId);
}