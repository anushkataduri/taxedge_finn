package com.taxedge.notification.email.model;

/**
 * Supported email event types across the TaxEdge ecosystem.
 * Currently active: ACCOUNT_REGISTERED (welcome email).
 * Additional events are defined for future service extensions.
 */
public enum EmailEvent {
    // Active
    ACCOUNT_REGISTERED,

    // Future-ready events
    OTP_VERIFIED,
    PROFILE_COMPLETED,

    LOAN_APPLICATION_SUBMITTED,
    LOAN_KYC_COMPLETED,
    LOAN_DOCUMENT_REQUIRED,
    LOAN_APPROVED,
    LOAN_REJECTED,
    LOAN_DISBURSED,

    ITR_APPLICATION_SUBMITTED,
    GST_APPLICATION_SUBMITTED,

    PAYMENT_SUCCESSFUL,
    APPLICATION_STATUS_CHANGED
}
