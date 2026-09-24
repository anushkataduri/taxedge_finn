import { useState } from "react";
import {
  ApplicantDetailsForm,
  RegisteredAddressForm,
  PromoterSponsorItem,
  ProjectClassificationForm,
  ProjectLocationForm,
  LandDetailsForm,
  LandParcelItem,
  RightOfWayForm,
  UtilitiesForm,
  TechnicalDetailsForm,
  ProjectCostForm,
  MeansOfFinanceForm,
  DisbursementScheduleForm,
  ProductServiceItem,
  MarketDetailsForm,
  CustomerOfftakerItem,
  RevenueProjectionYear,
  SensitivityAnalysisForm,
  LoanRequirementForm,
  RepaymentDetailsForm,
  RepaymentScheduleRow,
  RepaymentSourcesForm,
  SensitivityRiskForm,
  SecurityCollateralItem,
  LegalApprovalsForm,
  RegulatoryComplianceForm,
  InsuranceDetailsForm,
  OtherComplianceForm,
} from "../../types/projectFinance.types";
import {
  INITIAL_PROMOTERS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_REVENUE_PROJECTIONS,
  INITIAL_REPAYMENT_SCHEDULE,
} from "../../data/projectFinanceData";
import {
  INITIAL_SECURITIES,
  INITIAL_LEGAL_APPROVALS,
  INITIAL_REGULATORY_COMPLIANCE,
  INITIAL_INSURANCE_DETAILS,
  INITIAL_OTHER_COMPLIANCE,
} from "../../data/step6Data";
import {
  DocumentUploadItem,
  INITIAL_DOCUMENTS,
} from "../../data/step7Data";

