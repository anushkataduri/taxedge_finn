package com.taxedge.gst.entity;

import jakarta.persistence.*;
import com.taxedge.gst.enums.AmendmentStatus;
import com.taxedge.gst.enums.NatureOfBusiness;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "additional_place_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdditionalPlaceAmendmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String gstId;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String pinCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NatureOfBusiness natureOfBusiness;

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
