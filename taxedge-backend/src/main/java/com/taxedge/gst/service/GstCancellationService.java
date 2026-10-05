package com.taxedge.gst.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.GstCancellationDto;
import com.taxedge.gst.entity.GstCancellation;

public interface GstCancellationService {

	String createCancellation(GstCancellationDto gstCancellationDto, MultipartFile supportingProofDocument)
			throws IOException;

	GstCancellation getCancellation(String cancellationId);
}