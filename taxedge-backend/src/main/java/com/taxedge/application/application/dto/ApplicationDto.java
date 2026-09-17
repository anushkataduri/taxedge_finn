package com.taxedge.application.application.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {

    private String id;
    private String customerId;
    private String mobileNumber;
    private String serviceId;
    private String serviceName;
    private String category;
    private String status;
    private Integer progress;
    private String assignedExecutive;
    private BigDecimal paymentAmount;
    private String paymentStatus;
    private String createdAt;
    private Map<String, Object> formData;
    private List<Map<String, Object>> documents;
    private List<Map<String, Object>> timeline;
    private List<Map<String, Object>> chatHistory;
}
