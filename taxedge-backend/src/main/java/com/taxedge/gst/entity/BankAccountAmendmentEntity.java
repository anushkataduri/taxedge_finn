package com.taxedge.gst.entity;

import jakarta.persistence.*;
import com.taxedge.gst.enums.AccountType;
import com.taxedge.gst.enums.AmendmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_account_amendments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankAccountAmendmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String gstId;

    private String currentBankName;
    private String currentBankAccountNumber;
    private String currentIfscCode;
    @Enumerated(EnumType.STRING)
    private AccountType currentAccountType;

    @Column(nullable = false)
    private String newBankName;
    @Column(nullable = false)
    private String newBankAccountNumber;
    @Column(nullable = false)
    private String newIfscCode;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType newAccountType;

    private String fileName;
    private String fileType;
    @Lob
    @Column(columnDefinition = "TEXT")
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
