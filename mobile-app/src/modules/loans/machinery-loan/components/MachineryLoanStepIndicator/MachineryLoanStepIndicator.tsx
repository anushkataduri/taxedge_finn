import React from "react";
import { LoanProgressHeader } from "@/shared/components/LoanProgressHeader";

export interface MachineryLoanStepIndicatorProps {
  title?: string;
  steps: readonly string[];
  currentStepIndex: number;
  onStepPress?: (index: number) => void;
  onBack?: () => void;
}

export const MachineryLoanStepIndicator: React.FC<MachineryLoanStepIndicatorProps> = ({
  title = "Machinery Loan",
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

export default MachineryLoanStepIndicator;
