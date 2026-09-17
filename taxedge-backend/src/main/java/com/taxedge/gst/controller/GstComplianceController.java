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

import com.taxedge.gst.entity.GstCompliance;
import com.taxedge.gst.service.GstComplianceService;

@RestController
@RequestMapping("/gst/compliance")
public class GstComplianceController {
    
	@Autowired
    private GstComplianceService complianceService;


    @PostMapping("/create")
    public ResponseEntity<String> createCompliance(@RequestParam("gstId") String gstId,@RequestParam("financialYear") String financialYear,@RequestParam("requestType") String requestType,@RequestParam(value = "gstr2bNumber",required = false) String gstr2bNumber,@RequestParam(value = "reconciliationFile1",required = false) MultipartFile reconciliationFile1,@RequestParam(value = "reconciliationFile2",required = false) MultipartFile reconciliationFile2,@RequestParam(value = "noticeNumber",required = false) String noticeNumber,@RequestParam(value = "noticeIssueDate",required = false) String noticeIssueDate,@RequestParam(value = "replyDueDate",required = false) String replyDueDate,@RequestParam(value = "noticeFile",required = false) MultipartFile noticeFile,@RequestParam("message") String message) throws IOException {

        String result =
                complianceService.createCompliance(
                        gstId,
                        financialYear,
                        requestType,
                        gstr2bNumber,
                        reconciliationFile1,
                        reconciliationFile2,
                        noticeNumber,
                        noticeIssueDate,
                        replyDueDate,
                        noticeFile,
                        message);

        return new ResponseEntity<>(result,HttpStatus.CREATED);
    }

    @GetMapping("/{gstId}")
    public ResponseEntity<List<GstCompliance>> getComplianceByGstId(@PathVariable String gstId) {

        List<GstCompliance> compliance =
                complianceService.getComplianceByGstId(gstId);

        return ResponseEntity.ok(compliance);
    }

    @PutMapping("/{gstId}/{id}")
    public ResponseEntity<String> updateCompliance(@PathVariable String gstId,@PathVariable Long id,@RequestParam("financialYear") String financialYear,@RequestParam("requestType") String requestType,@RequestParam(value = "gstr2bNumber",required = false) String gstr2bNumber,@RequestParam(value = "reconciliationFile1",required = false) MultipartFile reconciliationFile1,@RequestParam(value = "reconciliationFile2",required = false) MultipartFile reconciliationFile2,@RequestParam(value = "noticeNumber",required = false) String noticeNumber,@RequestParam(value = "noticeIssueDate",required = false) String noticeIssueDate,@RequestParam(value = "replyDueDate",required = false) String replyDueDate,@RequestParam(value = "noticeFile",required = false) MultipartFile noticeFile,@RequestParam("message") String message) throws IOException {

        String result =
                complianceService.updateCompliance(
                        gstId,
                        id,
                        financialYear,
                        requestType,
                        gstr2bNumber,
                        reconciliationFile1,
                        reconciliationFile2,
                        noticeNumber,
                        noticeIssueDate,
                        replyDueDate,
                        noticeFile,
                        message);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{gstId}/{id}")
    public ResponseEntity<String> deleteCompliance(@PathVariable String gstId,@PathVariable Long id) {

        String result =
                complianceService.deleteCompliance(
                        gstId,
                        id);

        return ResponseEntity.ok(result);
    }
}