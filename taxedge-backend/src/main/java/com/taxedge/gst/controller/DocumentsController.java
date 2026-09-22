package com.taxedge.gst.controller;

import org.springframework.http.MediaType;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.gst.dto.DocumentsDto;
import com.taxedge.gst.entity.Documents;
import com.taxedge.gst.service.DocumentsService;

@RestController
@RequestMapping("/gst/documents")
public class DocumentsController {
    
	@Autowired
    private DocumentsService documentsService;

	//@Operation(summary = "Upload a document file (PDF/image)")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(
            @RequestParam("gstId") String gstId,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "addressProofType", required = false) String addressProofType,
            @RequestParam("file") MultipartFile file) throws IOException {

        String result =
                documentsService.uploadFile(gstId,
                        documentType,
                        addressProofType,
                        file);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/{gstId}")
    public ResponseEntity<List<DocumentsDto>> getDocumentsByGstId(
            @PathVariable String gstId) {

        List<DocumentsDto> documents =
                documentsService.getDocumentsByGstId(gstId);

        return ResponseEntity.ok(documents);
    }
    
   // @Operation(summary = "Update an existing document file")
    @PutMapping("/{gstId}/{id}")
    public ResponseEntity<String> updateFile(
            @PathVariable String gstId,
            @PathVariable Long id,
            @RequestParam(value = "addressProofType", required = false) String addressProofType,
            @RequestParam("file") MultipartFile file) throws IOException {

        String result =
                documentsService.updateFile(
                        gstId,
                        id,
                        addressProofType,
                        file);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{gstId}/{id}")
    public ResponseEntity<String> deleteFile(
            @PathVariable String gstId,
            @PathVariable Long id) {

        String result =
                documentsService.deleteFile(
                        gstId,
                        id);

        return ResponseEntity.ok(result);
    }
}