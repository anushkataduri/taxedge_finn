import React, { useState } from "react";
import {
  LoanRequirementCard,
  RepaymentDetailsCard,
  RepaymentScheduleCard,
  RepaymentSourcesCard,
  SensitivityRiskCard,
} from "../index";
import {
  LoanRequirementForm,
  RepaymentDetailsForm,
  RepaymentScheduleRow,
  RepaymentSourcesForm,
  SensitivityRiskForm,
} from "../../types/projectFinance.types";

interface Step5LoanRequirementViewProps {
  loanRequirement: LoanRequirementForm;
  onRequirementChange: (field: keyof LoanRequirementForm, value: any) => void;
  repaymentDetails: RepaymentDetailsForm;
  onRepaymentChange: (field: keyof RepaymentDetailsForm, value: any) => void;
  repaymentSchedule: RepaymentScheduleRow[];
  repaymentSources: RepaymentSourcesForm;
  onSourcesChange: (field: keyof RepaymentSourcesForm, value: any) => void;
  sensitivityRisk: SensitivityRiskForm;
  onRiskChange: (field: keyof SensitivityRiskForm, value: string) => void;
}

export const Step5LoanRequirementView: React.FC<Step5LoanRequirementViewProps> = ({
  loanRequirement,
  onRequirementChange,
  repaymentDetails,
  onRepaymentChange,
  repaymentSchedule,
  repaymentSources,
  onSourcesChange,
  sensitivityRisk,
  onRiskChange,
}) => {
  const [expanded, setExpanded] = useState({
    requirement: true,
    repayment: true,
    schedule: true,
    sources: true,
    risk: true,
  });

  return (
    <>
      <LoanRequirementCard
        data={loanRequirement}
        onChange={onRequirementChange}
        isExpanded={expanded.requirement}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, requirement: !p.requirement }))
        }
      />

      <RepaymentDetailsCard
        data={repaymentDetails}
        onChange={onRepaymentChange}
        isExpanded={expanded.repayment}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, repayment: !p.repayment }))
        }
      />

      <RepaymentScheduleCard
        schedule={repaymentSchedule}
        loanAmount={loanRequirement.loanRequired || "0"}
        interestRate={repaymentDetails.expectedInterestRate || "0"}
        tenureYears={
          repaymentDetails.repaymentPeriodYears
            ? repaymentDetails.repaymentPeriodYears.replace(/[^0-9]/g, "")
            : "0"
        }
        emi={repaymentDetails.preferredEmi || "0"}
        isExpanded={expanded.schedule}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, schedule: !p.schedule }))
        }
      />

      <RepaymentSourcesCard
        data={repaymentSources}
        onChange={onSourcesChange}
        isExpanded={expanded.sources}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, sources: !p.sources }))
        }
      />

      <SensitivityRiskCard
        data={sensitivityRisk}
        onChange={onRiskChange}
        isExpanded={expanded.risk}
        onToggleExpand={() => setExpanded((p) => ({ ...p, risk: !p.risk }))}
      />
    </>
  );
};

export default Step5LoanRequirementView;
