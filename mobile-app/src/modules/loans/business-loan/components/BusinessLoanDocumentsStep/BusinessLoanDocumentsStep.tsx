import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoanDocumentItem } from "../../../types/loans.types";
import {
  pickLoanImageFromGallery,
  pickLoanImageFromCamera,
  pickLoanDocumentFromFiles,
} from "../../../services/documentUploadHelper";
import { BrandColors } from "../../../../../shared/theme";
import { styles } from "./BusinessLoanDocumentsStep.styles";

export interface BusinessLoanDocumentsStepProps {
  documents: LoanDocumentItem[];
  onDocumentUploaded: (
    docId: string,
    fileUri: string,
    fileName: string,
    fileSize: string
  ) => void;
  onDocumentDeleted?: (docId: string) => void;
}

interface SingleDocCardData {
  id: string;
  title: string;
  subtitle: string;
  isRequired: boolean;
  isOptional?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  iconStyle:
    | "iconSquareBlue"
    | "iconSquarePurple"
    | "iconSquareGreen"
    | "iconSquareRed"
    | "iconSquareOrange"
    | "iconSquarePink";
  iconColor: string;
}

const DOCUMENT_ITEMS_LIST: SingleDocCardData[] = [
  {
    id: "doc-pan",
    title: "PAN Card",
    subtitle: "Entity PAN card & Promoter/Director PAN card",
    isRequired: true,
    iconName: "document-text",
    iconStyle: "iconSquareBlue",
    iconColor: "#2563EB",
  },
  {
    id: "doc-aadhaar",
    title: "Aadhaar Card",
    subtitle: "Aadhaar of all Primary Directors / Partners",
    isRequired: true,
    iconName: "card-outline",
    iconStyle: "iconSquarePurple",
    iconColor: "#7C3AED",
  },
  {
    id: "doc-kyc",
    title: "KYC of Directors / Partners",
    subtitle: "PAN, Aadhaar, DIN and Passport photo",
    isRequired: true,
    iconName: "people-outline",
    iconStyle: "iconSquareGreen",
    iconColor: "#16A34A",
  },
  {
    id: "doc-address",
    title: "Business Address Proof",
    subtitle: "Utility bill / Rent agreement / Property document",
    isRequired: true,
    iconName: "home-outline",
    iconStyle: "iconSquareRed",
    iconColor: "#DC2626",
  },
  {
    id: "doc-bank-statements",
    title: "Current Account Bank Statements",
    subtitle: "Last 12 months bank statements",
    isRequired: true,
    iconName: "business-outline",
    iconStyle: "iconSquareOrange",
    iconColor: BrandColors.PRIMARY_ORANGE || "#FF7A00",
  },
  {
    id: "doc-gst-cert",
    title: "GST Certificate (REG-06)",
    subtitle: "GST registration certificate",
    isRequired: true,
    iconName: "document-text-outline",
    iconStyle: "iconSquareGreen",
    iconColor: "#16A34A",
  },
  {
    id: "doc-gst-returns",
    title: "GST Returns (12 Months)",
    subtitle: "Filed GSTR-3B & GSTR-1 returns for last 12 months",
    isRequired: true,
    iconName: "analytics-outline",
    iconStyle: "iconSquareOrange",
    iconColor: BrandColors.PRIMARY_ORANGE || "#FF7A00",
  },
  {
    id: "doc-itr",
    title: "Business ITR (Last 2-3 Years)",
    subtitle: "ITR-V and computation for the last 3 assessment years",
    isRequired: true,
    iconName: "document-attach-outline",
    iconStyle: "iconSquarePurple",
    iconColor: "#7C3AED",
  },
  {
    id: "doc-audited-bs",
    title: "Audited Balance Sheet",
    subtitle: "CA audited balance sheet for last 2-3 years",
    isRequired: true,
    iconName: "pie-chart-outline",
    iconStyle: "iconSquarePink",
    iconColor: "#DB2777",
  },
  {
    id: "doc-pnl",
    title: "Profit & Loss Statement",
    subtitle: "CA certified P&L statement with schedules",
    isRequired: true,
    iconName: "bar-chart-outline",
    iconStyle: "iconSquarePurple",
    iconColor: "#7C3AED",
  },
  {
    id: "doc-cashflow",
    title: "Cash Flow Statement",
    subtitle: "Cash flow statement for the latest financial year",
    isRequired: true,
    iconName: "document-outline",
    iconStyle: "iconSquareBlue",
    iconColor: "#2563EB",
  },
  {
    id: "doc-udyam",
    title: "Udyam Registration Certificate",
    subtitle: "MSME registration certificate",
    isRequired: false,
    isOptional: true,
    iconName: "briefcase-outline",
    iconStyle: "iconSquareGreen",
    iconColor: "#16A34A",
  },
  {
    id: "doc-business-proof",
    title: "Business Registration Proof",
    subtitle: "Certificate of Incorporation / Business license",
    isRequired: true,
    iconName: "folder-open-outline",
    iconStyle: "iconSquareOrange",
    iconColor: BrandColors.PRIMARY_ORANGE || "#FF7A00",
  },
  {
    id: "doc-expansion",
    title: "Business Expansion Document",
    subtitle: "Project report / Business plan / Estimated cost",
    isRequired: true,
    iconName: "document-attach-outline",
    iconStyle: "iconSquareBlue",
    iconColor: "#2563EB",
  },
];

