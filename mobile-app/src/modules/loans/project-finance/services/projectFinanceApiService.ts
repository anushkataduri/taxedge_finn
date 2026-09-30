import { loansApi } from "../../services/loansApi";
import type {
  LoanApplicationDraft,
  LoanApplicationResponse,
} from "../../types/loans.types";
import type {
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
  MarketDetailsForm,
  LoanRequirementForm,
  RepaymentDetailsForm,
  RepaymentSourcesForm,
  SecurityCollateralItem,
  RegulatoryComplianceForm,
} from "../types/projectFinance.types";
import type {
  CapacityProductionForm,
  PlantMachineryItem,
  RawMaterialItem,
  EpcExecutionForm,
  ImplementationMilestoneItem,
  ManpowerForm,
} from "../types/step2Types";
import type {
  ProductItemV2,
  CustomerItemV2,
  ProjectionSetupForm,
  WorkingCapitalForm,
} from "../types/step4Types";
import type { DocumentUploadItem } from "../data/step7Data";

export interface ProjectFinanceSubmissionPayload {
  applicantDetails: ApplicantDetailsForm;
  registeredAddress: RegisteredAddressForm;
  promoters: PromoterSponsorItem[];
  projectClassification: ProjectClassificationForm;
  projectLocation: ProjectLocationForm;
  landDetails: LandDetailsForm;
  parcels: LandParcelItem[];
  rightOfWay: RightOfWayForm;
  utilities: UtilitiesForm;
  technicalDetails: TechnicalDetailsForm;
  capacityProduction: CapacityProductionForm;
  machineries: PlantMachineryItem[];
  rawMaterials: RawMaterialItem[];
  epcExecution: EpcExecutionForm;
  milestones: ImplementationMilestoneItem[];
  manpower: ManpowerForm;
  projectCost: ProjectCostForm;
  meansOfFinance: MeansOfFinanceForm;
  disbursementSchedule: DisbursementScheduleForm;
  products: ProductItemV2[];
  marketDetails: MarketDetailsForm;
  customers: CustomerItemV2[];
  projectionSetup: ProjectionSetupForm;
  workingCapital: WorkingCapitalForm;
  loanRequirement: LoanRequirementForm;
  repaymentDetails: RepaymentDetailsForm;
  repaymentSources: RepaymentSourcesForm;
  securities: SecurityCollateralItem[];
  regulatoryCompliance: RegulatoryComplianceForm;
  documents: DocumentUploadItem[];
}

export const submitProjectFinanceLoan = async (
  payload: ProjectFinanceSubmissionPayload
): Promise<LoanApplicationResponse> => {
  const loanAmount =
    payload.loanRequirement.loanRequired.replace(/[^0-9]/g, "") || "5000000";

  const applicantName =
    payload.applicantDetails.applicantName || "Project Sponsor";

  const draft: Partial<LoanApplicationDraft> = {
    loanType: "Project Finance",
    loanTypeId: "project-finance",
    loanDetails: {
      loanType: "Project Finance",
      requiredAmount: loanAmount,
      purpose: payload.projectClassification.projectName || "Project Development",
      preferredTenureMonths: String(
        (Number(payload.repaymentDetails.repaymentPeriodYears) || 7) * 12
      ),
      existingEmi: "0",
      monthlyIncomeOrTurnover: "0",
    },
    businessDetails: {
      businessName: applicantName,
      annualTurnover: payload.projectCost.totalProjectCost || "0",
      netProfit: "0",
      gstin: payload.regulatoryCompliance.gstNumber || "",
      businessVintageYears: "5",
    },
    bankingDetails: {
      primaryBankName:
        payload.loanRequirement.preferredLender || "Lead Consortium Bank",
      accountNumber: "0000000000",
      ifscCode: "SBIN0000001",
    },
    documents: [],
  };

  return await loansApi.applyLoan(draft);
};
