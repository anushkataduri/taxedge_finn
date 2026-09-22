package com.taxedge.gst.controller;

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

import com.taxedge.gst.dto.GstFilingDocumentsDto;
import com.taxedge.gst.service.GstFilingDocumentsService;

@RestController
@RequestMapping("/gst/filing/documents")
public class GstFilingDocumentsController {

    @Autowired
    private GstFilingDocumentsService documentsService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocument(
            @RequestParam("filingId") String filingId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        String result =
                documentsService.uploadDocument(
                        filingId,
                        documentType,
                        file);

        return new ResponseEntity<>(
                result,
                HttpStatus.CREATED);
    }

    @GetMapping("/{filingId}")
    public ResponseEntity<List<GstFilingDocumentsDto>> getDocuments(
            @PathVariable String filingId) {

        List<GstFilingDocumentsDto> documents =
                documentsService.getDocuments(filingId);

        return ResponseEntity.ok(documents);
    }

    @PutMapping("/{filingId}/{id}")
    public ResponseEntity<String> updateDocument(
            @PathVariable String filingId,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        String result =
                documentsService.updateDocument(
                        filingId,
                        id,
                        file);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{filingId}/{id}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable String filingId,
            @PathVariable Long id) {

        String result =
                documentsService.deleteDocument(
                        filingId,
                        id);

        return ResponseEntity.ok(result);
    }
}