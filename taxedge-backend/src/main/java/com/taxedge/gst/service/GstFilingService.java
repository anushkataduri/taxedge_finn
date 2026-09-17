package com.taxedge.gst.service;

import java.util.List;

import com.taxedge.gst.dto.GstFilingDto;
import com.taxedge.gst.entity.GstFiling;

public interface GstFilingService {

    String createFiling(GstFilingDto gstFilingDto);

    List<GstFiling> getFilingsByGstId(String gstId);

    String updateFiling(String id, GstFilingDto gstFilingDto);

    String deleteFiling(String id);
}