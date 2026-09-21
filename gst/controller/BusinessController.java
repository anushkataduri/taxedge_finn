package com.taxedge.gst.controller;

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

import com.taxedge.gst.dto.BusinessDto;
import com.taxedge.gst.service.BusinessService;

@RestController
@RequestMapping("/gst/business")
public class BusinessController {

	@Autowired
    private  BusinessService businessService;

	@GetMapping("/{gstId}")
	public ResponseEntity<BusinessDto> getBusiness(@PathVariable String gstId) {

	    BusinessDto business = businessService.getBusinessId(gstId);

	    return ResponseEntity.ok(business);
	}

    @PostMapping("/register")
    public ResponseEntity<String> registerBusiness(@RequestBody BusinessDto businessDto) {

        String result = businessService.registerBusiness(businessDto);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PutMapping("/update/{gstId}")
    public ResponseEntity<String> updateBusiness(
            @PathVariable String gstId,
            @RequestBody BusinessDto businessDto) {

        String result =
                businessService.updateBusiness(gstId, businessDto);

        return ResponseEntity.ok(result);
    }
}