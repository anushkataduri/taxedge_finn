//package com.taxedge.gst.controller;
//
//import java.io.IOException;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.taxedge.gst.dto.GstComplianceDto;
//import com.taxedge.gst.entity.GstCompliance;
//import com.taxedge.gst.service.GstComplianceService;
//
//@RestController
//@RequestMapping("/gst/compliance")
//public class GstComplianceController {
//    
//	@Autowired
//    private GstComplianceService complianceService;
//
//
//    @PostMapping("/create")
//    public ResponseEntity<String> createCompliance(@RequestParam("gstId") String gstId,@RequestParam("financialYear") String financialYear,@RequestParam("requestType") String requestType,@RequestParam(value = "gstr2bNumber",required = false) String gstr2bNumber,@RequestParam(value = "reconciliationFile1",required = false) MultipartFile reconciliationFile1,@RequestParam(value = "reconciliationFile2",required = false) MultipartFile reconciliationFile2,@RequestParam(value = "noticeNumber",required = false) String noticeNumber,@RequestParam(value = "noticeIssueDate",required = false) String noticeIssueDate,@RequestParam(value = "replyDueDate",required = false) String replyDueDate,@RequestParam(value = "noticeFile",required = false) MultipartFile noticeFile,@RequestParam("message") String message) throws IOException {
//
//        String result =
//                complianceService.createCompliance(
//                        gstId,
//                        financialYear,
//                        requestType,
//                        gstr2bNumber,
//                        reconciliationFile1,
//                        reconciliationFile2,
//                        noticeNumber,
//                        noticeIssueDate,
//                        replyDueDate,
//                        noticeFile,
//                        message);
//
//        return new ResponseEntity<>(result,HttpStatus.CREATED);
//    }
//
////    @GetMapping("/{gstId}")
////    public ResponseEntity<List<GstComplianceDto>> getComplianceByGstId(@PathVariable String gstId) {
////
////        List<GstCompliance> compliance =
////                complianceService.getComplianceByGstId(gstId);
////
////        return ResponseEntity.ok(compliance);
////    }
//    
//    @GetMapping("/{gstId}")
//    public ResponseEntity<List<GstComplianceDto>> getComplianceByGstId(
//            @PathVariable String gstId) {
//
//        List<GstComplianceDto> compliance =
//        		complianceService.getComplianceByGstId(gstId);
//
//        return ResponseEntity.ok(compliance);
//    }
//
//    @PutMapping("/{gstId}/{id}")
//    public ResponseEntity<String> updateCompliance(@PathVariable String gstId,@PathVariable Long id,@RequestParam("financialYear") String financialYear,@RequestParam("requestType") String requestType,@RequestParam(value = "gstr2bNumber",required = false) String gstr2bNumber,@RequestParam(value = "reconciliationFile1",required = false) MultipartFile reconciliationFile1,@RequestParam(value = "reconciliationFile2",required = false) MultipartFile reconciliationFile2,@RequestParam(value = "noticeNumber",required = false) String noticeNumber,@RequestParam(value = "noticeIssueDate",required = false) String noticeIssueDate,@RequestParam(value = "replyDueDate",required = false) String replyDueDate,@RequestParam(value = "noticeFile",required = false) MultipartFile noticeFile,@RequestParam("message") String message) throws IOException {
//
//        String result =
//                complianceService.updateCompliance(
//                        gstId,
//                        id,
//                        financialYear,
//                        requestType,
//                        gstr2bNumber,
//                        reconciliationFile1,
//                        reconciliationFile2,
//                        noticeNumber,
//                        noticeIssueDate,
//                        replyDueDate,
//                        noticeFile,
//                        message);
//
//        return ResponseEntity.ok(result);
//    }
//
//    @DeleteMapping("/{gstId}/{id}")
//    public ResponseEntity<String> deleteCompliance(@PathVariable String gstId,@PathVariable Long id) {
//
//        String result =
//                complianceService.deleteCompliance(
//                        gstId,
//                        id);
//
//        return ResponseEntity.ok(result);
//    }
//}

