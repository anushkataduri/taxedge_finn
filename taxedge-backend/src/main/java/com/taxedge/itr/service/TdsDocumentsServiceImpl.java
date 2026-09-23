package com.taxedge.itr.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taxedge.itr.dto.TdsDocumentsDto;
import com.taxedge.itr.entity.TdsDocuments;
import com.taxedge.itr.repository.TdsDocumentsRepository;

@Service
public class TdsDocumentsServiceImpl implements TdsDocumentsService {

    @Autowired
    private TdsDocumentsRepository repository;

    @Override
    @Transactional
    public String saveDocuments(TdsDocumentsDto dto) {

        TdsDocuments entity = TdsDocuments.builder()
                .panFile(dto.getPanFile())
                .form16File(dto.getForm16File())
                .form16aFile(dto.getForm16aFile())
                .aisFile(dto.getAisFile())
                .tisFile(dto.getTisFile())
                .bankStatementsFile(dto.getBankStatementsFile())
                .prevItrFile(dto.getPrevItrFile())
                .tdsCertsFile(dto.getTdsCertsFile())
                .incomeProofsFile(dto.getIncomeProofsFile())
                .build();

        TdsDocuments saved = repository.save(entity);

        return "Documents saved successfully. ID: " + saved.getId();
    }

    @Override
    @Transactional
    public String updateDocuments(Long id, TdsDocumentsDto dto) {

        TdsDocuments existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documents not found"));

        TdsDocuments updated = TdsDocuments.builder()
                .id(existing.getId())                   // same id -> UPDATE
                .createdAt(existing.getCreatedAt())     // keep original timestamp
                .panFile(keep(dto.getPanFile(), existing.getPanFile()))
                .form16File(keep(dto.getForm16File(), existing.getForm16File()))
                .form16aFile(keep(dto.getForm16aFile(), existing.getForm16aFile()))
                .aisFile(keep(dto.getAisFile(), existing.getAisFile()))
                .tisFile(keep(dto.getTisFile(), existing.getTisFile()))
                .bankStatementsFile(keep(dto.getBankStatementsFile(), existing.getBankStatementsFile()))
                .prevItrFile(keep(dto.getPrevItrFile(), existing.getPrevItrFile()))
                .tdsCertsFile(keep(dto.getTdsCertsFile(), existing.getTdsCertsFile()))
                .incomeProofsFile(keep(dto.getIncomeProofsFile(), existing.getIncomeProofsFile()))
                .build();

        repository.save(updated);

        return "Documents updated successfully";
    }

    /** Use the new file if one was sent, otherwise keep the stored one. */
    private byte[] keep(byte[] newFile, byte[] existingFile) {
        return Optional.ofNullable(newFile).orElse(existingFile);
    }
}