package com.taxedge.itr.domain.model;

/**
 * Status timeline stages for TDS Refund application.
 */
public enum TdsRefundStatus {
    DRAFT,
    PAYMENT_PENDING,
    APPLICATION_SUBMITTED,
    PAYMENT_COMPLETED,
    UNDER_VERIFICATION,
    ITR_PREPARATION,
    CUSTOMER_REVIEW,
    ITR_FILING,
    ITR_VERIFICATION,
    INCOME_TAX_PROCESSING,
    REFUND_CREDITED
}
