package com.taxedge.notification.email.service;

import com.taxedge.notification.email.model.EmailEvent;
import java.util.Map;

/**
 * Reusable Email Service for dispatching transactional emails across the TaxEdge platform.
 */
public interface EmailService {

    /**
     * Dispatches the welcome email upon successful customer registration.
     * Guaranteed never to throw an exception that would roll back or fail registration.
     *
     * @param recipientEmail customer's registered email
     * @param customerName   customer's full name
     * @param customerId     generated customer/client ID
     * @return true if successfully dispatched; false if skipped or failed
     */
    boolean sendWelcomeEmail(String recipientEmail, String customerName, String customerId);

    /**
     * Dispatches a dedicated test email to the specified recipient for development diagnostics.
     * Bypasses welcome duplicate suppression so testing can be re-run on demand.
     *
     * @param recipientEmail destination test email
     * @return true if accepted by Gmail SMTP; false otherwise
     */
    boolean sendTestEmail(String recipientEmail);

    /**
     * Returns a safe map of boolean configuration flags for diagnostics without printing any secrets.
     */
    Map<String, Object> getDiagnostics();

    /**
     * Generic transactional email dispatcher supporting HTML, plain text fallback,
     * duplicate protection, and graceful failure handling.
     *
     * @param to             recipient email address
     * @param subject        email subject
     * @param htmlContent    responsive HTML body
     * @param textContent    plain-text fallback body
     * @param event          the event type (for logging and metrics)
     * @param idempotencyKey unique key to prevent duplicate email delivery
     * @return true if email dispatch succeeded; false if skipped or failed
     */
    boolean sendEmail(String to, String subject, String htmlContent, String textContent, EmailEvent event, String idempotencyKey);
}
