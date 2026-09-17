package com.taxedge.gst.entity;

import java.time.LocalDate;

import com.taxedge.gst.enums.ComplianceRequestType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gst_compliance")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GstCompliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gst_id", nullable = false, length = 15)
    private String gstId;

    @Column(name = "financial_year", nullable = false, length = 7)
    private String financialYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 50)
    private ComplianceRequestType requestType;

    @Column(name = "gstr_2b_number", length = 50 , nullable = false)
    private String gstr2bNumber;

    @Column(name = "reconciliation_file_1", columnDefinition = "TEXT" , nullable = false)
    private String reconciliationFile1;

    @Column(name = "reconciliation_file_2", columnDefinition = "TEXT", nullable = false)
    private String reconciliationFile2;

    @Column(name = "notice_number", length = 100, nullable = false)
    private String noticeNumber;

    @Column(name = "notice_issue_date", nullable = false)
    private LocalDate noticeIssueDate;

    @Column(name = "reply_due_date", nullable = false)
    private LocalDate replyDueDate;

    @Column(name = "notice_file", columnDefinition = "TEXT", nullable = false)
    private String noticeFile;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;
}