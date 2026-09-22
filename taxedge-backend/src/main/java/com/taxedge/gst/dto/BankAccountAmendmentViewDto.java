package com.taxedge.gst.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.taxedge.gst.enums.AccountType;
import com.taxedge.gst.enums.AmendmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BankAccountAmendmentViewDto {
    private String gstId;
    private String currentBankName;
    private String currentBankAccountNumber;
    private String currentIfscCode;
    private AccountType currentAccountType;

    private String newBankName;
    private String newBankAccountNumber;
    private String newIfscCode;
    private AccountType newAccountType;
    private String fileName;
    private AmendmentStatus status;
    private LocalDateTime requestedAt;
}
