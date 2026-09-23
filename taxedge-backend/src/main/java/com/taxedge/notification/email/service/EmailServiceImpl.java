package com.taxedge.notification.email.service;

import com.taxedge.notification.email.model.EmailEvent;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private static final long DEDUP_TTL_MS = 5 * 60 * 1000L; // 5 minutes duplicate suppression window

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private int mailPort;

    @Value("${spring.mail.username:taxedge.notifications@gmail.com}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.from:taxedge.notifications@gmail.com}")
    private String fromAddress;

    @Value("${app.mail.from-name:TaxEdge}")
    private String fromName;

    // Thread-safe in-memory cache for idempotency and duplicate email protection
    private final ConcurrentHashMap<String, Long> sentCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void logDiagnostics() {
        boolean hasHost = (mailHost != null && !mailHost.isBlank());
        boolean hasUser = (mailUsername != null && !mailUsername.isBlank());
        boolean hasPass = (mailPassword != null && !mailPassword.isBlank() && !mailPassword.contains("<"));
        boolean hasFrom = (fromAddress != null && !fromAddress.isBlank());
        boolean hasSender = (mailSender != null);

        log.info("================================================================================");
        log.info("[EmailService Diagnostic] MAIL_HOST configured: {}", hasHost);
        log.info("[EmailService Diagnostic] MAIL_PORT configured: {}", mailPort);
        log.info("[EmailService Diagnostic] MAIL_USERNAME configured: {}", hasUser);
        log.info("[EmailService Diagnostic] MAIL_PASSWORD configured: {}", hasPass);
        log.info("[EmailService Diagnostic] MAIL_FROM configured: {}", hasFrom);
        log.info("[EmailService Diagnostic] JavaMailSender initialized: {}", hasSender);
        log.info("================================================================================");
    }

    @Override
    public Map<String, Object> getDiagnostics() {
        Map<String, Object> diag = new LinkedHashMap<>();
        diag.put("mailHostConfigured", (mailHost != null && !mailHost.isBlank()));
        diag.put("mailPort", mailPort);
        diag.put("mailUsernameConfigured", (mailUsername != null && !mailUsername.isBlank()));
        diag.put("mailPasswordConfigured", (mailPassword != null && !mailPassword.isBlank() && !mailPassword.contains("<")));
        diag.put("mailFromConfigured", (fromAddress != null && !fromAddress.isBlank()));
        diag.put("javaMailSenderAvailable", (mailSender != null));
        diag.put("activeSentCacheEntries", sentCache.size());
        return diag;
    }

    @Override
    public boolean sendWelcomeEmail(String recipientEmail, String customerName, String customerId) {
        try {
            if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
                log.warn("[EmailService] No email address provided for customer {}. Skipping welcome email.", customerId);
                return false;
            }

            String cleanEmail = recipientEmail.trim().toLowerCase();
            String idempotencyKey = "WELCOME:" + cleanEmail;

            String subject = emailTemplateService.buildWelcomeSubject();
            String htmlContent = emailTemplateService.buildWelcomeHtml(customerName, customerId);
            String textContent = emailTemplateService.buildWelcomeText(customerName, customerId);

            return sendEmail(cleanEmail, subject, htmlContent, textContent, EmailEvent.ACCOUNT_REGISTERED, idempotencyKey);
        } catch (Exception e) {
            // Absolute guarantee: Never bubble up exceptions to break registration
            log.error("[EmailService] Unexpected error while preparing welcome email for customer {}: {}", customerId, e.getMessage());
            return false;
        }
    }

    @Override
    public boolean sendTestEmail(String recipientEmail) {
        if (recipientEmail == null || recipientEmail.trim().isEmpty() || !recipientEmail.contains("@")) {
            log.warn("[EmailService] Invalid test email destination: {}", recipientEmail);
            return false;
        }

        String cleanEmail = recipientEmail.trim().toLowerCase();
        // Unique idempotency key so testing can be re-run at any time without duplicate suppression
        String idempotencyKey = "TEST:" + cleanEmail + ":" + System.currentTimeMillis();

        String subject = "TaxEdge SMTP Test Delivery Verification \uD83D\uDCE9";
        String htmlContent = emailTemplateService.buildWelcomeHtml("TaxEdge Tester", "TEST-DIAG-001");
        String textContent = emailTemplateService.buildWelcomeText("TaxEdge Tester", "TEST-DIAG-001");

        return sendEmail(cleanEmail, subject, htmlContent, textContent, EmailEvent.ACCOUNT_REGISTERED, idempotencyKey);
    }

    @Override
    public boolean sendEmail(String to, String subject, String htmlContent, String textContent, EmailEvent event, String idempotencyKey) {
        if (to == null || to.trim().isEmpty() || !to.contains("@")) {
            log.warn("[EmailService] Invalid recipient email '{}' for event {}. Dispatch skipped.", to, event);
            return false;
        }

        // 1. Idempotency / Duplicate Check (only blocks if previously SUCCEEDED within DEDUP_TTL_MS)
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            cleanUpOldCacheEntries();
            Long lastSentTime = sentCache.get(idempotencyKey);
            long now = System.currentTimeMillis();
            if (lastSentTime != null && (now - lastSentTime) < DEDUP_TTL_MS) {
                log.info("[EmailService] Duplicate email suppressed for key: {} (event: {})", idempotencyKey, event);
                return true;
            }
        }

        // 2. Secret / Credentials Guard
        if (mailPassword == null || mailPassword.trim().isEmpty() || mailPassword.contains("<")) {
            log.warn("[EmailService] MAIL_PASSWORD is not configured in the environment. Email dispatch for event {} to '{}' safely bypassed. " +
                    "Set MAIL_PASSWORD in backend environment variables to enable live Gmail delivery.", event, maskEmail(to));
            return false;
        }

        if (mailSender == null) {
            log.error("[EmailService] JavaMailSender bean is not available. Skipping email dispatch.");
            return false;
        }

        // 3. SMTP Message Assembly & Dispatch
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            // true indicates multipart message (HTML + plain-text fallback)
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            String sender = (fromAddress != null && !fromAddress.isBlank()) ? fromAddress.trim() : mailUsername;
            String senderDisplayName = (fromName != null && !fromName.isBlank()) ? fromName.trim() : "TaxEdge";

            try {
                helper.setFrom(sender, senderDisplayName);
            } catch (UnsupportedEncodingException e) {
                helper.setFrom(sender);
            }

            helper.setTo(to.trim());
            helper.setSubject(subject);
            // setText(plainText, htmlText) allows email clients to pick appropriate version
            helper.setText(textContent, htmlContent);

            mailSender.send(mimeMessage);

            // Record into sentCache ONLY after successful transmission to SMTP server
            if (idempotencyKey != null && !idempotencyKey.isBlank()) {
                sentCache.put(idempotencyKey, System.currentTimeMillis());
            }

            log.info("[EmailService] \u2705 Successfully dispatched {} email to '{}' via Gmail SMTP.", event, maskEmail(to));
            return true;

        } catch (MailAuthenticationException e) {
            log.error("[EmailService] \u274C SMTP Authentication failed for sender '{}'. Please verify Gmail App Password. Detail: {}",
                    mailUsername, e.getMessage());
            return false;
        } catch (MailException | MessagingException e) {
            log.error("[EmailService] \u274C Failed to deliver {} email to '{}': {}", event, maskEmail(to), e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("[EmailService] \u274C Unexpected failure delivering email for event {}: {}", event, e.getMessage());
            return false;
        }
    }

    /**
     * Safely mask recipient email for logs (e.g. j***e@example.com).
     */
    private String maskEmail(String email) {
        if (email == null || email.length() < 4 || !email.contains("@")) {
            return "***";
        }
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) {
            return "*@" + email.substring(atIndex + 1);
        }
        return email.charAt(0) + "***" + email.charAt(atIndex - 1) + email.substring(atIndex);
    }

    /**
     * Prunes expired entries from the dedup cache to maintain a light memory footprint.
     */
    private void cleanUpOldCacheEntries() {
        if (sentCache.size() > 500) {
            long threshold = System.currentTimeMillis() - DEDUP_TTL_MS;
            Iterator<Map.Entry<String, Long>> it = sentCache.entrySet().iterator();
            while (it.hasNext()) {
                if (it.next().getValue() < threshold) {
                    it.remove();
                }
            }
        }
    }
}
