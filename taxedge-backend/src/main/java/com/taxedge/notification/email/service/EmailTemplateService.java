package com.taxedge.notification.email.service;

import org.springframework.stereotype.Service;

/**
 * Service responsible for generating responsive HTML and plain-text email templates
 * using TaxEdge official brand identity:
 * - Deep Navy: #06152D / #0F3567
 * - Vibrant Orange: #FF6B00
 * - Pure White: #FFFFFF
 */
@Service
public class EmailTemplateService {

    /**
     * Builds the subject line for the welcome email.
     */
    public String buildWelcomeSubject() {
        return "Welcome to TaxEdge 🎉";
    }

    /**
     * Builds the responsive HTML body for the welcome email.
     * Compatible with Gmail (desktop/mobile), Outlook, Apple Mail.
     */
    public String buildWelcomeHtml(String customerName, String customerId) {
        String safeName = escapeHtml(customerName != null && !customerName.isBlank() ? customerName.trim() : "Valued Client");
        String safeCustId = customerId != null ? escapeHtml(customerId.trim()) : "";

        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "  <meta charset=\"UTF-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
                "  <title>Welcome to TaxEdge</title>\n" +
                "  <style type=\"text/css\">\n" +
                "    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }\n" +
                "    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }\n" +
                "    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }\n" +
                "    body { margin: 0; padding: 0; width: 100% !important; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }\n" +
                "    @media screen and (max-width: 600px) {\n" +
                "      .wrapper { width: 100% !important; padding: 12px !important; }\n" +
                "      .content-padding { padding: 24px 20px !important; }\n" +
                "    }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body style=\"margin: 0; padding: 0; background-color: #F4F6F9;\">\n" +
                "  <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #F4F6F9;\">\n" +
                "    <tr>\n" +
                "      <td align=\"center\" style=\"padding: 30px 10px;\">\n" +
                "        <!-- Main Container -->\n" +
                "        <table role=\"presentation\" class=\"wrapper\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(6, 21, 45, 0.08);\">\n" +
                "          \n" +
                "          <!-- Header Banner -->\n" +
                "          <tr>\n" +
                "            <td style=\"background: linear-gradient(135deg, #06152D 0%, #0F3567 100%); background-color: #06152D; padding: 36px 32px 30px; text-align: left;\">\n" +
                "              <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n" +
                "                <tr>\n" +
                "                  <td>\n" +
                "                    <div style=\"display: inline-block; background-color: #FF6B00; color: #FFFFFF; font-weight: 800; font-size: 13px; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 4px; text-transform: uppercase; margin-bottom: 12px;\">\n" +
                "                      TAXEDGE\n" +
                "                    </div>\n" +
                "                    <h1 style=\"color: #FFFFFF; font-size: 26px; font-weight: 700; margin: 0; line-height: 1.3;\">\n" +
                "                      Welcome to TaxEdge 🎉\n" +
                "                    </h1>\n" +
                "                    <p style=\"color: #B0C4DE; font-size: 14px; margin: 6px 0 0; line-height: 1.4;\">\n" +
                "                      Your Premier Platform for Tax, Compliance &amp; Financial Services\n" +
                "                    </p>\n" +
                "                  </td>\n" +
                "                </tr>\n" +
                "              </table>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "          \n" +
                "          <!-- Orange Accent Line -->\n" +
                "          <tr>\n" +
                "            <td height=\"4\" style=\"background-color: #FF6B00; font-size: 0; line-height: 0;\">&nbsp;</td>\n" +
                "          </tr>\n" +
                "\n" +
                "          <!-- Body Content -->\n" +
                "          <tr>\n" +
                "            <td class=\"content-padding\" style=\"padding: 36px 32px 28px; color: #1E293B;\">\n" +
                "              <p style=\"font-size: 17px; line-height: 1.6; margin: 0 0 16px; font-weight: 600; color: #06152D;\">\n" +
                "                Hi " + safeName + ",\n" +
                "              </p>\n" +
                "              <p style=\"font-size: 15px; line-height: 1.6; margin: 0 0 14px; color: #334155;\">\n" +
                "                Thank you for registering with <strong>TaxEdge</strong>.\n" +
                "              </p>\n" +
                "              <p style=\"font-size: 15px; line-height: 1.6; margin: 0 0 24px; color: #334155;\">\n" +
                "                Your account has been successfully created" + (!safeCustId.isEmpty() ? " with Client ID <code style=\"background: #EEF2F6; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #0F3567; font-weight: bold;\">" + safeCustId + "</code>" : "") + ".\n" +
                "              </p>\n" +
                "\n" +
                "              <!-- Services Box -->\n" +
                "              <div style=\"background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #FF6B00; border-radius: 8px; padding: 18px 20px; margin: 20px 0 24px;\">\n" +
                "                <p style=\"margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #06152D; text-transform: uppercase; letter-spacing: 0.5px;\">\n" +
                "                  You can now access TaxEdge services including:\n" +
                "                </p>\n" +
                "                <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n" +
                "                  <tr>\n" +
                "                    <td style=\"padding: 4px 0; font-size: 14px; color: #334155;\">\n" +
                "                      <span style=\"color: #FF6B00; font-weight: bold; margin-right: 8px;\">•</span> <strong>Income Tax / ITR:</strong> Filing, revised returns, TDS refund status &amp; tax notice assistance\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                  <tr>\n" +
                "                    <td style=\"padding: 4px 0; font-size: 14px; color: #334155;\">\n" +
                "                      <span style=\"color: #FF6B00; font-weight: bold; margin-right: 8px;\">•</span> <strong>GST Services:</strong> Registration, monthly filing, compliance, amendments &amp; certificates\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                  <tr>\n" +
                "                    <td style=\"padding: 4px 0; font-size: 14px; color: #334155;\">\n" +
                "                      <span style=\"color: #FF6B00; font-weight: bold; margin-right: 8px;\">•</span> <strong>Loans &amp; Funding:</strong> Business, personal, MSME loans &amp; fast financial assistance\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                  <tr>\n" +
                "                    <td style=\"padding: 4px 0; font-size: 14px; color: #334155;\">\n" +
                "                      <span style=\"color: #FF6B00; font-weight: bold; margin-right: 8px;\">•</span> <strong>Other TaxEdge Services:</strong> Dedicated CA advisory and vault storage\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </table>\n" +
                "              </div>\n" +
                "\n" +
                "              <p style=\"font-size: 15px; line-height: 1.6; margin: 0 0 28px; color: #334155;\">\n" +
                "                Thank you for choosing TaxEdge. If you need any assistance, our dedicated team is always here to support you.\n" +
                "              </p>\n" +
                "\n" +
                "              <!-- Sign-off -->\n" +
                "              <table role=\"presentation\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-top: 1px solid #E2E8F0; padding-top: 20px; width: 100%;\">\n" +
                "                <tr>\n" +
                "                  <td>\n" +
                "                    <p style=\"font-size: 14px; color: #64748B; margin: 0 0 4px; line-height: 1.4;\">\n" +
                "                      Regards,\n" +
                "                    </p>\n" +
                "                    <p style=\"font-size: 15px; font-weight: 700; color: #06152D; margin: 0; line-height: 1.4;\">\n" +
                "                      Team TaxEdge\n" +
                "                    </p>\n" +
                "                  </td>\n" +
                "                </tr>\n" +
                "              </table>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "\n" +
                "          <!-- Footer -->\n" +
                "          <tr>\n" +
                "            <td style=\"background-color: #06152D; padding: 22px 32px; text-align: center; color: #94A3B8; font-size: 12px; line-height: 1.5;\">\n" +
                "              <p style=\"margin: 0 0 6px;\">\n" +
                "                This is an automated notification from <strong>TaxEdge</strong>.\n" +
                "              </p>\n" +
                "              <p style=\"margin: 0; color: #64748B;\">\n" +
                "                &copy; " + java.time.Year.now().getValue() + " TaxEdge. All rights reserved.\n" +
                "              </p>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </table>\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </table>\n" +
                "</body>\n" +
                "</html>";
    }

    /**
     * Builds plain-text fallback version of the welcome email for text-only email clients.
     */
    public String buildWelcomeText(String customerName, String customerId) {
        String safeName = (customerName != null && !customerName.isBlank()) ? customerName.trim() : "Valued Client";
        String idSuffix = (customerId != null && !customerId.isBlank()) ? " (Client ID: " + customerId.trim() + ")" : "";

        return "Hi " + safeName + ",\n\n" +
                "Thank you for registering with TaxEdge.\n\n" +
                "Your account has been successfully created" + idSuffix + ".\n\n" +
                "You can now access TaxEdge services including:\n\n" +
                "• Income Tax / ITR\n" +
                "• GST\n" +
                "• Loans\n" +
                "• Other TaxEdge services\n\n" +
                "Thank you for choosing TaxEdge.\n\n" +
                "Regards,\n" +
                "Team TaxEdge\n\n" +
                "---\n" +
                "© " + java.time.Year.now().getValue() + " TaxEdge. All rights reserved.";
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
