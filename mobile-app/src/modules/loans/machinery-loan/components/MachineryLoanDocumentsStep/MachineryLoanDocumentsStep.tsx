import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { DocumentUploadBottomSheet } from "@/shared/components/DocumentUploadBottomSheet";
import { TdsDocumentCard } from "@/modules/itr/tds/components/upload/TdsDocumentCard/TdsDocumentCard";
import { TdsChecklistItem } from "@/modules/itr/tds/types/checklist.types";
import { LoanDocumentItem, LoanDocumentCategory } from "../../../types/loans.types";
import type { LoanDocuments } from "../../../hooks/useLoanDocuments";
import { DocumentPreviewModal } from "../../../components/DocumentPreviewModal";
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
  const { documents, openUpload, removeDocument, openPreview, uploadSheetProps, previewModalProps } =
    loanDocuments;

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

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Identity & Address":
        return "person";
      case "Income & Banking":
        return "card";
      case "Business & Tax":
        return "briefcase";
      default:
        return "document-text";
    }
  };

  const renderCategorySection = (category: LoanDocumentCategory) => {
    const categoryDocs = documents.filter((d) => d.category === category);
    if (categoryDocs.length === 0) return null;

    return (
      <View key={category} style={styles.categoryContainer}>
        <View style={styles.categoryHeaderRow}>
          <View style={styles.categoryIconBox}>
            <Ionicons
              name={getCategoryIcon(category)}
              size={14}
              color={BrandColors.PRIMARY_ORANGE || "#FF7A00"}
            />
          </View>
          <Text style={styles.categoryHeader}>{category}</Text>
        </View>
        {categoryDocs.map(renderDocumentCard)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Categorized Document List */}
      {CATEGORIES.map(renderCategorySection)}

      <DocumentUploadBottomSheet {...uploadSheetProps} />
      <DocumentPreviewModal {...previewModalProps} />
    </View>
  );
};

export default MachineryLoanDocumentsStep;