export const useProjectFinanceState = () => {
  // Step 1
  const [applicantDetails, setApplicantDetails] = useState<ApplicantDetailsForm>({
    applicantName: "",
    constitutionType: "",
    pan: "",
    cinLlpin: "",
    dateOfIncorporation: "",
    isExistingCustomer: true,
    bankingRelationship: "",
    primaryBusinessActivity: "",
  });

  const [registeredAddress, setRegisteredAddress] = useState<RegisteredAddressForm>({
    addressLine1: "",
    addressLine2: "",
    state: "",
    districtCity: "",
    pinCode: "",
  });

  const [promoters, setPromoters] = useState<PromoterSponsorItem[]>(INITIAL_PROMOTERS);

  const [projectClassification, setProjectClassification] =
    useState<ProjectClassificationForm>({
      projectName: "",
      projectSector: "",
      projectSubSector: "",
      projectType: "",
      developmentCategory: "",
    });

  // Step 2
  const [projectLocation, setProjectLocation] = useState<ProjectLocationForm>({
    projectAddress: "",
    state: "",
    district: "",
    pinCode: "",
    projectZone: "",
    nearestTown: "",
    distanceFromTown: "",
  });

  const [landDetails, setLandDetails] = useState<LandDetailsForm>({
    totalLandRequired: "",
    landAvailable: "",
    landAcquired: "",
    landPending: "",
    landOwnership: "",
    landUse: "",
    titleStatus: "",
    encumbrance: "",
    naConversionStatus: "",
  });

  const [parcels, setParcels] = useState<LandParcelItem[]>([
    {
      id: "p1",
      surveyPlotNumber: "",
      areaAcres: "",
      ownership: "",
      acquisitionStatus: "",
      titleStatus: "",
      encumbrance: "",
    },
  ]);

  const [rightOfWay, setRightOfWay] = useState<RightOfWayForm>({
    rowRequired: true,
    rowType: "",
    totalLengthKm: "",
    obtainedPendingStatus: "",
    approvalStatus: "",
    expectedCompletionDate: "",
  });

  const [utilities, setUtilities] = useState<UtilitiesForm>({
    powerSource: "",
    waterSource: "",
    approachRoad: "",
    drainageArrangement: "",
    wasteArrangement: "",
    otherInfrastructure: "",
  });

  const [technicalDetails, setTechnicalDetails] = useState<TechnicalDetailsForm>({
    technologyType: "",
    technologyDescription: "",
    technologySource: "",
    technologyProvider: "",
    technologyProven: true,
    technologyLicenseRequired: true,
    technicalConsultant: "",
  });

  // Step 3
  const [projectCost, setProjectCost] = useState<ProjectCostForm>({
    landDevelopmentCost: "",
    civilWorksCost: "",
    plantMachineryCost: "",
    engineeringKnowhowCost: "",
    preliminaryExpenses: "",
    workingCapitalMargin: "",
    contingencyMargin: "",
    totalProjectCost: "",
  });

  const [meansOfFinance, setMeansOfFinance] = useState<MeansOfFinanceForm>({
    promotersEquity: "",
    termLoanRequested: "",
    subordinatedDebt: "",
    govtGrantSubsidy: "",
    debtEquityRatio: "",
    proposedLenders: "",
  });

  const [disbursementSchedule, setDisbursementSchedule] =
    useState<DisbursementScheduleForm>({
      phase1Amount: "",
      phase1Milestone: "",
      phase2Amount: "",
      phase2Milestone: "",
      expectedCodDate: "",
    });

  // Step 4
  const [products, setProducts] = useState<ProductServiceItem[]>(INITIAL_PRODUCTS);

  const [marketDetails, setMarketDetails] = useState<MarketDetailsForm>({
    targetMarket: "",
    marketType: "",
    targetGeography: "",
    customerSegment: "",
    expectedMarketShare: "",
    majorCompetitors: "",
    competitiveAdvantage: "",
  });

  const [customers, setCustomers] = useState<CustomerOfftakerItem[]>(INITIAL_CUSTOMERS);

  const [revenueProjections, setRevenueProjections] = useState<
    RevenueProjectionYear[]
  >(INITIAL_REVENUE_PROJECTIONS);

  const [sensitivityAnalysis, setSensitivityAnalysis] =
    useState<SensitivityAnalysisForm>({
      scenario: "",
      volumeChangePercent: "",
      priceChangePercent: "",
      revenueImpactPercent: "",
    });

  // Step 5
  const [loanRequirement, setLoanRequirement] = useState<LoanRequirementForm>({
    totalProjectCost: "5,00,00,000",
    ownContribution: "1,50,00,000",
    loanRequired: "",
    typeOfLoan: "",
    schemeProduct: "",
    preferredLender: "",
    proposedDisbursementDate: "",
  });

  const [repaymentDetails, setRepaymentDetails] = useState<RepaymentDetailsForm>({
    repaymentPeriodYears: "",
    moratoriumPeriodMonths: "",
    repaymentFrequency: "",
    expectedInterestRate: "",
    repaymentStartDate: "",
    preferredEmi: "",
  });

  const [repaymentSchedule] = useState<RepaymentScheduleRow[]>(
    INITIAL_REPAYMENT_SCHEDULE
  );

  const [repaymentSources, setRepaymentSources] = useState<RepaymentSourcesForm>({
    primarySource: "",
    secondarySource: "",
    projectedDscr: "",
    explanation: "",
  });

  const [sensitivityRisk, setSensitivityRisk] = useState<SensitivityRiskForm>({
    revenueDownside: "",
    costIncrease: "",
    interestRateIncrease: "",
  });

  // Step 6
  const [securities, setSecurities] =
    useState<SecurityCollateralItem[]>(INITIAL_SECURITIES);
  const [legalApprovals, setLegalApprovals] =
    useState<LegalApprovalsForm>(INITIAL_LEGAL_APPROVALS);
  const [regulatoryCompliance, setRegulatoryCompliance] =
    useState<RegulatoryComplianceForm>(INITIAL_REGULATORY_COMPLIANCE);
  const [insuranceDetails, setInsuranceDetails] =
    useState<InsuranceDetailsForm>(INITIAL_INSURANCE_DETAILS);
  const [otherCompliance, setOtherCompliance] =
    useState<OtherComplianceForm>(INITIAL_OTHER_COMPLIANCE);

  // Step 7
  const [documents, setDocuments] =
    useState<DocumentUploadItem[]>(INITIAL_DOCUMENTS);
  const [agreeAccuracy, setAgreeAccuracy] = useState(false);
  const [agreeVerification, setAgreeVerification] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return {
    applicantDetails, setApplicantDetails,
    registeredAddress, setRegisteredAddress,
    promoters, setPromoters,
    projectClassification, setProjectClassification,
    projectLocation, setProjectLocation,
    landDetails, setLandDetails,
    parcels, setParcels,
    rightOfWay, setRightOfWay,
    utilities, setUtilities,
    technicalDetails, setTechnicalDetails,
    projectCost, setProjectCost,
    meansOfFinance, setMeansOfFinance,
    disbursementSchedule, setDisbursementSchedule,
    products, setProducts,
    marketDetails, setMarketDetails,
    customers, setCustomers,
    revenueProjections, setRevenueProjections,
    sensitivityAnalysis, setSensitivityAnalysis,
    loanRequirement, setLoanRequirement,
    repaymentDetails, setRepaymentDetails,
    repaymentSchedule,
    repaymentSources, setRepaymentSources,
    sensitivityRisk, setSensitivityRisk,
    securities, setSecurities,
    legalApprovals, setLegalApprovals,
    regulatoryCompliance, setRegulatoryCompliance,
    insuranceDetails, setInsuranceDetails,
    otherCompliance, setOtherCompliance,
    documents, setDocuments,
    agreeAccuracy, setAgreeAccuracy,
    agreeVerification, setAgreeVerification,
    showSuccessModal, setShowSuccessModal,
  };
};
