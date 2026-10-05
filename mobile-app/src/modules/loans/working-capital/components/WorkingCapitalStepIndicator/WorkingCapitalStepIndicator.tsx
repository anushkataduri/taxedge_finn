import React from "react";
import { LoanProgressHeader } from "@/shared/components/LoanProgressHeader";

export interface WorkingCapitalStepIndicatorProps {
  title?: string;
  steps: readonly string[];
  currentStepIndex: number;
  onStepPress?: (index: number) => void;
  onBack?: () => void;
}

export const WorkingCapitalStepIndicator: React.FC<WorkingCapitalStepIndicatorProps> = ({
  title = "Working Capital Loan",
  steps,
  currentStepIndex,
  onBack,
}) => {
  return (
    <LoanProgressHeader
      title={title}
      currentStep={currentStepIndex + 1}
      totalSteps={steps.length}
      subtitle={steps[currentStepIndex] || ""}
      onBack={onBack}
    />
  );
};

export default WorkingCapitalStepIndicator;
