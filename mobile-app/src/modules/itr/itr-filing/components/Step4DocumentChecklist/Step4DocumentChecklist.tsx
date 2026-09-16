import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { ItrDocumentItem } from "../../types/itrFiling.types";
import {
  DocumentUploadModal,
  UploadedFileInfo,
} from "../DocumentUploadModal/DocumentUploadModal";
import { DocumentPreviewModal } from "../DocumentPreviewModal/DocumentPreviewModal";
import { styles, getProgressBarFill } from "./Step4DocumentChecklist.styles";

interface Step4DocumentChecklistProps {
  documents: ItrDocumentItem[];
  onUpdateDocument: (docId: string, fileInfo: UploadedFileInfo | null) => void;
  onContinue: () => void;
}

export const Step4DocumentChecklist: React.FC<Step4DocumentChecklistProps> = ({
  documents,
  onUpdateDocument,
  onContinue,
}) => {
  const [activeUploadDoc, setActiveUploadDoc] = useState<ItrDocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ItrDocumentItem | null>(null);

  // Pure functional progress computation - starts at 0 of X uploaded (0% Ready)
  const uploadedCount = documents.reduce(
    (count, doc) => (Boolean(doc.fileUri) ? count + 1 : count),
    0
  );
  const totalCount = documents.length;
  const progressPercent = totalCount > 0 ? Math.round((uploadedCount / totalCount) * 100) : 0;

  const handleUploadClick = (doc: ItrDocumentItem) => {
    setActiveUploadDoc(doc);
  };

  const handleFilePicked = (file: UploadedFileInfo) => {
    if (!activeUploadDoc) return;
    onUpdateDocument(activeUploadDoc.id, file);
    setActiveUploadDoc(null);
  };

  const handleRemoveDoc = (docId: string) => {
    Alert.alert(
      "Remove Document",
      "Are you sure you want to remove this uploaded file?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onUpdateDocument(docId, null),
        },
      ]
    );
  };

  const handleContinuePress = () => {
    const missingRequired = documents.filter((doc) => doc.required && !doc.fileUri);

    if (missingRequired.length > 0) {
      const missingNames = missingRequired.map((d) => `• ${d.name} *`).join("\n");
      Alert.alert(
        "Mandatory Documents Required",
        `Please upload the following required documents (marked with *) before proceeding:\n\n${missingNames}`
      );
      return;
    }

    onContinue();
  };

  const renderDocCard = (doc: ItrDocumentItem) => {
    const isUploaded = Boolean(doc.fileUri);
    const isVerified = doc.isProfileVerified;

    return (
      <View
        key={doc.id}
        style={[
          styles.docCard,
          isUploaded ? styles.docCardUploaded : null,
          isVerified ? styles.docCardVerified : null,
        ]}
      >
        <View style={styles.docTopRow}>
          <View
            style={[
              styles.docIconBox,
              isUploaded ? styles.docIconBoxDone : null,
              isVerified ? styles.docIconBoxVerified : null,
            ]}
          >
            <Ionicons
              name={(doc.iconName as any) || "document-text-outline"}
              size={20}
              color={isUploaded ? "#059669" : isVerified ? "#166534" : "#083B75"}
            />
          </View>

          <View style={styles.docInfoCol}>
            <View style={styles.docTitleRow}>
              <View style={styles.docTitleLeft}>
                <Text style={styles.docName}>{doc.name}</Text>
                {doc.required && <Text style={styles.requiredAsterisk}>*</Text>}
              </View>
              {isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={10} color="#166534" />
                  <Text style={styles.verifiedBadgeText}>Verified</Text>
                </View>
              )}
            </View>

            <Text style={styles.docSubtitle}>
              {doc.profileVerifiedLabel || doc.subtitle}
            </Text>

            {isUploaded && doc.fileName && (
              <View style={styles.metaRow}>
                <Ionicons name="checkmark-circle" size={13} color="#059669" />
                <Text style={styles.uploadedFileName} numberOfLines={1}>
                  {doc.fileName} ({doc.fileSize || "< 2 MB"})
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {!isVerified && (
          <View style={styles.docActionsRow}>
            {isUploaded ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.viewBtn}
                  onPress={() => setPreviewDoc(doc)}
                >
                  <Ionicons name="eye-outline" size={15} color="#083B75" />
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.changeBtn}
                  onPress={() => handleUploadClick(doc)}
                >
                  <Ionicons name="swap-horizontal-outline" size={15} color={BrandColors.PRIMARY_ORANGE} />
                  <Text style={styles.changeBtnText}>Change</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.removeBtn}
                  onPress={() => handleRemoveDoc(doc.id)}
                >
                  <Ionicons name="trash-outline" size={15} color="#DC2626" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.uploadBtn}
                onPress={() => handleUploadClick(doc)}
              >
                <Ionicons name="cloud-upload-outline" size={15} color="#083B75" />
                <Text style={styles.uploadBtnText}>Upload File</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Upload Progress Tracker */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeaderRow}>
          <Text style={styles.progressCounterText}>
            Checklist Status: {uploadedCount} of {totalCount} uploaded
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{progressPercent}% Ready</Text>
          </View>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={getProgressBarFill(progressPercent)} />
        </View>

        <View style={styles.instructionRow}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#083B75" />
          <View style={styles.instructionTextCol}>
            <Text style={styles.instructionTitle}>Document Checklist</Text>
            <Text style={styles.instructionDetail}>
              Documents are dynamically determined from your declared income sources. PAN and Aadhaar are auto-verified from your profile.
            </Text>
          </View>
        </View>
      </View>

      {/* Unified Documents Checklist */}
      <View style={styles.groupSection}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>Documents Checklist</Text>
        </View>
        <View style={styles.docsList}>{documents.map(renderDocCard)}</View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.continueButton}
        onPress={handleContinuePress}
      >
        <Text style={styles.continueButtonText}>Review Return Summary</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Upload Modal */}
      {activeUploadDoc && (
        <DocumentUploadModal
          visible={Boolean(activeUploadDoc)}
          docTitle={activeUploadDoc.name}
          onFilePicked={handleFilePicked}
          onClose={() => setActiveUploadDoc(null)}
        />
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          visible={Boolean(previewDoc)}
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onChangeFile={(doc) => {
            setPreviewDoc(null);
            setActiveUploadDoc(doc);
          }}
        />
      )}
    </View>
  );
};
