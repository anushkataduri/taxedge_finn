package com.taxedge.itr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taxedge.itr.dto.ItrFilingPostDto;
import com.taxedge.itr.entity.ItrFiling;
import com.taxedge.itr.service.ItrFilingService;

@RestController
@RequestMapping("/api/v1/itr/filing")
public class ItrFilingController {

    @Autowired
    private ItrFilingService itrFilingService;

    @GetMapping("/{itrId}")
    public ResponseEntity<ItrFiling> getItrFiling(
            @PathVariable String itrId) {

        ItrFiling itrFiling = itrFilingService.getItrFiling(itrId);

        return ResponseEntity.ok(itrFiling);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerItrFiling(
            @RequestBody ItrFilingPostDto dto) {

        String result = itrFilingService.createItrFiling(dto);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PutMapping("/update/{itrId}")
    public ResponseEntity<String> updateItrFiling(
            @PathVariable String itrId,
            @RequestBody ItrFilingPostDto dto) {

        String result = itrFilingService.updateItrFiling(itrId, dto);

        return ResponseEntity.ok(result);
    }
}