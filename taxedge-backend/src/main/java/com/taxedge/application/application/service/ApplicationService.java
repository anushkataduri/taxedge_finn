package com.taxedge.application.application.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taxedge.application.application.dto.ApplicationDto;
import com.taxedge.application.domain.model.ApplicationEntity;
import com.taxedge.application.infrastructure.repository.ApplicationRepository;
import com.taxedge.itr.domain.model.TdsRefundApplication;
import com.taxedge.itr.domain.model.TdsRefundStatus;
import com.taxedge.itr.infrastructure.repository.TdsRefundApplicationRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private TdsRefundApplicationRepository tdsRefundApplicationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public List<ApplicationDto> getApplicationsForCustomer(String customerId, String mobileNumber) {
        List<ApplicationDto> results = new ArrayList<>();
        Set<String> seenIds = new HashSet<>();

        // 1. Fetch from applications table by customerId
        if (customerId != null && !customerId.isBlank()) {
            List<ApplicationEntity> byCust = applicationRepository.findAllByCustomerIdOrderByCreatedAtDesc(customerId.trim());
            for (ApplicationEntity entity : byCust) {
                if (seenIds.add(entity.getId())) {
                    results.add(toDto(entity));
                }
            }
        }

        // 2. Fetch from applications table by mobileNumber
        if (mobileNumber != null && !mobileNumber.isBlank()) {
            String cleanMobile = mobileNumber.replaceAll("\\D", "");
            List<ApplicationEntity> byMobile = applicationRepository.findAllByMobileNumberOrderByCreatedAtDesc(cleanMobile);
            for (ApplicationEntity entity : byMobile) {
                if (seenIds.add(entity.getId())) {
                    results.add(toDto(entity));
                }
            }
        }

        // 3. Fetch from tds_refund_applications table by mobileNumber
        if (mobileNumber != null && !mobileNumber.isBlank()) {
            String cleanMobile = mobileNumber.replaceAll("\\D", "");
            List<TdsRefundApplication> tdsList = tdsRefundApplicationRepository.findAllByMobileNumber(cleanMobile);
            for (TdsRefundApplication tds : tdsList) {
                if (tds.getApplicationId() != null && seenIds.add(tds.getApplicationId())) {
                    results.add(fromTdsRefund(tds));
                }
            }
        }

        // 4. Sort newest first based on createdAt
        results.sort((a, b) -> {
            String dateA = a.getCreatedAt() != null ? a.getCreatedAt() : "";
            String dateB = b.getCreatedAt() != null ? b.getCreatedAt() : "";
            return dateB.compareTo(dateA);
        });

        return results;
    }

    public Optional<ApplicationDto> getApplicationById(String id, String customerId, String mobileNumber) {
        if (id == null || id.isBlank()) {
            return Optional.empty();
        }

        String cleanId = id.trim();
        Optional<ApplicationEntity> entityOpt = applicationRepository.findById(cleanId);
        if (entityOpt.isPresent()) {
            ApplicationEntity entity = entityOpt.get();
            // Verify customer ownership
            boolean matchesCustomer = (customerId != null && !customerId.isBlank() && customerId.trim().equalsIgnoreCase(entity.getCustomerId()));
            boolean matchesMobile = (mobileNumber != null && !mobileNumber.isBlank() && mobileNumber.replaceAll("\\D", "").equals(entity.getMobileNumber()));

            if (matchesCustomer || matchesMobile || entity.getCustomerId() == null) {
                return Optional.of(toDto(entity));
            }
            return Optional.empty();
        }

        // Check in tds_refund_applications
        Optional<TdsRefundApplication> tdsOpt = tdsRefundApplicationRepository.findByApplicationId(cleanId);
        if (tdsOpt.isPresent()) {
            TdsRefundApplication tds = tdsOpt.get();
            boolean matchesMobile = (mobileNumber != null && !mobileNumber.isBlank() && mobileNumber.replaceAll("\\D", "").equals(tds.getMobileNumber()));
            if (matchesMobile || customerId != null) {
                return Optional.of(fromTdsRefund(tds));
            }
        }

        return Optional.empty();
    }

    public ApplicationDto createOrUpdateApplication(ApplicationDto dto, String customerId, String mobileNumber) {
        if (dto.getId() == null || dto.getId().isBlank()) {
            throw new IllegalArgumentException("Application id is required");
        }

        String effectiveCustomerId = (dto.getCustomerId() != null && !dto.getCustomerId().isBlank())
                ? dto.getCustomerId().trim()
                : (customerId != null ? customerId.trim() : null);

        String effectiveMobile = (dto.getMobileNumber() != null && !dto.getMobileNumber().isBlank())
                ? dto.getMobileNumber().replaceAll("\\D", "")
                : (mobileNumber != null ? mobileNumber.replaceAll("\\D", "") : null);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime createdDate = now;
        if (dto.getCreatedAt() != null && !dto.getCreatedAt().isBlank()) {
            try {
                createdDate = LocalDateTime.parse(dto.getCreatedAt().replace("Z", ""));
            } catch (Exception e) {
                createdDate = now;
            }
        }

        String formDataJson = serializeJson(dto.getFormData());
        String documentsJson = serializeJson(dto.getDocuments());
        String timelineJson = serializeJson(dto.getTimeline());
        String chatHistoryJson = serializeJson(dto.getChatHistory());

        ApplicationEntity entity = ApplicationEntity.builder()
                .id(dto.getId().trim())
                .customerId(effectiveCustomerId)
                .mobileNumber(effectiveMobile)
                .serviceId(dto.getServiceId() != null ? dto.getServiceId() : "service")
                .serviceName(dto.getServiceName() != null ? dto.getServiceName() : "Service")
                .category(dto.getCategory() != null ? dto.getCategory().toUpperCase() : "GST")
                .status(dto.getStatus() != null ? dto.getStatus() : "Under Verification")
                .progress(dto.getProgress() != null ? dto.getProgress() : 20)
                .assignedExecutive(dto.getAssignedExecutive() != null ? dto.getAssignedExecutive() : "Executive")
                .paymentAmount(dto.getPaymentAmount())
                .paymentStatus(dto.getPaymentStatus() != null ? dto.getPaymentStatus() : "Paid")
                .formDataJson(formDataJson)
                .documentsJson(documentsJson)
                .timelineJson(timelineJson)
                .chatHistoryJson(chatHistoryJson)
                .createdAt(createdDate)
                .updatedAt(now)
                .build();

        ApplicationEntity saved = applicationRepository.save(entity);
        return toDto(saved);
    }

    private ApplicationDto toDto(ApplicationEntity entity) {
        Map<String, Object> formData = deserializeMap(entity.getFormDataJson());
        List<Map<String, Object>> documents = deserializeList(entity.getDocumentsJson());
        List<Map<String, Object>> timeline = deserializeList(entity.getTimelineJson());
        List<Map<String, Object>> chatHistory = deserializeList(entity.getChatHistoryJson());

        String createdAtStr = entity.getCreatedAt() != null
                ? entity.getCreatedAt().format(ISO_FORMATTER)
                : LocalDateTime.now().format(ISO_FORMATTER);

        return ApplicationDto.builder()
                .id(entity.getId())
                .customerId(entity.getCustomerId())
                .mobileNumber(entity.getMobileNumber())
                .serviceId(entity.getServiceId())
                .serviceName(entity.getServiceName())
                .category(entity.getCategory())
                .status(entity.getStatus())
                .progress(entity.getProgress())
                .assignedExecutive(entity.getAssignedExecutive())
                .paymentAmount(entity.getPaymentAmount())
                .paymentStatus(entity.getPaymentStatus())
                .createdAt(createdAtStr)
                .formData(formData)
                .documents(documents)
                .timeline(timeline)
                .chatHistory(chatHistory)
                .build();
    }

    private ApplicationDto fromTdsRefund(TdsRefundApplication tds) {
        String statusLabel = mapTdsStatus(tds.getStatus());
        int progress = 30;
        if (tds.getStatus() == TdsRefundStatus.REFUND_CREDITED) {
            progress = 100;
        } else if (tds.getStatus() == TdsRefundStatus.INCOME_TAX_PROCESSING || tds.getStatus() == TdsRefundStatus.ITR_FILING) {
            progress = 80;
        } else if (tds.getStatus() == TdsRefundStatus.UNDER_VERIFICATION || tds.getStatus() == TdsRefundStatus.ITR_PREPARATION) {
            progress = 50;
        }

        String createdAtStr = tds.getCreatedAt() != null
                ? tds.getCreatedAt().format(ISO_FORMATTER)
                : LocalDateTime.now().format(ISO_FORMATTER);

        Map<String, Object> formData = new HashMap<>();
        formData.put("pan", tds.getPan());
        formData.put("applicantName", tds.getFullName());
        formData.put("assessmentYear", tds.getAssessmentYear());
        formData.put("financialYear", tds.getFinancialYear());
        formData.put("estimatedRefund", tds.getEstimatedRefund());
        formData.put("totalTdsDeducted", tds.getTotalTdsDeducted());

        List<Map<String, Object>> timeline = new ArrayList<>();
        timeline.add(Map.of("title", "Application Submitted", "description", "TDS refund claim initiated", "status", "completed", "date", createdAtStr.split("T")[0]));
        timeline.add(Map.of("title", "Under Verification", "description", "Documents being verified by CA", "status", tds.getStatus() == TdsRefundStatus.REFUND_CREDITED ? "completed" : "current", "date", createdAtStr.split("T")[0]));
        timeline.add(Map.of("title", "ITR Preparation", "description", "Return computation by CA", "status", tds.getStatus() == TdsRefundStatus.REFUND_CREDITED ? "completed" : "pending"));
        timeline.add(Map.of("title", "Completed", "description", "Process closed & refund credited", "status", tds.getStatus() == TdsRefundStatus.REFUND_CREDITED ? "completed" : "pending"));

        return ApplicationDto.builder()
                .id(tds.getApplicationId())
                .mobileNumber(tds.getMobileNumber())
                .serviceId("tds-refund")
                .serviceName("TDS Refund Claim")
                .category("ITR")
                .status(statusLabel)
                .progress(progress)
                .assignedExecutive("CA Tax Specialist")
                .paymentAmount(tds.getTotalPaid() != null ? tds.getTotalPaid() : tds.getServiceFee())
                .paymentStatus(Boolean.TRUE.equals(tds.getIsPaid()) ? "Paid" : "Pending")
                .createdAt(createdAtStr)
                .formData(formData)
                .documents(Collections.emptyList())
                .timeline(timeline)
                .chatHistory(Collections.emptyList())
                .build();
    }

    private String mapTdsStatus(TdsRefundStatus status) {
        if (status == null) return "Under Verification";
        switch (status) {
            case REFUND_CREDITED:
                return "Completed";
            case DRAFT:
            case PAYMENT_PENDING:
                return "In Progress";
            case APPLICATION_SUBMITTED:
            case PAYMENT_COMPLETED:
            case UNDER_VERIFICATION:
            case ITR_PREPARATION:
            case CUSTOMER_REVIEW:
            case ITR_FILING:
            case ITR_VERIFICATION:
            case INCOME_TAX_PROCESSING:
            default:
                return "Under Verification";
        }
    }

    private String serializeJson(Object obj) {
        if (obj == null) return null;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, Object> deserializeMap(String json) {
        if (json == null || json.isBlank()) return new HashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    private List<Map<String, Object>> deserializeList(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