export const BusinessLoanDocumentsStep: React.FC<BusinessLoanDocumentsStepProps> = ({
  documents,
  onDocumentUploaded,
  onDocumentDeleted,
}) => {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    uri: string;
    name: string;
    size: string;
  } | null>(null);

  const findUploadedDoc = (itemId: string): LoanDocumentItem | undefined => {
    const cleanTargetId = itemId.replace(/^doc-/, "");
    return documents.find((d) => {
      const cleanDocId = d.id.replace(/^doc-/, "");
      return d.id === itemId || cleanDocId === cleanTargetId;
    });
  };

  const handleOpenUploadSheet = (docId: string) => {
    setActiveDocId(docId);
    setModalVisible(true);
  };

  const handleView = (item: SingleDocCardData) => {
    const docRecord = findUploadedDoc(item.id);
    if (!docRecord?.fileUri) return;

    setPreviewDoc({
      title: item.title,
      uri: docRecord.fileUri,
      name: docRecord.fileName || `${item.title.replace(/\s+/g, "_")}.pdf`,
      size: docRecord.fileSize || "Verified",
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
            if (onDocumentDeleted) {
              onDocumentDeleted(docId);
            }
          },
        },
      ]
    );
  };

  const isFileSizeValid = (sizeStr: string): boolean => {
    const match = sizeStr.match(/([\d.]+)\s*(MB|KB|GB)?/i);
    if (!match) return true;
    const value = parseFloat(match[1]);
    const unit = (match[2] || "MB").toUpperCase();
    if (unit === "GB") return false;
    if (unit === "MB" && value > 5.0) return false;
    if (unit === "KB" && value > 5120) return false;
    return true;
  };

  const handlePickGallery = async () => {
    setModalVisible(false);
    if (!activeDocId) return;
    try {
      const file = await pickLoanImageFromGallery();
      if (file) {
        if (!isFileSizeValid(file.size)) {
          Alert.alert("File Too Large", "Selected image exceeds 5 MB. Please choose a smaller file.");
          return;
        }
        onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
      }
    } catch {
      Alert.alert("Upload Error", "Failed to select image from gallery.");
    }
  };

  const handlePickCamera = async () => {
    setModalVisible(false);
    if (!activeDocId) return;
    try {
      const file = await pickLoanImageFromCamera();
      if (file) {
        if (!isFileSizeValid(file.size)) {
          Alert.alert("File Too Large", "Captured image exceeds 5 MB. Please try again.");
          return;
        }
        onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
      }
    } catch {
      Alert.alert("Camera Error", "Failed to capture image.");
    }
  };

  const handlePickDocument = async () => {
    setModalVisible(false);
    if (!activeDocId) return;
    try {
      const file = await pickLoanDocumentFromFiles();
      if (file) {
        if (!isFileSizeValid(file.size)) {
          Alert.alert("File Too Large", "Selected document exceeds 5 MB. Please select a smaller file.");
          return;
        }
        onDocumentUploaded(activeDocId, file.uri, file.name, file.size);
      }
    } catch {
      Alert.alert("Document Error", "Failed to attach document.");
    }
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
          <Ionicons name="information-circle-outline" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
          <Text style={styles.formatsNoticeText}>
            Accepted formats: PDF, JPG, PNG{"\n"}Max file size: 5 MB per file
          </Text>
        </View>
      </View>

      {/* Document Items List */}
      {DOCUMENT_ITEMS_LIST.map((item) => {
        const docRecord = findUploadedDoc(item.id);
        const isUploaded = Boolean(docRecord?.fileUri && docRecord.fileUri.trim() !== "");

        return (
          <View key={item.id} style={styles.docCard}>
            <View style={styles.docCardLeft}>
              <View style={[styles.iconSquare, styles[item.iconStyle]]}>
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
                    onPress={() => handleView(item)}
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
                  <Ionicons name="cloud-upload-outline" size={14} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
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
              <Ionicons name="camera-outline" size={22} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
              <Text style={styles.sheetOptionText}>Take Photo with Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handlePickGallery}>
              <Ionicons name="images-outline" size={22} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
              <Text style={styles.sheetOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handlePickDocument}>
              <Ionicons name="document-attach-outline" size={22} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
              <Text style={styles.sheetOptionText}>Attach Document (PDF, Word, Excel)</Text>
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
                <Ionicons name="document-text" size={20} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
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
                  <Ionicons name="document-attach" size={48} color={BrandColors.PRIMARY_ORANGE || "#FF7A00"} />
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
