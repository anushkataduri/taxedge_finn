package com.taxedge.application.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationEntity {

    @Id
    @Column(name = "id", length = 100, nullable = false)
    private String id;

    @Column(name = "customer_id", length = 50)
    private String customerId;

    @Column(name = "mobile_number", length = 20)
    private String mobileNumber;

    @Column(name = "service_id", length = 80, nullable = false)
    private String serviceId;

    @Column(name = "service_name", length = 150, nullable = false)
    private String serviceName;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "status", length = 50, nullable = false)
    private String status;

    @Column(name = "progress")
    private Integer progress;

    @Column(name = "assigned_executive", length = 100)
    private String assignedExecutive;

    @Column(name = "payment_amount", precision = 12, scale = 2)
    private BigDecimal paymentAmount;

    @Column(name = "payment_status", length = 30)
    private String paymentStatus;

    @Column(name = "form_data_json", columnDefinition = "LONGTEXT")
    private String formDataJson;

    @Column(name = "documents_json", columnDefinition = "LONGTEXT")
    private String documentsJson;

    @Column(name = "timeline_json", columnDefinition = "LONGTEXT")
    private String timelineJson;

    @Column(name = "chat_history_json", columnDefinition = "LONGTEXT")
    private String chatHistoryJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
