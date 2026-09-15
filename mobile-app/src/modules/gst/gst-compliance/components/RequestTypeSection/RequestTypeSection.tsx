/**
 * Component: RequestTypeSection
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useTheme } from "@/shared/hooks/useTheme";
import { BrandColors } from "@/shared/theme";
import {
  ComplianceFormData,
  UploadedDocInfo,
  ValidationErrors,
} from "@/modules/gst/validation/complianceSchema";
import {
  RECONCILIATION_ALLOWED_EXTENSIONS,
  NOTICE_ALLOWED_EXTENSIONS,
} from "@/modules/gst/utils/gstValidation";
import { FileUploadCard } from "../FileUploadCard/FileUploadCard";
import { NativeDatePickerInput } from "../NativeDatePickerInput/NativeDatePickerInput";
import { FloatingLabelInput } from "../FloatingLabelInput/FloatingLabelInput";
import { styles, getSectionHeaderColor } from "./RequestTypeSection.styles";

export interface RequestTypeSectionProps {
  formData: ComplianceFormData;
  errors: ValidationErrors;
  onUpdateField: <K extends keyof ComplianceFormData>(
    field: K,
    value: ComplianceFormData[K]
  ) => void;
  onClearError: (field: keyof ValidationErrors) => void;
  onScrollField?: (fieldName: string) => void;
}

export const RequestTypeSection: React.FC<RequestTypeSectionProps> = ({
  formData,
  errors,
  onUpdateField,
  onClearError,
  onScrollField,
}) => {
  const { isDark } = useTheme();

  if (!formData.requestType) return null;

  if (formData.requestType === "Reconciliation Support") {
    return (
      <Animated.View
        entering={FadeInDown.duration(280)}
        exiting={FadeOutUp.duration(200)}
        style={styles.sectionContainer}
      >
        <Text style={[styles.sectionHeader, getSectionHeaderColor(isDark)]}>
          Reconciliation Documents
        </Text>

        {/* 1. Purchase Register (Required) */}
        <FileUploadCard
          title="Purchase Register"
          required
          allowedExtensions={RECONCILIATION_ALLOWED_EXTENSIONS}
          uploadedDoc={formData.purchaseDoc}
          onDocChange={(doc: UploadedDocInfo | null) => {
            onUpdateField("purchaseDoc", doc);
            if (doc) onClearError("purchaseDoc");
          }}
          error={errors.purchaseDoc}
          onClearError={() => onClearError("purchaseDoc")}
        />

        {/* 2. Sales Register (Required) */}
        <FileUploadCard
          title="Sales Register"
          required
          allowedExtensions={RECONCILIATION_ALLOWED_EXTENSIONS}
          uploadedDoc={formData.salesDoc}
          onDocChange={(doc: UploadedDocInfo | null) => {
            onUpdateField("salesDoc", doc);
            if (doc) onClearError("salesDoc");
          }}
          error={errors.salesDoc}
          onClearError={() => onClearError("salesDoc")}
        />

        {/* 3. GSTR-2B Reference (Optional Floating Label) */}
        <FloatingLabelInput
          label="GSTR-2B Reference"
          floatingLabel="GSTR-2B Reference"
          placeholder="Enter GSTR-2B reference or ARN"
          value={formData.gstr2bRef}
          onChangeText={(text) => onUpdateField("gstr2bRef", text)}
          autoCapitalize="characters"
          cardBackground={isDark ? "#0F172A" : "#F8FAFC"}
          onClear={() => onUpdateField("gstr2bRef", "")}
          onFocusScroll={() => onScrollField?.("gstr2bRef")}
        />

        {/* 4. Remarks (Optional Floating Label Multiline) */}
        <FloatingLabelInput
          label="Remarks (Optional)"
          floatingLabel="Remarks (Optional)"
          placeholder="Tell us anything our CA should know..."
          value={formData.reconciliationRemarks}
          onChangeText={(text) => onUpdateField("reconciliationRemarks", text)}
          multiline
          numberOfLines={3}
          cardBackground={isDark ? "#0F172A" : "#F8FAFC"}
          onFocusScroll={() => onScrollField?.("reconciliationRemarks")}
        />
      </Animated.View>
    );
  }

  // Notice Response Form
  return (
    <Animated.View
      entering={FadeInDown.duration(280)}
      exiting={FadeOutUp.duration(200)}
      style={styles.sectionContainer}
    >
      <Text style={[styles.sectionHeader, getSectionHeaderColor(isDark)]}>
        Notice Details & Response
      </Text>

      {/* 1. Notice Number (Required Floating Label) */}
      <FloatingLabelInput
        label="Notice Number"
        floatingLabel="Notice Number"
        placeholder="Enter notice number"
        required
        value={formData.noticeNumber}
        onChangeText={(text) => {
          onUpdateField("noticeNumber", text);
          if (text) onClearError("noticeNumber");
        }}
        autoCapitalize="characters"
        error={errors.noticeNumber}
        cardBackground={isDark ? "#0F172A" : "#F8FAFC"}
        onClear={() => {
          onUpdateField("noticeNumber", "");
          onClearError("noticeNumber");
        }}
        onFocusScroll={() => onScrollField?.("noticeNumber")}
      />

      {/* 2. Notice Issue Date (Required) */}
      <NativeDatePickerInput
        label="Notice Issue Date"
        value={formData.noticeIssueDate}
        onChange={(date) => {
          onUpdateField("noticeIssueDate", date);
          onClearError("noticeIssueDate");
        }}
        required
        error={errors.noticeIssueDate}
        placeholder="Select Notice Issue Date"
      />

      {/* 3. Reply Due Date (Required) */}
      <NativeDatePickerInput
        label="Reply Due Date"
        value={formData.replyDueDate}
        onChange={(date) => {
          onUpdateField("replyDueDate", date);
          onClearError("replyDueDate");
        }}
        required
        error={errors.replyDueDate}
        placeholder="Select Reply Due Date"
      />

      {/* 4. Upload Notice Copy (Required) */}
      <FileUploadCard
        title="Upload Notice Copy"
        required
        allowedExtensions={NOTICE_ALLOWED_EXTENSIONS}
        uploadedDoc={formData.noticeDoc}
        onDocChange={(doc: UploadedDocInfo | null) => {
          onUpdateField("noticeDoc", doc);
          if (doc) onClearError("noticeDoc");
        }}
        error={errors.noticeDoc}
        onClearError={() => onClearError("noticeDoc")}
      />

      {/* 5. Remarks (Optional Floating Label Multiline) */}
      <FloatingLabelInput
        label="Remarks (Optional)"
        floatingLabel="Remarks (Optional)"
        placeholder="Add any important information for our CA"
        value={formData.noticeRemarks}
        onChangeText={(text) => onUpdateField("noticeRemarks", text)}
        multiline
        numberOfLines={3}
        cardBackground={isDark ? "#0F172A" : "#F8FAFC"}
        onFocusScroll={() => onScrollField?.("noticeRemarks")}
      />
    </Animated.View>
  );
};
