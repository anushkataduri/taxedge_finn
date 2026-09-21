package com.taxedge.gst.service;

import com.taxedge.gst.dto.BankAccountAmendmentViewDto;
import com.taxedge.gst.entity.BankAccountAmendmentEntity;
import com.taxedge.gst.entity.Business;
import com.taxedge.gst.enums.AccountType;
import com.taxedge.gst.enums.AmendmentStatus;
import com.taxedge.gst.exception.ResourceNotFoundException;
import com.taxedge.gst.repository.BankAccountAmendmentRepository;
import com.taxedge.gst.repository.BusinessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class BankAccountAmendmentServiceImpl implements BankAccountAmendmentService {

    private final BusinessRepository businessRepository;
    private final BankAccountAmendmentRepository bankAmendmentRepository;

    public BankAccountAmendmentServiceImpl(BusinessRepository businessRepository,
                                           BankAccountAmendmentRepository bankAmendmentRepository) {
        this.businessRepository = businessRepository;
        this.bankAmendmentRepository = bankAmendmentRepository;
    }

    @Override
    public BankAccountAmendmentViewDto getExistingBankAccountDetails(String gstId) {
        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        return BankAccountAmendmentViewDto.builder()
                .gstId(gstId)
                .currentBankName(business.getBankName())
                .currentBankAccountNumber(business.getBankAccountNumber())
                .currentIfscCode(business.getIfscCode())
                .currentAccountType(business.getAccountType())
                .build();
    }

    @Override
    public BankAccountAmendmentViewDto getNewBankAccountAmendmentDetails(String gstId) {
        businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        BankAccountAmendmentEntity pendingAmendment = bankAmendmentRepository
                .findByGstIdAndStatus(gstId, AmendmentStatus.PENDING)
                .orElse(null);

        if (pendingAmendment == null) {
            return BankAccountAmendmentViewDto.builder().gstId(gstId).build();
        }

        return BankAccountAmendmentViewDto.builder()
                .gstId(gstId)
                .newBankName(pendingAmendment.getNewBankName())
                .newBankAccountNumber(pendingAmendment.getNewBankAccountNumber())
                .newIfscCode(pendingAmendment.getNewIfscCode())
                .newAccountType(pendingAmendment.getNewAccountType())
                .fileName(pendingAmendment.getFileName())
                .status(pendingAmendment.getStatus())
                .requestedAt(pendingAmendment.getRequestedAt())
                .build();
    }

    @Override
    @Transactional
    public String submitBankAccountAmendment(String gstId, String bankName, String accountNumber,
                                             String ifscCode, AccountType accountType, MultipartFile file) throws IOException {

        Business business = businessRepository.findById(gstId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with ID: " + gstId));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Supporting proof document is required for bank account amendment");
        }

        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

        BankAccountAmendmentEntity amendment = BankAccountAmendmentEntity.builder()
                .gstId(gstId)
                .currentBankName(business.getBankName())
                .currentBankAccountNumber(business.getBankAccountNumber())
                .currentIfscCode(business.getIfscCode())
                .currentAccountType(business.getAccountType())
                .newBankName(bankName)
                .newBankAccountNumber(accountNumber)
                .newIfscCode(ifscCode)
                .newAccountType(accountType)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .imageData(base64Data)
                .status(AmendmentStatus.PENDING)
                .build();

        bankAmendmentRepository.save(amendment);

        return "Bank account amendment submitted successfully and is pending review.";
    }
}
