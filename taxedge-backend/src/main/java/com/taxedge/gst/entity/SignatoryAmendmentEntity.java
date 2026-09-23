package com.taxedge.gst.entity;

import jakarta.persistence.*;
import com.taxedge.gst.enums.AmendmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "signatory_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignatoryAmendmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gst_id", nullable = false)
    private String gstId;

    private String currentSignatoryName;
    private String currentSignatoryPan;
    private LocalDate currentSignatoryDob;
    private String currentDesignation;
    private String currentSignatoryMobile;
    private String currentSignatoryEmail;

    @Column(nullable = false)
    private String newSignatoryName;
    @Column(nullable = false)
    private String newSignatoryPan;
    private LocalDate newSignatoryDob;
    private String newDesignation;
    private String newSignatoryMobile;
    private String newSignatoryEmail;

    private String fileName;
    private String fileType;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageData;
    @Enumerated(EnumType.STRING)
    private AmendmentStatus status;
    private LocalDateTime requestedAt;

    @PrePersist
    public void prePersist() {
        this.requestedAt = LocalDateTime.now();
        if (this.status == null) this.status = AmendmentStatus.PENDING;
    }
}
