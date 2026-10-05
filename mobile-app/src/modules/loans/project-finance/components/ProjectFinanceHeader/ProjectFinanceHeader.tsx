import React from "react";
import { LoanProgressHeader } from "@/shared/components/LoanProgressHeader";

export interface ProjectFinanceHeaderProps {
  onBack: () => void;
  title?: string;
  currentStep: number;
  totalSteps?: number;
  stepTitle: string;
}

export const ProjectFinanceHeader: React.FC<ProjectFinanceHeaderProps> = ({
  onBack,
  title = "Project Finance",
  currentStep,
  totalSteps = 7,
  stepTitle,
}) => {
  return (
    <LoanProgressHeader
      title={title}
      currentStep={currentStep}
      totalSteps={totalSteps}
      subtitle={stepTitle}
      onBack={onBack}
    />
  );
};

export default ProjectFinanceHeader;
