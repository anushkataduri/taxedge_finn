import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoanDocumentItem } from "../../../types/loans.types";
import {
  pickLoanImageFromGallery,
  pickLoanImageFromCamera,
} from "../../../services/documentUploadHelper";
import { styles } from "./BusinessLoanDocumentsStep.styles";

export interface BusinessLoanDocumentsStepProps {
  documents: LoanDocumentItem[];
  onDocumentUploaded: (
    docId: string,
    fileUri: string,
    fileName: string,
    fileSize: string
  ) => void;
}

interface SingleDocCardData {
  id: string;
  title: string;
  subtitle: string;
  isRequired: boolean;
  isOptional?: boolean;
  isUploaded: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  fileUri?: string;
  fileName?: string;
}

const DOCUMENT_ITEMS_LIST: SingleDocCardData[] = [
  {
    id: "doc-pan",
    title: "PAN Card",
    subtitle: "Entity PAN card & Promoter/Director PAN card",
    isRequired: true,
    isUploaded: false,
    iconName: "document-text",
    iconBg: "#E0F2FE",
    iconColor: "#2563EB",
  },
  {
    id: "doc-aadhaar",
    title: "Aadhaar Card",
    subtitle: "Aadhaar of all Primary Directors / Partners",
    isRequired: true,
    isUploaded: false,
    iconName: "card-outline",
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
  {
    id: "doc-kyc",
    title: "KYC of Directors / Partners",
    subtitle: "PAN, Aadhaar, DIN and Passport photo",
    isRequired: true,
    isUploaded: false,
    iconName: "people-outline",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: "doc-address",
    title: "Business Address Proof",
    subtitle: "Utility bill / Rent agreement / Property document",
    isRequired: true,
    isUploaded: false,
    iconName: "home-outline",
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
  },
  {
    id: "doc-bank-statements",
    title: "Current Account Bank Statements",
    subtitle: "Last 12 months bank statements",
    isRequired: true,
    isUploaded: false,
    iconName: "business-outline",
    iconBg: "#FFEDD5",
    iconColor: "#EA580C",
  },
  {
    id: "doc-gst-cert",
    title: "GST Certificate (REG-06)",
    subtitle: "GST registration certificate",
    isRequired: true,
    isUploaded: false,
    iconName: "document-text-outline",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: "doc-gst-returns",
    title: "GST Returns (12 Months)",
    subtitle: "Filed GSTR-3B & GSTR-1 returns for last 12 months",
    isRequired: true,
    isUploaded: false,
    iconName: "analytics-outline",
    iconBg: "#FFEDD5",
    iconColor: "#EA580C",
  },
  {
    id: "doc-itr",
    title: "Business ITR (Last 2-3 Years)",
    subtitle: "ITR-V and computation for the last 3 assessment years",
    isRequired: true,
    isUploaded: false,
    iconName: "document-attach-outline",
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
  {
    id: "doc-audited-bs",
    title: "Audited Balance Sheet",
    subtitle: "CA audited balance sheet for last 2-3 years",
    isRequired: true,
    isUploaded: false,
    iconName: "pie-chart-outline",
    iconBg: "#FCE7F3",
    iconColor: "#DB2777",
  },
  {
    id: "doc-pnl",
    title: "Profit & Loss Statement",
    subtitle: "CA certified P&L statement with schedules",
    isRequired: true,
    isUploaded: false,
    iconName: "bar-chart-outline",
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
  {
    id: "doc-cashflow",
    title: "Cash Flow Statement",
    subtitle: "Cash flow statement for the latest financial year",
    isRequired: true,
    isUploaded: false,
    iconName: "document-outline",
    iconBg: "#E0F2FE",
    iconColor: "#2563EB",
  },
  {
    id: "doc-udyam",
    title: "Udyam Registration Certificate",
    subtitle: "MSME registration certificate",
    isRequired: false,
    isOptional: true,
    isUploaded: false,
    iconName: "briefcase-outline",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: "doc-business-proof",
    title: "Business Registration Proof",
    subtitle: "Certificate of Incorporation / Business license",
    isRequired: true,
    isUploaded: false,
    iconName: "folder-open-outline",
    iconBg: "#FFEDD5",
    iconColor: "#EA580C",
  },
  {
    id: "doc-expansion",
    title: "Business Expansion Document",
    subtitle: "Project report / Business plan / Estimated cost",
    isRequired: true,
    isUploaded: false,
    iconName: "document-attach-outline",
    iconBg: "#E0F2FE",
    iconColor: "#2563EB",
  },
];

export const BusinessLoanDocumentsStep: React.FC<BusinessLoanDocumentsStepProps> = ({
  onDocumentUploaded,
}) => {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [uploadedState, setUploadedState] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, { uri: string; name: string; size: string }>
  >({});
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    uri: string;
    name: string;
    size: string;
  } | null>(null);

  const handleOpenUploadSheet = (docId: string) => {
    setActiveDocId(docId);
    setModalVisible(true);
  };

  const handleView = (docId: string, docTitle: string) => {
    const fileData = uploadedFiles[docId];
    const uri = fileData?.uri || `file:///mock/storage/${docId}.pdf`;
    const name = fileData?.name || `${docTitle.replace(/\s+/g, "_")}.pdf`;
    const size = fileData?.size || "2.4 MB";

    setPreviewDoc({
      title: docTitle,
      uri,
      name,
      size,
    });
    setViewModalVisible(true);
  };

  const handleDeleteFile = (docId: string, docTitle: string) => {
    Alert.alert(
      "Delete Document",
      `Are you sure you want to delete ${docTitle}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setUploadedState((prev) => ({ ...prev, [docId]: false }));
            setUploadedFiles((prev) => {
              const next = { ...prev };
              delete next[docId];
              return next;
            });
          },
        },
      ]
    );
  };

  const handlePickGallery = async () => {
    setModalVisible(false);
    if (!activeDocId) return;
    const file = await pickLoanImageFromGallery();
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [activeDocId]: { uri: file.uri, name: file.name, size: file.size },
      }));
      setUploadedState((prev) => ({ ...prev, [activeDocId]: true }));
      onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
    }
  };

  const handlePickCamera = async () => {
    setModalVisible(false);
    if (!activeDocId) return;
    const file = await pickLoanImageFromCamera();
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [activeDocId]: { uri: file.uri, name: file.name, size: file.size },
      }));
      setUploadedState((prev) => ({ ...prev, [activeDocId]: true }));
      onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
    }
  };

  const handleMockPdf = () => {
    setModalVisible(false);
    if (!activeDocId) return;
    const mockUri = `file:///mock/storage/${activeDocId}.pdf`;
    const mockName = `${activeDocId}.pdf`;
    const mockSize = "2.1 MB";

    setUploadedFiles((prev) => ({
      ...prev,
      [activeDocId]: { uri: mockUri, name: mockName, size: mockSize },
    }));
    setUploadedState((prev) => ({ ...prev, [activeDocId]: true }));
    onDocumentUploaded(activeDocId, mockUri, mockName, mockSize);
  };

  const isImageUri = (uri?: string) => {
    if (!uri) return false;
    const lower = uri.toLowerCase();
    return (
      lower.includes("ph://") ||
      lower.includes("content://") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".jpeg")
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.topHeaderRow}>
        <View style={styles.titleCol}>
          <Text style={styles.sectionTitle}>Document Verification</Text>
          <Text style={styles.sectionSubtitle}>
            Upload the required documents based on your business profile and loan purpose.
          </Text>
        </View>

        <View style={styles.formatsNoticeBox}>
          <Ionicons name="information-circle-outline" size={14} color="#EA580C" />
          <Text style={styles.formatsNoticeText}>
            Accepted formats: PDF, JPG, PNG{"\n"}Max file size: 5 MB per file
          </Text>
        </View>
      </View>

      {/* Document Items List */}
      {DOCUMENT_ITEMS_LIST.map((item) => {
        const isUploaded = uploadedState[item.id] !== undefined ? uploadedState[item.id] : item.isUploaded;

        return (
          <View key={item.id} style={styles.docCard}>
            <View style={styles.docCardLeft}>
              <View style={[styles.iconSquare, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.iconName} size={18} color={item.iconColor} />
              </View>

              <View style={styles.docTextCol}>
                <View style={styles.docTitleRow}>
                  <Text style={styles.docTitle}>{item.title}</Text>
                  {item.isRequired && <Text style={styles.requiredStar}>*</Text>}
                  {item.isOptional && (
                    <View style={styles.optionalBadge}>
                      <Text style={styles.optionalText}>Optional</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.docSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
            </View>

            <View style={styles.docCardRight}>
              {isUploaded ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleView(item.id, item.title)}
                    style={styles.viewBtn}
                  >
                    <Ionicons name="eye-outline" size={13} color="#0F172A" />
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleDeleteFile(item.id, item.title)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={13} color="#DC2626" />
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleOpenUploadSheet(item.id)}
                  style={styles.uploadBtn}
                >
                  <Ionicons name="cloud-upload-outline" size={14} color="#EA580C" />
                  <Text style={styles.uploadBtnText}>Upload</Text>
                </TouchableOpacity>
              )}
            </View>
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
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Upload Method</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sheetOption} onPress={handlePickCamera}>
              <Ionicons name="camera-outline" size={22} color="#EA580C" />
              <Text style={styles.sheetOptionText}>Take Photo with Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handlePickGallery}>
              <Ionicons name="images-outline" size={22} color="#EA580C" />
              <Text style={styles.sheetOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handleMockPdf}>
              <Ionicons name="document-attach-outline" size={22} color="#EA580C" />
              <Text style={styles.sheetOptionText}>Attach Document PDF</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Document View / Preview Modal */}
      <Modal
        visible={viewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.viewModalBackdrop}>
          <View style={styles.viewModalContent}>
            <View style={styles.previewHeader}>
              <View style={styles.previewTitleRow}>
                <Ionicons name="document-text" size={20} color="#EA580C" />
                <Text style={styles.previewTitle}>{previewDoc?.title || "Document Preview"}</Text>
              </View>

              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.previewCard}>
              {isImageUri(previewDoc?.uri) ? (
                <Image
                  source={{ uri: previewDoc?.uri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.previewPdfBox}>
                  <Ionicons name="document-attach" size={48} color="#EA580C" />
                  <View style={styles.previewBadge}>
                    <Ionicons name="checkmark-circle" size={14} color="#166534" />
                    <Text style={styles.previewBadgeText}>Document Uploaded & Verified</Text>
                  </View>
                  <Text style={styles.previewFileName}>{previewDoc?.name}</Text>
                  <Text style={styles.previewMetaText}>Size: {previewDoc?.size}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.closePreviewBtn}
              onPress={() => setViewModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closePreviewBtnText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BusinessLoanDocumentsStep;
