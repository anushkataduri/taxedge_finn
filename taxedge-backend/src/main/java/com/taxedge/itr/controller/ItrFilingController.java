package com.taxedge.itr.controller;
 
import java.io.IOException;
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
 
import com.taxedge.itr.dto.DocumentDto;
import com.taxedge.itr.dto.ItrFilingPostDto;
import com.taxedge.itr.dto.SalaryIncomeDto;
import com.taxedge.itr.entity.ItrFiling;
import com.taxedge.itr.service.ItrDocumentService;
import com.taxedge.itr.service.ItrFilingService;
import com.taxedge.itr.service.SalaryIncomeService;
 
@RestController
@RequestMapping("/api/v1/itr")
public class ItrFilingController {
 
    @Autowired
    private ItrFilingService itrFilingService;
 
    @Autowired
    private ItrDocumentService itrDocumentService;
 
    @Autowired
    private SalaryIncomeService salaryIncomeService;
 
    // ==========================================
    // 1. ITR FILING ENDPOINTS
    // ==========================================
 
    @GetMapping("/filing/{itrId}")
    public ResponseEntity<ItrFiling> getItrFiling(
            @PathVariable String itrId) {
        ItrFiling itrFiling = itrFilingService.getItrFiling(itrId);
        return ResponseEntity.ok(itrFiling);
    }
 
    @PostMapping("/filing/register")
    public ResponseEntity<String> registerItrFiling(
            @RequestBody ItrFilingPostDto dto) {
        String result = itrFilingService.createItrFiling(dto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
 
    @PutMapping("/filing/update/{itrId}")
    public ResponseEntity<String> updateItrFiling(
            @PathVariable String itrId,
            @RequestBody ItrFilingPostDto dto) {
        String result = itrFilingService.updateItrFiling(itrId, dto);
        return ResponseEntity.ok(result);
    }
 
    // ==========================================
    // 2. ITR DOCUMENT ENDPOINTS
    // ==========================================
 
    @PostMapping("/{itrId}/document/register")
    public ResponseEntity<String> registerDocument(
            @PathVariable String itrId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) throws IOException {
        String result = itrDocumentService.registerDocument(itrId, documentType, file);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
 
    @GetMapping("/document/{documentId}")
    public ResponseEntity<DocumentDto> getDocument(
            @PathVariable String documentId) {
        DocumentDto document = itrDocumentService.getDocument(documentId);
        return ResponseEntity.ok(document);
    }
 
    @PutMapping("/document/update/{documentId}")
    public ResponseEntity<String> updateDocument(
            @PathVariable String documentId,
            @RequestParam("file") MultipartFile file) throws IOException {
        String result = itrDocumentService.updateDocument(documentId, file);
        return ResponseEntity.ok(result);
    }
   
    @GetMapping("/{itrId}/documents")
    public ResponseEntity<List<DocumentDto>> getDocuments(
            @PathVariable String itrId) {
        List<DocumentDto> documents = itrDocumentService.getDocuments(itrId);
        return ResponseEntity.ok(documents);
    }
 
    // ==========================================
    // 3. SALARY INCOME ENDPOINTS
    // ==========================================
 
    @PostMapping("/{itrId}/salary-income/register")
    public ResponseEntity<String> registerSalaryIncome(
            @PathVariable String itrId,
            @RequestBody SalaryIncomeDto salaryIncomeDto) {
        String result = salaryIncomeService.registerSalaryIncome(itrId, salaryIncomeDto);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
 
    @GetMapping("/salary-income/{incomeId}")
    public ResponseEntity<SalaryIncomeDto> getSalaryIncome(
            @PathVariable String incomeId) {
        SalaryIncomeDto salaryIncome = salaryIncomeService.getSalaryIncome(incomeId);
        return ResponseEntity.ok(salaryIncome);
    }
 
    @PutMapping("/salary-income/update/{incomeId}")
    public ResponseEntity<String> updateSalaryIncome(
            @PathVariable String incomeId,
            @RequestBody SalaryIncomeDto salaryIncomeDto) {
        String result = salaryIncomeService.updateSalaryIncome(incomeId, salaryIncomeDto);
        return ResponseEntity.ok(result);
    }
}