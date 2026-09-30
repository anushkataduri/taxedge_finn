package com.taxedge.itr.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxedge.itr.Exception.ResourceNotFoundException;
import com.taxedge.itr.dto.SalaryIncomeDto;
import com.taxedge.itr.entity.ItrFiling;
import com.taxedge.itr.entity.SalaryIncome;
import com.taxedge.itr.helper.RandomNumberGenerator;
import com.taxedge.itr.repository.ItrFilingRepository;
import com.taxedge.itr.repository.SalaryIncomeRepository;

@Service
public class SalaryIncomeServiceImpl implements SalaryIncomeService {

	@Autowired
	private SalaryIncomeRepository salaryIncomeRepository;

	@Autowired
	private ItrFilingRepository itrFilingRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public String registerSalaryIncome(String itrId, SalaryIncomeDto salaryIncomeDto) {

		ItrFiling itrFiling = itrFilingRepository.findById(itrId)
				.orElseThrow(() -> new ResourceNotFoundException("ITR Filing not found with itrId: " + itrId));

		SalaryIncome salaryIncome = modelMapper.map(salaryIncomeDto, SalaryIncome.class);

		String incomeId = RandomNumberGenerator.generateIncomeId();

		salaryIncome.setIncomeId(incomeId);
		salaryIncome.setItrFiling(itrFiling);

		salaryIncomeRepository.save(salaryIncome);

		return "Salary income details registered successfully. Income ID: " + incomeId;
	}

	@Override
	public String updateSalaryIncome(String incomeId, SalaryIncomeDto salaryIncomeDto) {

		SalaryIncome salaryIncome = salaryIncomeRepository.findById(incomeId).orElseThrow(
				() -> new ResourceNotFoundException("Salary income details not found with incomeId: " + incomeId));

		modelMapper.map(salaryIncomeDto, salaryIncome);

		salaryIncomeRepository.save(salaryIncome);

		return "Salary income details updated successfully";
	}

	@Override
	public SalaryIncomeDto getSalaryIncome(String incomeId) {

		SalaryIncome salaryIncome = salaryIncomeRepository.findById(incomeId).orElseThrow(
				() -> new ResourceNotFoundException("Salary income details not found with incomeId: " + incomeId));

		return modelMapper.map(salaryIncome, SalaryIncomeDto.class);
	}
}