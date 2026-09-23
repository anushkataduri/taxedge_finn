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

import com.taxedge.itr.dto.RevisedItrDto;
import com.taxedge.itr.service.RevisedItrService;

@RestController
@RequestMapping("/api/v1/itr/revised")
public class RevisedItrController {

	@Autowired
	private RevisedItrService revisedItrService;

	@GetMapping("/{revisedItrId}")
	public ResponseEntity<RevisedItrDto> getRevisedItr(@PathVariable String revisedItrId) {

		RevisedItrDto revisedItr = revisedItrService.getRevisedItr(revisedItrId);

		return ResponseEntity.ok(revisedItr);
	}

	@PostMapping("/register")
	public ResponseEntity<String> registerRevisedItr(@RequestBody RevisedItrDto dto) {

		String result = revisedItrService.createRevisedItr(dto);

		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}

	@PutMapping("/update/{revisedItrId}")
	public ResponseEntity<String> updateRevisedItr(@PathVariable String revisedItrId, @RequestBody RevisedItrDto dto) {

		String result = revisedItrService.updateRevisedItr(revisedItrId, dto);

		return ResponseEntity.ok(result);
	}
}