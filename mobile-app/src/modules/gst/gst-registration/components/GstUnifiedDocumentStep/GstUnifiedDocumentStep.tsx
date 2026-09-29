/**
 * Component: GstUnifiedDocumentStep
 * Refactored: Extracted massive UI blocks to GstDocumentCard and GstDocumentModals.
 */

import React, { useState } from "react";
import { View, Text, Alert, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { useDocumentUploadHelper } from "@/shared/hooks/useDocumentUploadHelper";
import { DocumentUploadBottomSheet } from "@/shared/components/DocumentUploadBottomSheet";
import { formatFileSize } from "@/modules/gst/utils/gstValidation";
import { styles, getProgressFillStyle } from "./GstUnifiedDocumentStep.styles";
import {
  DocumentPreviewModal,
  AddressProofSelectModal,
} from "./GstDocumentModals";
import { GstDocumentCard } from "./GstDocumentCard";
import {
  DocumentUploadStatus,
  DocumentDisplayStatus,
  DocumentItem,
  isDocumentUploaded,
  getDocumentStatus,
  isPdfDocument,
  STATUS_LABELS,
} from "./GstUnifiedDocumentStep.types";

export type { DocumentUploadStatus, DocumentDisplayStatus, DocumentItem };
export { isDocumentUploaded, getDocumentStatus, isPdfDocument, STATUS_LABELS };

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "pan",
    name: "PAN Card",
    subtitle: "Front copy with clear name & photo",
    required: true,
    iconName: "card",
    iconBg: "#E0F2FE",
    iconColor: "#0284C7",
    category: "Identity Proof",
  },
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    subtitle: "Front & back copy with QR code",
    required: true,
    iconName: "finger-print",
    iconBg: "#F3E8FF",
    iconColor: "#7E22CE",
    category: "Identity Proof",
  },
  {
    id: "business-proof",
    name: "Business Registration Proof",
    subtitle: "COI / Partnership Deed / Trade License",
    required: true,
    iconName: "document-text",
    iconBg: "#E0F2FE",
    iconColor: "#2563EB",
    category: "Business Proof",
  },
  {
    id: "address-proof",
    name: "Principal Place Address Proof",
    subtitle: "Electricity Bill / Rental Agreement",
    required: true,
    iconName: "home",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    category: "Business Proof",
  },
  {
    id: "bank-statement",
    name: "Bank Passbook / Cancelled Cheque",
    subtitle: "Showing account holder name, A/C & IFSC",
    required: true,
    iconName: "business",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
    category: "Financial & Signatory",
  },
  {
    id: "photograph",
    name: "Passport Size Photograph",
    subtitle: "Recent colour photo with white background",
    required: true,
    iconName: "image",
    iconBg: "#FEF0E6",
    iconColor: BrandColors.PRIMARY_ORANGE,
    category: "Financial & Signatory",
  },
];

const ADDRESS_PROOF_PLACEHOLDER = "Electricity Bill / Rental Agreement";

interface Props {
  documents: DocumentItem[];
  onUpdateDocument: (docId: string, patch: Partial<DocumentItem>) => void;
  onRetryUpload?: (docId: string) => void;
  isUploading?: boolean;
}

