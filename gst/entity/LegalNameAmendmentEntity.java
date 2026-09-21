package com.taxedge.gst.entity;

import jakarta.persistence.*;
import com.taxedge.gst.enums.AmendmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "legal_name_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalNameAmendmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gst_id", nullable = false)
    private String gstId;

    @Column(nullable = false)
    private String currentLegalName;

    @Column(nullable = false)
    private String newLegalName;

    private String fileName;
    private String fileType;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageData;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AmendmentStatus status;

    private LocalDateTime requestedAt;

    @PrePersist
    public void prePersist() {
        this.requestedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = AmendmentStatus.PENDING;
        }
    }
}
