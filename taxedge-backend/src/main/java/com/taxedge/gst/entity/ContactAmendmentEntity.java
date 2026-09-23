package com.taxedge.gst.entity;

import com.taxedge.gst.enums.AmendmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactAmendmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gst_id", nullable = false)
    private String gstId;

    @Column(name = "current_mobile_number")
    private String currentMobileNumber;

    @Column(name = "current_email")
    private String currentEmail;

    @Column(name = "new_mobile_number", nullable = false)
    private String newMobileNumber;

    @Column(name = "new_email", nullable = false)
    private String newEmail;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type")
    private String fileType;

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGTEXT")
    private String imageData;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AmendmentStatus status;

    @Builder.Default
    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();
}
