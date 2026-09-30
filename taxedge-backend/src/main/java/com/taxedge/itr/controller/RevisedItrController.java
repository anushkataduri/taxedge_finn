package com.taxedge.itr.controller;
 
import java.io.IOException;
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
 
import com.taxedge.itr.dto.RevisedItrDto;
import com.taxedge.itr.dto.RevisedItrDetailsDto;
import com.taxedge.itr.dto.RevisedItrDocumentDto;
import com.taxedge.itr.dto.RevisionReasonDto;
 
import com.taxedge.itr.service.RevisedItrService;
import com.taxedge.itr.service.RevisedItrDetailsService;
import com.taxedge.itr.service.RevisedItrDocumentService;
import com.taxedge.itr.service.RevisionReasonService;
 
@RestController
@RequestMapping("/api/v1/itr/revised")
public class RevisedItrController {
 
    @Autowired
    private RevisedItrService revisedItrService;
 
    @Autowired
    private RevisedItrDetailsService revisedItrDetailsService;
 
    @Autowired
    private RevisedItrDocumentService revisedItrDocumentService;
 
    @Autowired
    private RevisionReasonService revisionReasonService;
 
    // ==========================================
    // 1. REVISED ITR ENDPOINTS
    // ==========================================
 
    @GetMapping("/{revisedItrId}")
    public ResponseEntity<RevisedItrDto> getRevisedItr(@PathVariable String revisedItrId) {
        RevisedItrDto revisedItr = revisedItrService.getRevisedItr(revisedItrId);
        return ResponseEntity.ok(revisedItr);
    }
 
    @PostMapping("/register")
    public ResponseEntity<String> registerRevisedItr(@RequestBody RevisedItrDto dto) {
        String result = revisedItrService.createRevisedItr(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
 
    @PutMapping("/update/{revisedItrId}")
    public ResponseEntity<String> updateRevisedItr(@PathVariable String revisedItrId, @RequestBody RevisedItrDto dto) {
        String result = revisedItrService.updateRevisedItr(revisedItrId, dto);
        return ResponseEntity.ok(result);
    }
 
 
    // ==========================================
    // 2. REVISED ITR DETAILS ENDPOINTS
    // ==========================================
 
    @GetMapping("/details/{detailsId}")
    public ResponseEntity<RevisedItrDetailsDto> getRevisedItrDetails(@PathVariable String detailsId) {
        RevisedItrDetailsDto details = revisedItrDetailsService.getRevisedItrDetails(detailsId);
        return ResponseEntity.ok(details);
    }
 
    @PostMapping("/details/register")
    public ResponseEntity<String> registerRevisedItrDetails(@RequestBody RevisedItrDetailsDto dto) {
        String result = revisedItrDetailsService.createRevisedItrDetails(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
 
    @PutMapping("/details/update/{detailsId}")
    public ResponseEntity<String> updateRevisedItrDetails(@PathVariable String detailsId, @RequestBody RevisedItrDetailsDto dto) {
        String result = revisedItrDetailsService.updateRevisedItrDetails(detailsId, dto);
        return ResponseEntity.ok(result);
    }
 
 
    // ==========================================
    // 3. REVISED ITR DOCUMENTS ENDPOINTS
    // ==========================================
 
    @PostMapping("/{revisedItrId}/document/register")
    public ResponseEntity<String> registerDocument(
            @PathVariable String revisedItrId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) throws IOException {
 
        String result = revisedItrDocumentService.registerDocument(revisedItrId, documentType, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
 
    @GetMapping("/document/{documentId}")
    public ResponseEntity<RevisedItrDocumentDto> getDocument(@PathVariable String documentId) {
        RevisedItrDocumentDto document = revisedItrDocumentService.getDocument(documentId);
        return ResponseEntity.ok(document);
    }
 
    @GetMapping("/{revisedItrId}/documents")
    public ResponseEntity<List<RevisedItrDocumentDto>> getDocuments(@PathVariable String revisedItrId) {
        List<RevisedItrDocumentDto> documents = revisedItrDocumentService.getDocuments(revisedItrId);
        return ResponseEntity.ok(documents);
    }
 
    @PutMapping("/document/update/{documentId}")
    public ResponseEntity<String> updateDocument(
            @PathVariable String documentId,
            @RequestParam("file") MultipartFile file) throws IOException {
 
        String result = revisedItrDocumentService.updateDocument(documentId, file);
        return ResponseEntity.ok(result);
    }
 
    @DeleteMapping("/document/delete/{documentId}")
    public ResponseEntity<String> deleteDocument(@PathVariable String documentId) {
        String result = revisedItrDocumentService.deleteDocument(documentId);
        return ResponseEntity.ok(result);
    }
 
 
    // ==========================================
    // 4. REVISION REASON ENDPOINTS
    // ==========================================
 
    @GetMapping("/reason/{revisionReasonId}")
    public ResponseEntity<RevisionReasonDto> getRevisionReason(@PathVariable String revisionReasonId) {
        RevisionReasonDto revisionReason = revisionReasonService.getRevisionReason(revisionReasonId);
        return ResponseEntity.ok(revisionReason);
    }
 
    @PostMapping("/reason/register")
    public ResponseEntity<String> registerRevisionReason(@RequestBody RevisionReasonDto dto) {
        String result = revisionReasonService.createRevisionReason(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
 
    @PutMapping("/reason/update/{revisionReasonId}")
    public ResponseEntity<String> updateRevisionReason(
            @PathVariable String revisionReasonId,
            @RequestBody RevisionReasonDto dto) {
        String result = revisionReasonService.updateRevisionReason(revisionReasonId, dto);
        return ResponseEntity.ok(result);
    }
}