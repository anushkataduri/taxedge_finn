import React from "react";
import { View, Text } from "react-native";
import { DocumentUploadBottomSheet } from "@/shared/components/DocumentUploadBottomSheet";
import { TdsDocumentCard } from "@/modules/itr/tds/components/upload/TdsDocumentCard/TdsDocumentCard";
import { TdsChecklistItem } from "@/modules/itr/tds/types/checklist.types";
import { LoanDocumentItem, LoanDocumentCategory } from "../../../types/loans.types";
import type { LoanDocuments } from "../../../hooks/useLoanDocuments";
import { DocumentPreviewModal } from "../../../components/DocumentPreviewModal";
import { getProgressWidth } from "../../../styles/loanScreenLayout.styles";
import { styles } from "./MachineryLoanDocumentsStep.styles";

export interface MachineryLoanDocumentsStepProps {
  /** Document checklist state from `useLoanDocuments`, owned by the screen. */
  loanDocuments: LoanDocuments;
}

const CATEGORIES: LoanDocumentCategory[] = [
  "Identity & Address",
  "Income & Banking",
  "Business & Tax",
  "Collateral & Others",
];

const mapLoanDocToTdsChecklist = (doc: LoanDocumentItem): TdsChecklistItem => {
  const isUploaded = Boolean(doc.fileUri);
  return {
    id: doc.id,
    title: doc.name,
    subtitle: doc.subtitle,
    isMandatory: doc.required,
    status: isUploaded ? "uploaded" : "not_uploaded",
    fileName: doc.fileName || (isUploaded ? doc.name : undefined),
    fileSize: doc.fileSize,
    fileUri: doc.fileUri,
  };
};

export const MachineryLoanDocumentsStep: React.FC<MachineryLoanDocumentsStepProps> = ({ loanDocuments }) => {
  const { documents, progress, openUpload, removeDocument, openPreview, uploadSheetProps, previewModalProps } =
    loanDocuments;
  const { uploadedRequired, totalRequired, requiredPercent } = progress;

  const renderDocumentCard = (doc: LoanDocumentItem) => (
    <TdsDocumentCard
      key={doc.id}
      item={mapLoanDocToTdsChecklist(doc)}
      onUploadPress={() => openUpload(doc.id)}
      onChange={() => openUpload(doc.id)}
      onDelete={() => removeDocument(doc.id)}
      onView={() => openPreview(doc.id)}
    />
  );

  const renderCategorySection = (category: LoanDocumentCategory) => {
    const categoryDocs = documents.filter((d) => d.category === category);
    if (categoryDocs.length === 0) return null;

    return (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryHeader}>{category}</Text>
        {categoryDocs.map(renderDocumentCard)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Required Documents</Text>
      <Text style={styles.sectionSubtitle}>
        Upload minimum KYC, bank statement and OEM quotation to process machinery loan.
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Required documents</Text>
          <Text style={styles.progressCount}>
            {uploadedRequired} / {totalRequired} ({requiredPercent}%)
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              requiredPercent === 100 && styles.progressBarFillComplete,
              getProgressWidth(requiredPercent),
            ]}
          />
        </View>
      </View>

      {/* Categorized Document List */}
      {CATEGORIES.map(renderCategorySection)}

      <DocumentUploadBottomSheet {...uploadSheetProps} />
      <DocumentPreviewModal {...previewModalProps} />
    </View>
  );
};

export default MachineryLoanDocumentsStep;