export const GstUnifiedDocumentStep: React.FC<Props> = ({
  documents,
  onUpdateDocument,
  onRetryUpload,
  isUploading = false,
}) => {
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const [showAddressProofModal, setShowAddressProofModal] = useState(false);
  const previewDoc = previewDocId
    ? documents.find((d) => d.id === previewDocId) || null
    : null;

  const uploadHelper = useDocumentUploadHelper({
    maxSizeMB: 10,
    allowsEditing: Platform.OS === "android",
    onProcessingStart: (docKey) => {
      if (docKey) onUpdateDocument(docKey, { uploadStatus: "processing" });
    },
    onCancel: (docKey) => {
      if (docKey) onUpdateDocument(docKey, { uploadStatus: undefined });
    },
    onError: (msg, docKey) => {
      if (docKey) onUpdateDocument(docKey, { uploadStatus: undefined });
      Alert.alert("Error", msg);
    },
    onSuccess: (file, docKey) => {
      if (!docKey) return;
      const doc = documents.find((d) => d.id === docKey);
      const isPdf = isPdfDocument({
        mimeType: file.mimeType,
        fileName: file.name,
        fileUri: file.uri,
      });
      const baseName = (doc?.name || "Document").replace(/[\s/]/g, "_");
      onUpdateDocument(docKey, {
        fileUri: file.uri,
        fileName: file.name || `${baseName}.${isPdf ? "pdf" : "jpg"}`,
        fileSize: file.size ? formatFileSize(file.size) : undefined,
        mimeType: file.mimeType || (isPdf ? "application/pdf" : "image/jpeg"),
        uploadedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        uploadStatus: undefined,
        uploadError: undefined,
        canRetry: undefined,
      });
    },
  });

  const uploadedCount = documents.reduce(
    (c, d) => (isDocumentUploaded(d) ? c + 1 : c),
    0,
  );
  const selectedCount = documents.reduce((c, d) => (d.fileUri ? c + 1 : c), 0);
  const totalCount = documents.length;
  const progressPercent =
    totalCount > 0 ? (selectedCount / totalCount) * 100 : 0;
  const categories: Array<DocumentItem["category"]> = [
    "Identity Proof",
    "Business Proof",
    "Financial & Signatory",
  ];

  const handleOpenUpload = (docId: string) => {
    try {
      isUploading &&
        (() => {
          throw new Error("SILENT_ABORT");
        })();
      const targetDoc = documents.find((d) => d.id === docId);

      targetDoc?.id === "address-proof" &&
        targetDoc.subtitle === ADDRESS_PROOF_PLACEHOLDER &&
        (() => {
          throw new Error("ADDRESS_PROOF_REQUIRED");
        })();

      uploadHelper.openUploadSheet(docId, targetDoc?.name || "Document");
    } catch (err: any) {
      const errorMap: Record<string, () => void> = {
        SILENT_ABORT: () => {},
        ADDRESS_PROOF_REQUIRED: () => {
          Alert.alert(
            "Select Document Type",
            "Please select the type of address proof first.",
            [{ text: "OK", onPress: () => setShowAddressProofModal(true) }],
          );
        },
      };
      errorMap[err.message]?.();
    }
  };

  const handleRemoveDoc = (docId: string) => {
    try {
      isUploading &&
        (() => {
          throw new Error("SILENT_ABORT");
        })();
      Alert.alert(
        "Remove Document",
        "Are you sure you want to remove this document?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              onUpdateDocument(docId, {
                fileUri: undefined,
                fileName: undefined,
                fileSize: undefined,
                mimeType: undefined,
                uploadedAt: undefined,
                uploadStatus: undefined,
                uploadError: undefined,
                canRetry: undefined,
              });
              previewDocId === docId && setPreviewDocId(null);
            },
          },
        ],
      );
    } catch (err: any) {
      // SILENT_ABORT does nothing
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressCard}>
        <View style={styles.progressRow}>
          <View style={styles.progressTitleCol}>
            <Text style={styles.progressTitle}>Document Checklist</Text>
            <Text style={styles.progressSubtitle}>
              Upload original clear photos or scanned copies
            </Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {selectedCount}/{totalCount} Added
            </Text>
          </View>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              getProgressFillStyle(progressPercent),
            ]}
          />
        </View>
        {selectedCount > 0 && (
          <Text style={styles.progressSubtitle}>
            {uploadedCount} of {selectedCount} sent to TaxEdge. Remaining
            documents upload when you tap Continue.
          </Text>
        )}
      </View>

      {categories.map((category) => {
        const categoryDocs = documents.filter(
          (doc) => doc.category === category,
        );
        return categoryDocs.length === 0 ? null : (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.docsList}>
              {categoryDocs.map((doc) => (
                <GstDocumentCard
                  key={doc.id}
                  doc={doc}
                  status={getDocumentStatus(doc)}
                  isUploading={isUploading}
                  needsAddressProof={
                    doc.id === "address-proof" &&
                    doc.subtitle === ADDRESS_PROOF_PLACEHOLDER
                  }
                  onOpenAddressModal={() => setShowAddressProofModal(true)}
                  onPreview={setPreviewDocId}
                  onReplace={handleOpenUpload}
                  onRemove={handleRemoveDoc}
                  onRetry={onRetryUpload}
                />
              ))}
            </View>
          </View>
        );
      })}

      <View style={styles.infoCallout}>
        <Ionicons
          name="shield-checkmark"
          size={20}
          color={BrandColors.PRIMARY_BLUE}
        />
        <Text style={styles.infoCalloutText}>
          Your documents are encrypted and safely stored in compliance with GST
          data protection standards.
        </Text>
      </View>

      <DocumentUploadBottomSheet
        visible={uploadHelper.isSheetVisible}
        documentTitle={uploadHelper.currentDocTitle}
        maxSizeText="10 MB"
        onClose={uploadHelper.closeUploadSheet}
        onPickFiles={uploadHelper.pickFiles}
        onPickGallery={uploadHelper.pickGallery}
        onTakePhoto={uploadHelper.takePhoto}
      />
      <DocumentPreviewModal
        previewDoc={previewDoc}
        isUploading={isUploading}
        onClose={() => setPreviewDocId(null)}
        onReplace={(id) => {
          setPreviewDocId(null);
          handleOpenUpload(id);
        }}
      />
      <AddressProofSelectModal
        visible={showAddressProofModal}
        currentValue={documents.find((d) => d.id === "address-proof")?.subtitle}
        onClose={() => setShowAddressProofModal(false)}
        onSelect={(p) => onUpdateDocument("address-proof", { subtitle: p })}
      />
    </View>
  );
};
