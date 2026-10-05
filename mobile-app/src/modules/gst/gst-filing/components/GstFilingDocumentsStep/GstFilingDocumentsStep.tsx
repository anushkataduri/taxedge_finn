import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  pickImageAssetFromGallery,
  pickImageAssetFromCamera,
} from "@/modules/gst/utils/imageUploadHelper";
import { formatFileSize } from "@/modules/gst/utils/gstValidation";
import {
  DocumentBadgeType,
  FilingDocItem,
  INITIAL_FILING_DOCS,
} from "@/modules/gst/gst-filing/config/gstFilingDocumentsConfig";
import { styles, getProgressFillStyle } from "@/modules/gst/gst-filing/components/GstFilingDocumentsStep/GstFilingDocumentsStep.styles";
import {
  FILING_DOC_CATEGORIES,
  countUploadedDocuments,
  updateDocumentInList,
} from "@/modules/gst/gst-filing/components/GstFilingDocumentsStep/gstDocStepUtils";
import { RecursiveCategorySections } from "@/modules/gst/gst-filing/components/GstFilingDocumentsStep/RecursiveDocSections";
import { GstDocumentPreviewModal } from "@/modules/gst/gst-filing/components/GstFilingDocumentsStep/GstDocumentPreviewModal";

export type { DocumentBadgeType, FilingDocItem };
export { INITIAL_FILING_DOCS };

interface GstFilingDocumentsStepProps {
  documents?: FilingDocItem[];
  onUpdateDocuments?: (updatedDocs: FilingDocItem[]) => void;
  filingPeriodText?: string;
  filingNature?: "Regular Return" | "Nil Return";
}

export const GstFilingDocumentsStep: React.FC<GstFilingDocumentsStepProps> = ({
  documents: externalDocuments,
  onUpdateDocuments,
  filingPeriodText = "GSTR-3B — July 2026",
  filingNature = "Regular Return",
}) => {
  const [internalDocs, setInternalDocs] = useState<FilingDocItem[]>(INITIAL_FILING_DOCS);
  const [previewDoc, setPreviewDoc] = useState<FilingDocItem | null>(null);

  const documents = externalDocuments || internalDocs;

  const setDocs = (newDocs: FilingDocItem[]) => {
    if (onUpdateDocuments) {
      onUpdateDocuments(newDocs);
    } else {
      setInternalDocs(newDocs);
    }
  };

  const uploadedCount = countUploadedDocuments(documents);
  const totalCount = documents.length;
  const progressPercent = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;

  const handleUploadOption = async (docId: string, source: "gallery" | "camera") => {
    const asset =
      source === "camera"
        ? await pickImageAssetFromCamera()
        : await pickImageAssetFromGallery();

    if (asset) {
      const updatedList = updateDocumentInList(documents, docId, (doc) => ({
        ...doc,
        fileUri: asset.uri,
        fileName: `${doc.name.replace(/[\s/()&]/g, "_")}.jpg`,
        fileSize: asset.fileSize ? formatFileSize(asset.fileSize) : undefined,
        uploadedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setDocs(updatedList);
    }
  };

  const handlePromptUpload = (docId: string) => {
    Alert.alert("Upload Document", "Choose source to select document image:", [
      { text: "Camera", onPress: () => handleUploadOption(docId, "camera") },
      { text: "Photo Gallery", onPress: () => handleUploadOption(docId, "gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemoveDoc = (docId: string) => {
    Alert.alert(
      "Remove Document",
      "Are you sure you want to remove this uploaded filing document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updated = updateDocumentInList(documents, docId, (doc) => ({
              ...doc,
              fileUri: undefined,
              fileName: undefined,
              fileSize: undefined,
              uploadedAt: undefined,
            }));
            setDocs(updated);
            if (previewDoc?.id === docId) {
              setPreviewDoc(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Guidance Advisory */}
      <View style={styles.banner}>
        <Ionicons name="information-circle-outline" size={18} color="#083B75" />
        <Text style={styles.bannerText}>
          Upload documents for{" "}
          <Text style={styles.boldText}>{filingPeriodText}</Text>. Clear invoices
          ensure 100% accurate Input Tax Credit (ITC) claim.
        </Text>
      </View>

      {/* Nil Return Informative Banner */}
      {filingNature === "Nil Return" ? (
        <View style={styles.nilBanner}>
          <Ionicons name="checkmark-done-circle" size={22} color="#15803D" />
          <View style={styles.nilBannerTextCol}>
            <Text style={styles.nilBannerTitle}>Nil Return Selected</Text>
            <Text style={styles.nilBannerSub}>
              Since you have zero sales & purchases for this period, invoice
              uploads are not required. You can optionally upload a bank
              statement or proceed directly to review.
            </Text>
          </View>
        </View>
      ) : null}

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressRow}>
          <View>
            <Text style={styles.progressTitle}>Filing Document Checklist</Text>
            <Text style={styles.progressSubtitle}>
              Required for monthly CA reconciliation
            </Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {uploadedCount}/{totalCount} Completed
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
      </View>

      {/* Document Category Sections (Loop-free recursion) */}
      <RecursiveCategorySections
        categories={FILING_DOC_CATEGORIES}
        documents={documents}
        filingNature={filingNature}
        onPreview={setPreviewDoc}
        onPromptUpload={handlePromptUpload}
        onUploadOption={handleUploadOption}
        onRemoveDoc={handleRemoveDoc}
      />

      {/* Info Callout */}
      <View style={styles.infoCallout}>
        <Ionicons
          name="shield-checkmark"
          size={20}
          color={BrandColors.PRIMARY_BLUE}
        />
        <Text style={styles.infoCalloutText}>
          TaxEdge uses end-to-end 256-bit encryption for filing proofs. Only
          certified Chartered Accountants review your books.
        </Text>
      </View>

      {/* Full-Screen Document Preview Modal */}
      <GstDocumentPreviewModal
        visible={Boolean(previewDoc)}
        previewDoc={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onPromptUpload={handlePromptUpload}
      />
    </View>
  );
};
