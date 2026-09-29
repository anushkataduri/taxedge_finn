import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  LoanDocumentItem,
  LoanDocumentCategory,
} from "../../../types/loans.types";
import {
  DocumentUploadModal,
  UploadedFileInfo,
} from "@/modules/itr/itr-filing/components/DocumentUploadModal/DocumentUploadModal";
import { DocumentPreviewModal } from "@/modules/itr/itr-filing/components/DocumentPreviewModal/DocumentPreviewModal";
import { TdsDocumentCard } from "@/modules/itr/tds/components/upload/TdsDocumentCard/TdsDocumentCard";
import { TdsChecklistItem } from "@/modules/itr/tds/types/checklist.types";
import { ItrDocumentItem } from "@/modules/itr/itr-filing/types/itrFiling.types";
import { styles } from "./WorkingCapitalDocumentsStep.styles";

export interface WorkingCapitalDocumentsStepProps {
  documents: LoanDocumentItem[];
  onDocumentUploaded: (
    docId: string,
    fileUri: string,
    fileName: string,
    fileSize: string
  ) => void;
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

const mapLoanDocToItrDoc = (doc: LoanDocumentItem): ItrDocumentItem => ({
  id: doc.id,
  name: doc.name,
  subtitle: doc.subtitle || "",
  tier: doc.required ? "REQUIRED" : "RECOMMENDED",
  required: doc.required,
  docGroup: "common",
  fileUri: doc.fileUri,
  fileName: doc.fileName || (doc.fileUri ? doc.name : undefined),
  fileSize: doc.fileSize,
});

export const WorkingCapitalDocumentsStep: React.FC<WorkingCapitalDocumentsStepProps> = ({
  documents,
  onDocumentUploaded,
}) => {
  const [activeUploadDoc, setActiveUploadDoc] = useState<LoanDocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<LoanDocumentItem | null>(null);

  const handleUploadClick = (doc: LoanDocumentItem) => {
    setActiveUploadDoc(doc);
  };

  const handleCloseUploadModal = () => {
    setActiveUploadDoc(null);
  };

  const handleFilePicked = (file: UploadedFileInfo) => {
    if (!activeUploadDoc) return;
    onDocumentUploaded(activeUploadDoc.id, file.uri, file.name, file.size);
    handleCloseUploadModal();
  };

  const handleDeleteDocument = (docId: string) => {
    onDocumentUploaded(docId, "", "", "");
  };

  const handleOpenPreview = (doc: LoanDocumentItem) => {
    setPreviewDoc(doc);
  };

  const handleClosePreview = () => {
    setPreviewDoc(null);
  };

  const handleChangeFromPreview = (itrDoc: ItrDocumentItem) => {
    const docToUpload = documents.find((d) => d.id === itrDoc.id) || previewDoc;
    handleClosePreview();
    if (docToUpload) {
      handleUploadClick(docToUpload);
    }
  };

  const getCategoryDocs = (category: LoanDocumentCategory): LoanDocumentItem[] =>
    documents.filter((d) => d.category === category);

  const renderDocumentCard = (doc: LoanDocumentItem) => {
    const tdsItem = mapLoanDocToTdsChecklist(doc);
    return (
      <TdsDocumentCard
        key={doc.id}
        item={tdsItem}
        onUploadPress={() => handleUploadClick(doc)}
        onChange={() => handleUploadClick(doc)}
        onDelete={() => handleDeleteDocument(doc.id)}
        onView={() => handleOpenPreview(doc)}
      />
    );
  };

  const renderCategorySection = (category: LoanDocumentCategory) => {
    const categoryDocs = getCategoryDocs(category);
    if (categoryDocs.length === 0) return null;

    return (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryHeader}>{category}</Text>
        {categoryDocs.map(renderDocumentCard)}
      </View>
    );
  };

  const previewItrDoc = previewDoc ? mapLoanDocToItrDoc(previewDoc) : null;

  return (
    <View style={styles.container}>
      {/* Categorized Document List */}
      {CATEGORIES.map(renderCategorySection)}

      {/* Upload Modal */}
      {activeUploadDoc && (
        <DocumentUploadModal
          visible={Boolean(activeUploadDoc)}
          docTitle={activeUploadDoc.name}
          onFilePicked={handleFilePicked}
          onClose={handleCloseUploadModal}
        />
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          visible={Boolean(previewDoc)}
          document={previewItrDoc}
          onClose={handleClosePreview}
          onChangeFile={handleChangeFromPreview}
        />
      )}
    </View>
  );
};

export default WorkingCapitalDocumentsStep;