//package com.taxedge.gst.controller;
//
//import java.io.IOException;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.taxedge.gst.dto.GstComplianceDto;
//import com.taxedge.gst.service.GstComplianceService;
//
//@RestController
//@RequestMapping("/gst/compliance")
//public class GstComplianceController {
//
//    @Autowired
//    private GstComplianceService complianceService;
//
//    @PostMapping("/create")
//    public ResponseEntity<String> createCompliance(
//            @RequestParam("gstId") String gstId,
//            @RequestParam("financialYear") String financialYear,
//            @RequestParam("requestType") String requestType,
//            @RequestParam(value = "gstr2bNumber", required = false) String gstr2bNumber,
//            @RequestParam(value = "reconciliationFile1", required = false) MultipartFile reconciliationFile1,
//            @RequestParam(value = "reconciliationFile2", required = false) MultipartFile reconciliationFile2,
//            @RequestParam(value = "noticeNumber", required = false) String noticeNumber,
//            @RequestParam(value = "noticeIssueDate", required = false) String noticeIssueDate,
//            @RequestParam(value = "replyDueDate", required = false) String replyDueDate,
//            @RequestParam(value = "noticeFile", required = false) MultipartFile noticeFile,
//            @RequestParam(value = "message", required = false) String message) throws IOException {
//
//        String result = complianceService.createCompliance(
//                gstId,
//                financialYear,
//                requestType,
//                gstr2bNumber,
//                reconciliationFile1,
//                reconciliationFile2,
//                noticeNumber,
//                noticeIssueDate,
//                replyDueDate,
//                noticeFile,
//                message);
//
//        return new ResponseEntity<>(result, HttpStatus.CREATED);
//    }
//
//    @GetMapping("/{gstId}")
//    public ResponseEntity<List<GstComplianceDto>> getComplianceByGstId(
//            @PathVariable String gstId) {
//
//        List<GstComplianceDto> compliance =
//                complianceService.getComplianceByGstId(gstId);
//
//        return ResponseEntity.ok(compliance);
//    }
//
//    @PutMapping("/{gstId}/{id}")
//    public ResponseEntity<String> updateCompliance(
//            @PathVariable String gstId,
//            @PathVariable String id,
//            @RequestParam("financialYear") String financialYear,
//            @RequestParam("requestType") String requestType,
//            @RequestParam(value = "gstr2bNumber", required = false) String gstr2bNumber,
//            @RequestParam(value = "reconciliationFile1", required = false) MultipartFile reconciliationFile1,
//            @RequestParam(value = "reconciliationFile2", required = false) MultipartFile reconciliationFile2,
//            @RequestParam(value = "noticeNumber", required = false) String noticeNumber,
//            @RequestParam(value = "noticeIssueDate", required = false) String noticeIssueDate,
//            @RequestParam(value = "replyDueDate", required = false) String replyDueDate,
//            @RequestParam(value = "noticeFile", required = false) MultipartFile noticeFile,
//            @RequestParam(value = "message", required = false) String message) throws IOException {
//
//        String result = complianceService.updateCompliance(
//                gstId,
//                id,
//                financialYear,
//                requestType,
//                gstr2bNumber,
//                reconciliationFile1,
//                reconciliationFile2,
//                noticeNumber,
//                noticeIssueDate,
//                replyDueDate,
//                noticeFile,
//                message);
//
//        return ResponseEntity.ok(result);
//    }
//
//    @DeleteMapping("/{gstId}/{id}")
//    public ResponseEntity<String> deleteCompliance(
//            @PathVariable String gstId,
//            @PathVariable String id) {
//
//        String result = complianceService.deleteCompliance(gstId, id);
//
//        return ResponseEntity.ok(result);
//    }
//}

package com.taxedge.gst.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taxedge.gst.dto.GstComplianceDto;
import com.taxedge.gst.service.GstComplianceService;

@RestController
@RequestMapping("/gst/compliance")
public class GstComplianceController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GstComplianceService complianceService;

    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createCompliance(

            @RequestPart("data") String data,

            @RequestPart(value = "reconciliationFile1", required = false)
            MultipartFile reconciliationFile1,

            @RequestPart(value = "reconciliationFile2", required = false)
            MultipartFile reconciliationFile2,

            @RequestPart(value = "noticeFile", required = false)
            MultipartFile noticeFile) throws IOException {

        GstComplianceDto dto =
                objectMapper.readValue(data, GstComplianceDto.class);

        String result = complianceService.createCompliance(
                dto,
                reconciliationFile1,
                reconciliationFile2,
                noticeFile);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/{gstin}")
    public ResponseEntity<List<GstComplianceDto>> getComplianceByGstin(
            @PathVariable String gstin) {

        List<GstComplianceDto> compliance =
                complianceService.getComplianceByGstin(gstin);

        return ResponseEntity.ok(compliance);
    }

    @PutMapping(
            value = "/{gstin}/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateCompliance(

            @PathVariable String gstin,

            @PathVariable String id,

            @RequestPart("data") String data,

            @RequestPart(value = "reconciliationFile1", required = false)
            MultipartFile reconciliationFile1,

            @RequestPart(value = "reconciliationFile2", required = false)
            MultipartFile reconciliationFile2,

            @RequestPart(value = "noticeFile", required = false)
            MultipartFile noticeFile) throws IOException {

        GstComplianceDto dto =
                objectMapper.readValue(data, GstComplianceDto.class);

        String result = complianceService.updateCompliance(
                gstin,
                id,
                dto,
                reconciliationFile1,
                reconciliationFile2,
                noticeFile);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{gstin}/{id}")
    public ResponseEntity<String> deleteCompliance(
            @PathVariable String gstin,
            @PathVariable String id) {

        String result =
                complianceService.deleteCompliance(gstin, id);

        return ResponseEntity.ok(result);
    }
}