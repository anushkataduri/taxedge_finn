package com.taxedge.notification.email;

import com.taxedge.notification.email.model.EmailEvent;
import com.taxedge.notification.email.service.EmailServiceImpl;
import com.taxedge.notification.email.service.EmailTemplateService;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private EmailTemplateService emailTemplateService;

    @InjectMocks
    private EmailServiceImpl emailService;

    private EmailTemplateService realTemplateService;

    @BeforeEach
    void setUp() {
        realTemplateService = new EmailTemplateService();
        ReflectionTestUtils.setField(emailService, "mailHost", "smtp.gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPort", 587);
        ReflectionTestUtils.setField(emailService, "mailUsername", "taxedge.notifications@gmail.com");
        ReflectionTestUtils.setField(emailService, "fromAddress", "taxedge.notifications@gmail.com");
        ReflectionTestUtils.setField(emailService, "fromName", "TaxEdge");
    }

    @Test
    @DisplayName("Email template should correctly render customer name, TaxEdge branding, and plain text fallback")
    void testTemplateRendering() {
        String name = "Prakash Paladugu";
        String custId = "CI968080";

        String subject = realTemplateService.buildWelcomeSubject();
        assertEquals("Welcome to TaxEdge 🎉", subject);

        String html = realTemplateService.buildWelcomeHtml(name, custId);
        assertNotNull(html);
        assertTrue(html.contains("Prakash Paladugu"));
        assertTrue(html.contains("CI968080"));
        assertTrue(html.contains("#06152D"));
        assertTrue(html.contains("#FF6B00"));
        assertTrue(html.contains("Income Tax / ITR"));
        assertTrue(html.contains("GST Services"));
        assertTrue(html.contains("Loans &amp; Funding"));

        String text = realTemplateService.buildWelcomeText(name, custId);
        assertNotNull(text);
        assertTrue(text.contains("Hi Prakash Paladugu"));
        assertTrue(text.contains("Client ID: CI968080"));
        assertTrue(text.contains("Team TaxEdge"));
    }

    @Test
    @DisplayName("When MAIL_PASSWORD is empty, email sending should be gracefully bypassed without exception")
    void testMissingPasswordGracefulBypass() {
        ReflectionTestUtils.setField(emailService, "mailPassword", "");

        boolean result = emailService.sendEmail(
                "client@example.com",
                "Welcome to TaxEdge 🎉",
                "<html>Hello</html>",
                "Hello",
                EmailEvent.ACCOUNT_REGISTERED,
                "test-key-1"
        );

        assertFalse(result, "Should safely return false without throwing any exception");
    }

    @Test
    @DisplayName("Invalid email addresses should be safely rejected without throwing exception")
    void testInvalidEmailAddress() {
        ReflectionTestUtils.setField(emailService, "mailPassword", "someAppPassword");

        assertFalse(emailService.sendEmail("", "Subject", "html", "text", EmailEvent.ACCOUNT_REGISTERED, null));
        assertFalse(emailService.sendEmail("invalid-email", "Subject", "html", "text", EmailEvent.ACCOUNT_REGISTERED, null));
        assertFalse(emailService.sendEmail(null, "Subject", "html", "text", EmailEvent.ACCOUNT_REGISTERED, null));
    }

    @Test
    @DisplayName("Duplicate emails within window should be suppressed by idempotency protection after successful dispatch")
    void testDuplicateEmailSuppression() {
        ReflectionTestUtils.setField(emailService, "mailPassword", "validPassword123");
        MimeMessage mimeMessage = new MimeMessage((Session) null);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        String key = "WELCOME:duplicate.test@example.com";

        // First call sends successfully and caches the key
        boolean firstResult = emailService.sendEmail("duplicate.test@example.com", "Subj", "html", "text", EmailEvent.ACCOUNT_REGISTERED, key);
        assertTrue(firstResult, "First call should succeed and send message");
        verify(mailSender, times(1)).send(any(MimeMessage.class));

        // Second call with same idempotency key should hit cache and suppress duplicate
        boolean secondResult = emailService.sendEmail("duplicate.test@example.com", "Subj", "html", "text", EmailEvent.ACCOUNT_REGISTERED, key);
        assertTrue(secondResult, "Second invocation should be detected as duplicate and suppressed safely");
        // Verify mailSender was NOT called a second time
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("getDiagnostics should return safe boolean flags without printing secrets")
    void testGetDiagnostics() {
        ReflectionTestUtils.setField(emailService, "mailPassword", "someSecret123");
        Map<String, Object> diag = emailService.getDiagnostics();

        assertNotNull(diag);
        assertEquals(true, diag.get("mailHostConfigured"));
        assertEquals(587, diag.get("mailPort"));
        assertEquals(true, diag.get("mailUsernameConfigured"));
        assertEquals(true, diag.get("mailPasswordConfigured"));
        assertEquals(true, diag.get("mailFromConfigured"));
        assertEquals(true, diag.get("javaMailSenderAvailable"));
        assertFalse(diag.containsKey("mailPassword"));
    }
}
