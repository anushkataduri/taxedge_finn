/**
 * Component: GstUnifiedDocumentStep
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { pickImageFromGallery, pickImageFromCamera } from "@/modules/gst/utils/imageUploadHelper";
import { DocumentCropModal } from "@/shared/components/DocumentCropModal";
import {
  styles,
  getProgressFillStyle,
  getIconBoxStyle,
} from "./GstUnifiedDocumentStep.styles";

export interface DocumentItem {
  id: string;
  name: string;
  subtitle: string;
  required: boolean;
  iconName: string;
  iconBg: string;
  iconColor: string;
  category: "Identity Proof" | "Business Proof" | "Financial & Signatory";
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
}

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

const ADDRESS_PROOF_TYPES = [
  "Rental Agreement",
  "Ownership Proof",
  "Electricity Bill",
  "Other Address Proof",
];

interface GstUnifiedDocumentStepProps {
  documents: DocumentItem[];
  onUpdateDocuments: (updatedDocs: DocumentItem[]) => void;
}

export const GstUnifiedDocumentStep: React.FC<GstUnifiedDocumentStepProps> = ({
  documents,
  onUpdateDocuments,
}) => {
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [cropTarget, setCropTarget] = useState<{ docId: string; uri: string } | null>(null);
  const [showAddressProofModal, setShowAddressProofModal] = useState(false);

  // Pure functional calculation of progress using reduce
  const uploadedCount = documents.reduce(
    (count, doc) => (doc.fileUri ? count + 1 : count),
    0
  );
  const totalCount = documents.length;
  const progressPercent = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;

  // Group documents by category purely via reduce/map (no loops)
  const categories: Array<DocumentItem["category"]> = [
    "Identity Proof",
    "Business Proof",
    "Financial & Signatory",
  ];

  const handleUploadOption = async (docId: string, source: "gallery" | "camera") => {
    const targetDoc = documents.find(d => d.id === docId);
    if (targetDoc?.id === "address-proof" && targetDoc.subtitle === "Electricity Bill / Rental Agreement") {
      Alert.alert(
        "Select Document Type", 
        "Please select the type of address proof from the dropdown first.",
        [{ text: "OK", onPress: () => setShowAddressProofModal(true) }]
      );
      return;
    }

    const uri = source === "camera" ? await pickImageFromCamera(false) : await pickImageFromGallery(false);
    if (uri) {
      setCropTarget({ docId, uri });
    }
  };

  const handleCropDone = (croppedUri: string) => {
    if (!cropTarget) return;
    const targetDocId = cropTarget.docId;
    const updatedList = documents.map((doc) => {
      if (doc.id === targetDocId) {
        return {
          ...doc,
          fileUri: croppedUri,
          fileName: `${doc.name.replace(/[\s/]/g, "_")}.jpg`,
          uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      }
      return doc;
    });
    onUpdateDocuments(updatedList);
    setCropTarget(null);
  };

  const handlePromptUpload = (docId: string) => {
    const targetDoc = documents.find(d => d.id === docId);
    if (targetDoc?.id === "address-proof" && targetDoc.subtitle === "Electricity Bill / Rental Agreement") {
      Alert.alert(
        "Select Document Type", 
        "Please select the type of address proof from the dropdown first.",
        [{ text: "OK", onPress: () => setShowAddressProofModal(true) }]
      );
      return;
    }

    Alert.alert("Upload Document", "Choose source to select document image:", [
      { text: "Camera", onPress: () => handleUploadOption(docId, "camera") },
      { text: "Photo Gallery", onPress: () => handleUploadOption(docId, "gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemoveDoc = (docId: string) => {
    Alert.alert(
      "Remove Document",
      "Are you sure you want to remove this uploaded document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updated = documents.map((doc) =>
              doc.id === docId
                ? { ...doc, fileUri: undefined, fileName: undefined, fileSize: undefined }
                : doc
            );
            onUpdateDocuments(updated);
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
      {/* Progress Header Card */}
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
              {uploadedCount}/{totalCount} Completed
            </Text>
          </View>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, getProgressFillStyle(progressPercent)]} />
        </View>
      </View>

      {/* Render Document Cards Grouped by Category using pure map */}
      {categories.map((category) => {
        const categoryDocs = documents.filter((doc) => doc.category === category);
        if (categoryDocs.length === 0) return null;

        return (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>

            <View style={styles.docsList}>
              {categoryDocs.map((doc) => {
                const isUploaded = Boolean(doc.fileUri);

                return (
                  <View
                    key={doc.id}
                    style={[styles.docCard, isUploaded && styles.docCardUploaded]}
                  >
                    <View style={styles.cardTopRow}>
                      {/* Icon */}
                      <View style={[styles.iconBox, getIconBoxStyle(doc.iconBg)]}>
                        <Ionicons
                          name={doc.iconName as any}
                          size={20}
                          color={doc.iconColor}
                        />
                      </View>

                      {/* Text Info */}
                      <View style={styles.docInfoCol}>
                        <View style={styles.titleRow}>
                          <Text style={styles.docName}>{doc.name}</Text>
                          {doc.required && (
                            <Text style={styles.requiredAsterisk}> *</Text>
                          )}
                        </View>
                        {doc.id === "address-proof" && !isUploaded ? (
                           <TouchableOpacity 
                             onPress={() => setShowAddressProofModal(true)} 
                             style={styles.addressProofPickerBtn}
                           >
                              <Text style={[styles.docSubtitle, styles.docSubtitleLink]}>
                                {doc.subtitle === "Electricity Bill / Rental Agreement" ? "Select Address Proof" : doc.subtitle}
                              </Text>
                              <Ionicons name="chevron-down" size={14} color={BrandColors.PRIMARY_BLUE} style={styles.dropdownIcon} />
                           </TouchableOpacity>
                        ) : (
                          <Text style={styles.docSubtitle} numberOfLines={1}>
                            {isUploaded
                              ? doc.fileName || "Uploaded document"
                              : doc.subtitle}
                          </Text>
                        )}
                      </View>

                      {/* Status Badge */}
                      <View
                        style={[
                          styles.statusBadge,
                          isUploaded ? styles.statusUploaded : styles.statusPending,
                        ]}
                      >
                        <Ionicons
                          name={isUploaded ? "checkmark-circle" : "ellipse-outline"}
                          size={12}
                          color={isUploaded ? "#059669" : "#94A3B8"}
                        />
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isUploaded
                              ? styles.statusUploadedText
                              : styles.statusPendingText,
                          ]}
                        >
                          {isUploaded ? "Uploaded" : "Required"}
                        </Text>
                      </View>
                    </View>

                    {/* Action Bar */}
                    {isUploaded ? (
                      <View style={styles.uploadedActionRow}>
                        <TouchableOpacity
                          style={styles.viewBtn}
                          activeOpacity={0.7}
                          onPress={() => setPreviewDoc(doc)}
                        >
                          <Ionicons
                            name="eye-outline"
                            size={16}
                            color={BrandColors.PRIMARY_BLUE}
                          />
                          <Text style={styles.viewBtnText}>View Document</Text>
                        </TouchableOpacity>

                        <View style={styles.actionBtnDivider} />

                        <TouchableOpacity
                          style={styles.replaceBtn}
                          activeOpacity={0.7}
                          onPress={() => handlePromptUpload(doc.id)}
                        >
                          <Ionicons
                            name="sync-outline"
                            size={15}
                            color="#64748B"
                          />
                          <Text style={styles.replaceBtnText}>Replace</Text>
                        </TouchableOpacity>

                        <View style={styles.actionBtnDivider} />

                        <TouchableOpacity
                          style={styles.deleteBtn}
                          activeOpacity={0.7}
                          onPress={() => handleRemoveDoc(doc.id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.uploadButtonsRow}>
                        <TouchableOpacity
                          style={styles.uploadBtn}
                          activeOpacity={0.8}
                          onPress={() => handleUploadOption(doc.id, "camera")}
                        >
                          <Ionicons
                            name="camera-outline"
                            size={16}
                            color={BrandColors.PRIMARY_ORANGE}
                          />
                          <Text style={styles.uploadBtnText}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.uploadBtn, styles.uploadBtnPrimary]}
                          activeOpacity={0.8}
                          onPress={() => handleUploadOption(doc.id, "gallery")}
                        >
                          <Ionicons
                            name="cloud-upload-outline"
                            size={16}
                            color="#FFFFFF"
                          />
                          <Text style={styles.uploadBtnPrimaryText}>Upload File</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}

      {/* Info Callout */}
      <View style={styles.infoCallout}>
        <Ionicons name="shield-checkmark" size={20} color={BrandColors.PRIMARY_BLUE} />
        <Text style={styles.infoCalloutText}>
          Your documents are encrypted and safely stored in compliance with GST data protection standards.
        </Text>
      </View>

      {/* Full-Screen Document Viewer Modal */}
      <Modal
        visible={Boolean(previewDoc)}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewDoc(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalDocTitle} numberOfLines={1}>
                  {previewDoc?.name}
                </Text>
                <Text style={styles.modalDocMeta}>
                  {previewDoc?.fileName || "Uploaded document"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPreviewDoc(null)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* Document Image Display */}
            <View style={styles.modalImageContainer}>
              {previewDoc?.fileUri ? (
                <Image
                  source={{ uri: previewDoc.fileUri }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.modalPlaceholder}>
                  <Ionicons name="document-text-outline" size={60} color="#94A3B8" />
                  <Text style={styles.modalPlaceholderText}>Preview not available</Text>
                </View>
              )}
            </View>

            {/* Modal Footer Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalReplaceBtn}
                onPress={() => {
                  const id = previewDoc?.id;
                  setPreviewDoc(null);
                  if (id) handlePromptUpload(id);
                }}
              >
                <Ionicons name="sync-outline" size={16} color={BrandColors.PRIMARY_BLUE} />
                <Text style={styles.modalReplaceText}>Re-upload</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => setPreviewDoc(null)}
              >
                <Text style={styles.modalDoneText}>Close Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Address Proof Selection Modal */}
      <Modal visible={showAddressProofModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.selectModalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddressProofModal(false)}
        >
          <View style={styles.selectModalContent}>
            <Text style={styles.selectModalTitle}>Select Address Proof</Text>
            {ADDRESS_PROOF_TYPES.map((proof) => (
              <TouchableOpacity
                key={proof}
                style={styles.selectModalOption}
                onPress={() => {
                  const updated = documents.map((doc) =>
                    doc.id === "address-proof"
                      ? { ...doc, subtitle: proof }
                      : doc
                  );
                  onUpdateDocuments(updated);
                  setShowAddressProofModal(false);
                }}
              >
                <Text style={styles.selectModalOptionText}>{proof}</Text>
                {documents.find(d => d.id === "address-proof")?.subtitle === proof && (
                  <Ionicons name="checkmark" size={18} color={BrandColors.PRIMARY_BLUE} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* In-App Crop & Done Modal with top-right 'DONE' text button */}
      <DocumentCropModal
        visible={Boolean(cropTarget)}
        imageUri={cropTarget?.uri || null}
        onDone={handleCropDone}
        onCancel={() => setCropTarget(null)}
      />
    </View>
  );
};

