package com.taxedge.gst.entity;

import java.time.LocalDate;

import com.taxedge.gst.enums.ComplianceRequestType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "gst_compliance")
@Data
public class GstCompliance {

    @Id
    @Column(name = "id", nullable = false, unique = true, length = 9)
    private String id;

    @Column(name = "gstin", nullable = false, length = 15)
    private String gstin;

    @Column(name = "financial_year", nullable = false, length = 7)
    private String financialYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false, length = 50)
    private ComplianceRequestType requestType;

    @Column(name = "gstr_2b_number", length = 50)
    private String gstr2bNumber;

    @Column(name = "reconciliation_file_1", columnDefinition = "LONGTEXT")
    private String reconciliationFile1;

    @Column(name = "reconciliation_file_2", columnDefinition = "LONGTEXT")
    private String reconciliationFile2;

    @Column(name = "notice_number", length = 100)
    private String noticeNumber;

    @Column(name = "notice_issue_date")
    private LocalDate noticeIssueDate;

    @Column(name = "reply_due_date")
    private LocalDate replyDueDate;

    @Column(name = "notice_file", columnDefinition = "LONGTEXT")
    private String noticeFile;

    @Column(name = "message", columnDefinition = "LONGTEXT")
    private String message;
}
