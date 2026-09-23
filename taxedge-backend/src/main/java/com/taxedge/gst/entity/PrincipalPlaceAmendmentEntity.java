package com.taxedge.gst.entity;

import jakarta.persistence.*;
import com.taxedge.gst.enums.AmendmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "principal_place_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrincipalPlaceAmendmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gst_id", nullable = false)
    private String gstId;

    // Snapshot of Current Details
    private String currentBusinessAddress;
    private String currentCity;
    private String currentDistrict;
    private String currentState;
    private String currentPinCode;

    // New Proposed Details
    @Column(nullable = false)
    private String newBusinessAddress;

    @Column(nullable = false)
    private String newCity;

    private String newDistrict;

    @Column(nullable = false)
    private String newState;

    @Column(nullable = false)
    private String newPinCode;

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
