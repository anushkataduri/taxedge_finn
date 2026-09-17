package com.taxedge.gst.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.entity.Documents;

public interface DocumentsService {

    String uploadFile( String gstId,String documentType, String addressProofType, MultipartFile file) throws IOException;

    String updateFile( String gstId,Long id,String addressProofType,MultipartFile file) throws IOException;

    String deleteFile(String gstId, Long id);

    List<Documents> getDocumentsByGstId(String gstId);
}