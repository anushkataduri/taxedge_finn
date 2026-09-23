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
} from "../../../services/documentUploadHelper";
import { styles } from "./PropertyLoanDocumentsStep.styles";

export interface PropertyLoanDocumentsStepProps {
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

export const PropertyLoanDocumentsStep: React.FC<PropertyLoanDocumentsStepProps> = ({
  documents,
  onDocumentUploaded,
}) => {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
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
    setUploadModalVisible(true);
  };

  const handlePickGallery = async () => {
    setUploadModalVisible(false);
    if (!activeDocId) return;
    const file = await pickLoanImageFromGallery();
    if (file) {
      onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
    }
  };

  const handlePickCamera = async () => {
    setUploadModalVisible(false);
    if (!activeDocId) return;
    const file = await pickLoanImageFromCamera();
    if (file) {
      onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
    }
  };

  const handleMockPdf = () => {
    setUploadModalVisible(false);
    if (!activeDocId) return;
    const doc = documents.find((d) => d.id === activeDocId);
    const mockName = `${doc?.name.replace(/\s+/g, "_") || "property_chain"}.pdf`;
    onDocumentUploaded(
      activeDocId,
      `file:///mock/storage/${mockName}`,
      mockName,
      "3.5 MB"
    );
  };

  const handleDeleteDocument = (doc: LoanDocumentItem) => {
    Alert.alert(
      "Delete Document",
      `Are you sure you want to remove ${doc.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDocumentUploaded(doc.id, "", "", ""),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Property Title & Financial Dossier</Text>
      <Text style={styles.sectionSubtitle}>
        Checklist for Loan Against Property. Upload title deeds, sanctioned plan, and tax returns.
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
                progressPercent === 100 ? "#16A34A" : BrandColors.PRIMARY_BLUE,
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
                        {doc.required && <Text style={styles.starText}>*</Text>}
                      </View>

                      <Text style={styles.docSubtitle} numberOfLines={2}>
                        {doc.subtitle}
                      </Text>

                      {isUploaded && (
                        <View style={styles.fileMetaRow}>
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#16A34A"
                          />
                          <Text style={styles.fileNameText} numberOfLines={1}>
                            {doc.fileName || "Uploaded"}
                          </Text>
                          <Text style={styles.fileSizeText}>
                            ({doc.fileSize || "2.8 MB"})
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Actions Right */}
                  {isUploaded ? (
                    <View style={styles.actionRow}>
                      {/* View Option */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPreviewDoc(doc)}
                        style={styles.viewButton}
                      >
                        <Ionicons name="eye-outline" size={14} color="#2563EB" />
                        <Text style={styles.viewButtonText}>View</Text>
                      </TouchableOpacity>

                      {/* Delete Option */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleDeleteDocument(doc)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={14} color="#DC2626" />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleOpenUploadSheet(doc.id)}
                      style={styles.uploadButton}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={14}
                        color={BrandColors.PRIMARY_ORANGE}
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

      {/* Upload Sheet Modal */}
      <Modal
        visible={uploadModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setUploadModalVisible(false)}
        >
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Upload Source</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sheetOption} onPress={handlePickCamera}>
              <Ionicons name="camera-outline" size={22} color={BrandColors.PRIMARY_ORANGE} />
              <Text style={styles.sheetOptionText}>Take Photo with Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handlePickGallery}>
              <Ionicons name="images-outline" size={22} color={BrandColors.PRIMARY_ORANGE} />
              <Text style={styles.sheetOptionText}>Choose Image from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handleMockPdf}>
              <Ionicons name="document-attach-outline" size={22} color={BrandColors.PRIMARY_ORANGE} />
              <Text style={styles.sheetOptionText}>Upload PDF Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Document View/Preview Modal */}
      <Modal
        visible={previewDoc !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewDoc(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setPreviewDoc(null)}
        >
          <View style={[styles.sheetContent, { paddingBottom: 24 }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Document Preview</Text>
              <TouchableOpacity onPress={() => setPreviewDoc(null)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {previewDoc && (
              <View>
                <View style={styles.previewCard}>
                  <Ionicons name="document-text" size={48} color={BrandColors.PRIMARY_ORANGE} />
                  <Text style={styles.previewFileName}>{previewDoc.fileName || previewDoc.name}</Text>
                  <Text style={styles.previewFileSize}>{previewDoc.fileSize || "3.5 MB"}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8 }}>
                  <Text style={{ fontSize: 13, color: "#64748B" }}>Document Category</Text>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F2052" }}>
                    {previewDoc.category}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8 }}>
                  <Text style={{ fontSize: 13, color: "#64748B" }}>Upload Timestamp</Text>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#16A34A" }}>
                    {previewDoc.uploadedAt ? new Date(previewDoc.uploadedAt).toLocaleDateString("en-IN") : "Just now"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.uploadButton, { justifyContent: "center", marginTop: 16, paddingVertical: 12 }]}
                  onPress={() => setPreviewDoc(null)}
                >
                  <Text style={[styles.uploadButtonText, { fontSize: 14 }]}>Close Preview</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PropertyLoanDocumentsStep;
