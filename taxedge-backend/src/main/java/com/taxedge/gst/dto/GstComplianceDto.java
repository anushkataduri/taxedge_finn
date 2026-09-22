////package com.taxedge.gst.dto;
////
////import java.time.LocalDate;
////
////import com.taxedge.gst.enums.ComplianceRequestType;
////
////import lombok.Data;
////
////@Data
////public class GstComplianceDto {
////
////    private Long id;
////
////    private String gstId;
////
////    private String financialYear;
////
////    private ComplianceRequestType requestType;
////
////    private String gstr2bNumber;
////
////    private String reconciliationFile1;
////
////    private String reconciliationFile2;
////
////    private String noticeNumber;
////
////    private LocalDate noticeIssueDate;
////
////    private LocalDate replyDueDate;
////
////    private String noticeFile;
////
////    private String message;
////}
//
//package com.taxedge.gst.dto;
//
//import java.time.LocalDate;
//
//import com.taxedge.gst.enums.ComplianceRequestType;
//
//import lombok.Data;
//
//@Data
//public class GstComplianceDto {
//
//   // private Long id;
//
//    private String gstId;
//
//    private String financialYear;
//
//    private ComplianceRequestType requestType;
//
//    private String gstr2bNumber;
//
//    private String reconciliationFile1;
//
//    private String reconciliationFile2;
//
//    private String noticeNumber;
//
//    private LocalDate noticeIssueDate;
//
//    private LocalDate replyDueDate;
//
//    private String noticeFile;
//
//    private String message;
//}

package com.taxedge.gst.dto;

import java.time.LocalDate;

import com.taxedge.gst.enums.ComplianceRequestType;

import lombok.Data;

@Data
public class GstComplianceDto {

    private String gstin;

    private String financialYear;

    private ComplianceRequestType requestType;

    private String gstr2bNumber;

    private String noticeNumber;

    private LocalDate noticeIssueDate;

    private LocalDate replyDueDate;

    private String message;
}