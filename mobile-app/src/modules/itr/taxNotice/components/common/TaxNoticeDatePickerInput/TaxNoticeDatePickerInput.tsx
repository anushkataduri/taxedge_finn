import React from "react";
import {
  UniversalDatePicker,
  parseStringToDate,
  formatDateToString,
} from "@/shared/components/UniversalDatePicker";

export { parseStringToDate, formatDateToString };

export interface TaxNoticeDatePickerInputProps {
  label: string;
  value: string;
  onChange: (formattedDate: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  helperText?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  validateMinDate?: string;
}

export const TaxNoticeDatePickerInput: React.FC<TaxNoticeDatePickerInputProps> = (props) => {
  return <UniversalDatePicker {...props} />;
};

export default TaxNoticeDatePickerInput;
