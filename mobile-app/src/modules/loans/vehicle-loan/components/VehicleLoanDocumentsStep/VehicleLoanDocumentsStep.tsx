import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  LoanDocumentItem,
  LoanDocumentCategory,
} from "../../../types/loans.types";
import {
  pickLoanImageFromGallery,
  pickLoanImageFromCamera,
  pickLoanDocumentFromFiles,
} from "../../../services/documentUploadHelper";
import { DocumentPreviewModal } from "../DocumentPreviewModal";
import { styles } from "./VehicleLoanDocumentsStep.styles";

export interface VehicleLoanDocumentsStepProps {
  documents: LoanDocumentItem[];
  onDocumentUploaded: (
    docId: string,
    fileUri: string,
    fileName: string,
    fileSize: string
  ) => void;
  onDocumentDeleted?: (docId: string) => void;
}

const CATEGORIES: { name: LoanDocumentCategory; icon: string }[] = [
  { name: "Identity & Address", icon: "person-circle-outline" },
  { name: "Income & Banking", icon: "wallet-outline" },
  { name: "Collateral & Others", icon: "car-outline" },
];

export const VehicleLoanDocumentsStep: React.FC<VehicleLoanDocumentsStepProps> = ({
  documents,
  onDocumentUploaded,
  onDocumentDeleted,
}) => {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<LoanDocumentItem | null>(null);

  const totalRequired = documents.filter((d) => d.required).length;
  const uploadedRequired = documents.filter(
    (d) => d.required && Boolean(d.fileUri)
  ).length;
  const progressPercent =
    totalRequired > 0
      ? Math.round((uploadedRequired / totalRequired) * 100)
      : 100;

  const handleOpenUploadSheet = (docId: string) => {
    setActiveDocId(docId);
    setModalVisible(true);
  };

  const handlePickGallery = async () => {
    setModalVisible(false);
    if (!activeDocId) return;
    const file = await pickLoanImageFromGallery();
    if (file) {
      onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
    }
  };

  const handlePickCamera = async () => {
    setModalVisible(false);
    if (!activeDocId) return;
    const file = await pickLoanImageFromCamera();
    if (file) {
      onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
    }
  };

  const handlePickFiles = async () => {
    setModalVisible(false);
    if (!activeDocId) return;
    const file = await pickLoanDocumentFromFiles();
    if (file) {
      onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
    }
  };

  const handleDelete = (item: LoanDocumentItem) => {
    Alert.alert(
      "Remove Document?",
      `Are you sure you want to remove "${item.name}"? You will need to upload it again before submission.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onDocumentDeleted?.(item.id),
        },
      ]
    );
  };

  const activeDoc = documents.find((d) => d.id === activeDocId);

  return (
    <View style={styles.container}>
      {/* 1. Mandatory Progress Tracker Card */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Document Checklist Progress</Text>
          <Text style={styles.progressCount}>
            {uploadedRequired} of {totalRequired} ({progressPercent}%)
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.formatHint}>
          Supported formats: PDF, JPG, PNG, Word (.docx), Excel (.xlsx) • Max 10MB per file
        </Text>
      </View>

      {/* 2. Grouped Category Cards */}
      {CATEGORIES.map(({ name: cat, icon }) => {
        const catDocs = documents.filter((d) => d.category === cat);
        if (catDocs.length === 0) return null;

        return (
          <View key={cat} style={styles.categoryContainer}>
            <View style={styles.categoryHeaderRow}>
              <Ionicons
                name={icon as any}
                size={16}
                color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
              />
              <Text style={styles.categoryHeader}>
                {cat === "Collateral & Others"
                  ? "Vehicle Quotation & Collateral"
                  : cat}
              </Text>
            </View>

            {catDocs.map((item) => {
              const isUploaded = Boolean(item.fileUri);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.docCard,
                    isUploaded && styles.docCardUploaded,
                  ]}
                >
                  <View style={styles.docCardTopRow}>
                    <View style={styles.docLeft}>
                      <View style={styles.iconBox}>
                        <Ionicons
                          name={item.iconName as any}
                          size={20}
                          color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
                        />
                      </View>

                      <View style={styles.docInfo}>
                        <View style={styles.docNameRow}>
                          <Text style={styles.docName}>{item.name}</Text>
                          {item.required ? (
                            <View style={styles.requiredBadge}>
                              <Text style={styles.requiredText}>Required</Text>
                            </View>
                          ) : (
                            <View style={styles.optionalBadge}>
                              <Text style={styles.optionalText}>Optional</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.docSubtitle}>{item.subtitle}</Text>
                        {isUploaded && item.fileName && (
                          <Text style={styles.docFileDetails}>
                            ✓ {item.fileName} ({item.fileSize || "File"})
                          </Text>
                        )}
                      </View>
                    </View>

                    {!isUploaded && (
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() => handleOpenUploadSheet(item.id)}
                      >
                        <Ionicons
                          name="arrow-up-circle-outline"
                          size={15}
                          color={BrandColors.PRIMARY_ORANGE_DARK || "#EA580C"}
                        />
                        <Text style={styles.uploadButtonText}>Upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Actions for Uploaded Documents: Preview, Replace, Delete */}
                  {isUploaded && (
                    <View style={styles.docActionsRow}>
                      <TouchableOpacity
                        style={styles.previewButton}
                        onPress={() => setPreviewDoc(item)}
                      >
                        <Ionicons name="eye-outline" size={14} color="#0F172A" />
                        <Text style={styles.previewButtonText}>Preview</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.reuploadButton}
                        onPress={() => handleOpenUploadSheet(item.id)}
                      >
                        <Ionicons
                          name="cloud-upload-outline"
                          size={14}
                          color="#64748B"
                        />
                        <Text style={styles.reuploadButtonText}>Replace</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={13}
                          color="#DC2626"
                        />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}

      {/* Upload Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                Upload {activeDoc?.name || "Document"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Ensure all text and stamps are clearly legible. Max 10MB.
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handlePickCamera}
            >
              <Ionicons
                name="camera"
                size={22}
                color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
              />
              <View>
                <Text style={styles.modalOptionText}>Take Photo</Text>
                <Text style={styles.modalOptionSub}>
                  Capture original paper document using camera
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handlePickGallery}
            >
              <Ionicons
                name="images"
                size={22}
                color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
              />
              <View>
                <Text style={styles.modalOptionText}>Photo Library / Gallery</Text>
                <Text style={styles.modalOptionSub}>
                  Upload clear JPG or PNG image from phone
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handlePickFiles}
            >
              <Ionicons
                name="document-text"
                size={22}
                color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
              />
              <View>
                <Text style={styles.modalOptionText}>Files / Google Drive / PDF</Text>
                <Text style={styles.modalOptionSub}>
                  Browse storage, Google Drive, PDF, Word, or Excel
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        visible={Boolean(previewDoc)}
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </View>
  );
};

export default VehicleLoanDocumentsStep;
