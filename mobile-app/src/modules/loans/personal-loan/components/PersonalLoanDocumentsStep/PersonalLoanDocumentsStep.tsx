import React, { useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { DocumentUploadBottomSheet } from "../../../../../shared/components/DocumentUploadBottomSheet";
import { useDocumentUploadHelper } from "../../../../../shared/hooks/useDocumentUploadHelper";
import {
  LoanDocumentItem,
  LoanDocumentCategory,
} from "../../../types/loans.types";
import { styles } from "./PersonalLoanDocumentsStep.styles";

export interface PersonalLoanDocumentsStepProps {
  documents: LoanDocumentItem[];
  onDocumentUploaded: (
    docId: string,
    fileUri: string,
    fileName: string,
    fileSize: string
  ) => void;
  onDocumentRemoved: (docId: string) => void;
  scrollRef?: React.RefObject<ScrollView | null>;
}

const CATEGORIES: LoanDocumentCategory[] = [
  "Identity & Address",
  "Income & Banking",
  "Business & Tax",
  "Collateral & Others",
];

export const PersonalLoanDocumentsStep: React.FC<PersonalLoanDocumentsStepProps> = ({
  documents,
  onDocumentUploaded,
  onDocumentRemoved,
  scrollRef,
}) => {
  const documentPositions = useRef<Record<string, number>>({});
  const uploadHelper = useDocumentUploadHelper({
    scrollRef,
    onSuccess: (file, docId) => {
      if (!docId) return;
      const size = file.size
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : "2.4 MB";
      onDocumentUploaded(docId, file.uri, file.name, size);
    },
  });

  const totalRequired = documents.filter((d) => d.required).length;
  const uploadedRequired = documents.filter(
    (d) => d.required && Boolean(d.fileUri)
  ).length;
  const progressPercent =
    totalRequired > 0
      ? Math.round((uploadedRequired / totalRequired) * 100)
      : 100;

  const handleOpenUploadSheet = (docId: string, title: string) => {
    uploadHelper.openUploadSheet(docId, title, documentPositions.current[docId]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Document Verification Dossier</Text>
      <Text style={styles.sectionSubtitle}>
        Checklist for Personal Loan. Upload clear digital copies to expedite sanction.
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Mandatory Document Progress</Text>
          <Text style={styles.progressCount}>
            {uploadedRequired} of {totalRequired} ({progressPercent}%)
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              backgroundColor:
                progressPercent === 100 ? BrandColors.PRIMARY_ORANGE : BrandColors.PRIMARY_BLUE,
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      {/* Categorized Document List */}
      {CATEGORIES.map((category) => {
        const categoryDocs = documents.filter((d) => d.category === category);
        if (categoryDocs.length === 0) return null;

        return (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryHeader}>{category}</Text>
            {categoryDocs.map((doc) => {
              const isUploaded = Boolean(doc.fileUri);

              return (
                <View
                  key={doc.id}
                  onLayout={(event) => {
                    documentPositions.current[doc.id] = event.nativeEvent.layout.y;
                  }}
                  style={[
                    styles.docCard,
                    isUploaded && styles.docCardUploaded,
                  ]}
                >
                  <View style={styles.docLeft}>
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: doc.iconBg || "#F1F5F9" },
                      ]}
                    >
                      <Ionicons
                        name={(doc.iconName as any) || "document-text"}
                        size={20}
                        color={doc.iconColor || BrandColors.PRIMARY_BLUE}
                      />
                    </View>

                    <View style={styles.docInfo}>
                      <View style={styles.docNameRow}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        {doc.required ? (
                          <View style={styles.requiredBadge}>
                            <Text style={styles.requiredText}>Required</Text>
                          </View>
                        ) : (
                          <View style={styles.optionalBadge}>
                            <Text style={styles.optionalText}>Optional</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.docSubtitle} numberOfLines={2}>
                        {doc.subtitle}
                      </Text>

                      {isUploaded && (
                        <View style={styles.fileMetaRow}>
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color={BrandColors.PRIMARY_ORANGE}
                          />
                          <Text style={styles.fileNameText} numberOfLines={1}>
                            {doc.fileName || "Uploaded"}
                          </Text>
                          <Text style={styles.fileSizeText}>
                            ({doc.fileSize || "1.2 MB"})
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {isUploaded ? (
                    <View style={styles.uploadActions}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleOpenUploadSheet(doc.id, doc.name)}
                        style={styles.replaceButton}
                      >
                        <Ionicons name="refresh" size={14} color={BrandColors.PRIMARY_ORANGE} />
                        <Text style={styles.replaceButtonText}>Replace</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onDocumentRemoved(doc.id)}
                        style={styles.removeButton}
                      >
                        <Ionicons name="trash-outline" size={14} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleOpenUploadSheet(doc.id, doc.name)}
                      style={styles.uploadButton}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={14}
                        color={BrandColors.PRIMARY_BLUE}
                      />
                      <Text style={styles.uploadButtonText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}

      <DocumentUploadBottomSheet
        visible={uploadHelper.isSheetVisible}
        documentTitle={uploadHelper.currentDocTitle}
        maxSizeBytesText="10 MB"
        onClose={uploadHelper.closeUploadSheet}
        onPickFiles={uploadHelper.pickFiles}
        onPickGallery={uploadHelper.pickGallery}
        onTakePhoto={uploadHelper.takePhoto}
        allowGallery={!['bank-statements', 'salary-slips'].includes(uploadHelper.activeDocKey || '')}
        allowCamera={!['bank-statements', 'salary-slips'].includes(uploadHelper.activeDocKey || '')}
      />
    </View>
  );
};

export default PersonalLoanDocumentsStep;
