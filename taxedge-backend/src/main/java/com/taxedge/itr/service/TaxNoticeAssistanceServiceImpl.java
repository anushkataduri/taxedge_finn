package com.taxedge.itr.service;

import java.io.IOException;
import java.util.Base64;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.taxedge.customer.entity.Customer;
import com.taxedge.customer.repository.CustomerRepository;
import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.dto.TaxNoticeAssistanceDto;
import com.taxedge.itr.entity.TaxNoticeAssistance;
import com.taxedge.itr.helper.RandomNumberGenerator;
import com.taxedge.itr.repository.TaxNoticeAssistanceRepository;

@Service
public class TaxNoticeAssistanceServiceImpl implements TaxNoticeAssistanceService {

	@Autowired
	private TaxNoticeAssistanceRepository taxNoticeAssistanceRepository;
   
	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired
	@Qualifier("itrModelMapper")
	private ModelMapper modelMapper;

	@Override
	public String createTaxNotice(TaxNoticeAssistanceDto dto, MultipartFile file) throws IOException {

		TaxNoticeAssistance taxNotice = modelMapper.map(dto, TaxNoticeAssistance.class);
		
		Customer customer = customerRepository.findById(dto.getCustId())
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "Customer not found with ID: " + dto.getCustId()));

	    taxNotice.setCustomer(customer);

		String noticeId = RandomNumberGenerator.generateTaxNoticeId();

		taxNotice.setNoticeId(noticeId);

		if (file != null && !file.isEmpty()) {

			taxNotice.setFileName(file.getOriginalFilename());

			taxNotice.setFileType(file.getContentType());

			String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

			taxNotice.setNoticeDocument(base64Data);
		}

		taxNoticeAssistanceRepository.save(taxNotice);

		return "Tax notice details registered successfully. Notice ID: " + noticeId;
	}

	@Override
	public String updateTaxNotice(String noticeId, TaxNoticeAssistanceDto dto, MultipartFile file) throws IOException {

		TaxNoticeAssistance taxNotice = taxNoticeAssistanceRepository.findById(noticeId).orElseThrow(
				() -> new ResourceNotFoundException("Tax notice details not found with noticeId: " + noticeId));

		modelMapper.map(dto, taxNotice);

		if (file != null && !file.isEmpty()) {

			taxNotice.setFileName(file.getOriginalFilename());

			taxNotice.setFileType(file.getContentType());

			String base64Data = Base64.getEncoder().encodeToString(file.getBytes());

			taxNotice.setNoticeDocument(base64Data);
		}

		taxNoticeAssistanceRepository.save(taxNotice);

		return "Tax notice details updated successfully";
	}

	@Override
	public TaxNoticeAssistanceDto getTaxNotice(String noticeId) {

		TaxNoticeAssistance taxNotice = taxNoticeAssistanceRepository.findById(noticeId).orElseThrow(
				() -> new ResourceNotFoundException("Tax notice details not found with noticeId: " + noticeId));

		return modelMapper.map(taxNotice, TaxNoticeAssistanceDto.class);
	}
}