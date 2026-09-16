import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { BrandColors } from "@/shared/theme";
import { TdsChecklistItem, TdsDocumentCategory } from "../../types/checklist.types";
import { TdsCustomerIncomeFormData } from "../../types/customerIncome.types";
import {
  isFileSizeValid,
  isFileTypeAllowed,
  formatFileSize,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
} from "../../utils/tdsValidation";
import {
  getApplicableDocuments,
  validateDocumentUploads,
} from "../../validation/tdsDocumentSchema";
import { tdsDraftService } from "../../services/tdsDraftService";
import { DocumentUploadBottomSheet } from "../../components/upload/DocumentUploadBottomSheet";
import { TdsDocumentCard } from "../../components/upload/TdsDocumentCard";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { styles } from "./TdsDocumentChecklistScreen.styles";

export const TdsDocumentChecklistScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<TdsCustomerIncomeFormData | null>(null);
  const [documents, setDocuments] = useState<TdsChecklistItem[]>([]);
  const [activeUploadDoc, setActiveUploadDoc] = useState<TdsChecklistItem | null>(null);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});

  // Draft Guard & dirty tracking
  const initialDocsSnapshotRef = useRef<string | null>(null);
  const [hasDocsChanged, setHasDocsChanged] = useState(false);

  // Universal Draft Guard Hook for Back Gesture, Header Back, and Hardware Back Interception
  const {
    showDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () => {
      if (!initialDocsSnapshotRef.current) return false;
      return hasDocsChanged || JSON.stringify(documents) !== initialDocsSnapshotRef.current;
    },
    onSaveDraft: async () => {
      await tdsDraftService.saveDocumentsDraft(documents);
    },
    onDiscardDraft: async () => {
      if (initialDocsSnapshotRef.current) {
        await tdsDraftService.saveDocumentsDraft(JSON.parse(initialDocsSnapshotRef.current));
      }
    },
  });

  // Restore draft and compute conditional documents
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const savedForm = await tdsDraftService.getFormDraft();
      const savedDocs = await tdsDraftService.getDocumentsDraft();
      if (isMounted) {
        setFormData(savedForm);
        const resolvedDocs = getApplicableDocuments(savedForm, savedDocs || undefined);
        setDocuments(resolvedDocs);
        initialDocsSnapshotRef.current = JSON.stringify(resolvedDocs);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save documents whenever updated
  const updateDocuments = async (newDocs: TdsChecklistItem[]) => {
    setHasDocsChanged(true);
    setDocuments(newDocs);
    await tdsDraftService.saveDocumentsDraft(newDocs);
  };

  const simulateProgress = (callback: () => void) => {
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(100);
            callback();
          }, 80);
          return 95;
        }
        return prev + 25;
      });
    }, 60);
  };

  // Upload handler from Document Picker (Files / Drive)
  const handlePickFiles = async () => {
    if (!activeUploadDoc) return;
    const docToUpload = activeUploadDoc;
    setActiveUploadDoc(null);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name || `${docToUpload.title.replace(/\s+/g, "_")}.pdf`;
        const fileSize = asset.size;

        if (!isFileTypeAllowed(fileName, ALLOWED_EXTENSIONS)) {
          Alert.alert(
            "Unsupported File Format",
            "Unsupported file format. Upload PDF, JPG or PNG."
          );
          return;
        }

        if (!isFileSizeValid(fileSize, MAX_FILE_SIZE_BYTES)) {
          Alert.alert(
            "File Size Exceeded",
            "File size exceeds the allowed 20 MB limit. Please select a smaller file."
          );
          return;
        }

        setUploadingDocId(docToUpload.id);
        simulateProgress(() => {
          setUploadingDocId(null);
          const updated = documents.map((doc) =>
            doc.id === docToUpload.id
              ? {
                  ...doc,
                  status: "uploaded" as const,
                  fileName,
                  fileSize: formatFileSize(fileSize),
                  fileUri: asset.uri,
                  mimeType: asset.mimeType || "application/pdf",
                  uploadedAt: new Date().toISOString(),
                }
              : doc
          );
          updateDocuments(updated);
          setDocErrors((prev) => {
            const next = { ...prev };
            delete next[docToUpload.id];
            return next;
          });
        });
      }
    } catch {
      Alert.alert("Upload Error", "Unable to upload document. Please try again.");
    }
  };

  // Upload handler from Gallery
  const handlePickGallery = async () => {
    if (!activeUploadDoc) return;
    const docToUpload = activeUploadDoc;
    setActiveUploadDoc(null);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `${docToUpload.title.replace(/\s+/g, "_")}.jpg`;
        const fileSize = asset.fileSize;

        if (!isFileSizeValid(fileSize, MAX_FILE_SIZE_BYTES)) {
          Alert.alert("File Size Exceeded", "File size exceeds the allowed 20 MB limit.");
          return;
        }

        setUploadingDocId(docToUpload.id);
        simulateProgress(() => {
          setUploadingDocId(null);
          const updated = documents.map((doc) =>
            doc.id === docToUpload.id
              ? {
                  ...doc,
                  status: "uploaded" as const,
                  fileName,
                  fileSize: formatFileSize(fileSize || 1800000),
                  fileUri: asset.uri,
                  mimeType: asset.mimeType || "image/jpeg",
                  uploadedAt: new Date().toISOString(),
                }
              : doc
          );
          updateDocuments(updated);
          setDocErrors((prev) => {
            const next = { ...prev };
            delete next[docToUpload.id];
            return next;
          });
        });
      }
    } catch {
      Alert.alert("Gallery Error", "Could not open photo gallery. Please try again.");
    }
  };

  // Upload handler from Camera
  const handleTakePhoto = async () => {
    if (!activeUploadDoc) return;
    const docToUpload = activeUploadDoc;
    setActiveUploadDoc(null);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is required to take photos of documents."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = `${docToUpload.title.replace(/\s+/g, "_")}_Photo.jpg`;
        const fileSize = asset.fileSize;

        if (!isFileSizeValid(fileSize, MAX_FILE_SIZE_BYTES)) {
          Alert.alert("File Size Exceeded", "Captured photo exceeds 20 MB limit.");
          return;
        }

        setUploadingDocId(docToUpload.id);
        simulateProgress(() => {
          setUploadingDocId(null);
          const updated = documents.map((doc) =>
            doc.id === docToUpload.id
              ? {
                  ...doc,
                  status: "uploaded" as const,
                  fileName,
                  fileSize: formatFileSize(fileSize || 1500000),
                  fileUri: asset.uri,
                  mimeType: "image/jpeg",
                  uploadedAt: new Date().toISOString(),
                }
              : doc
          );
          updateDocuments(updated);
          setDocErrors((prev) => {
            const next = { ...prev };
            delete next[docToUpload.id];
            return next;
          });
        });
      }
    } catch {
      Alert.alert("Camera Error", "Could not capture document photo. Please try again.");
    }
  };

  const handleDelete = (docId: string) => {
    const updated = documents.map((doc) =>
      doc.id === docId
        ? {
            ...doc,
            status: "not_uploaded" as const,
            fileUri: undefined,
            fileName: undefined,
            fileSize: undefined,
            mimeType: undefined,
            uploadedAt: undefined,
          }
        : doc
    );
    updateDocuments(updated);
  };

  // Progress metrics
  const completedCount = documents.filter((d) => d.status === "uploaded" && d.fileUri).length;
  const totalCount = documents.length;
  const mandatoryDocs = documents.filter((d) => d.isMandatory);
  const mandatoryCompleted = mandatoryDocs.filter((d) => d.status === "uploaded" && d.fileUri).length;

  const handleContinue = () => {
    const validation = validateDocumentUploads(documents);
    if (!validation.isValid) {
      setDocErrors(validation.errors);
      Alert.alert(
        "Mandatory Documents Pending",
        `Please upload the following required documents before continuing:\n\n• ${validation.missingMandatory.join(
          "\n• "
        )}`
      );
      return;
    }

    markSubmitted();

    // Navigate to Screen 3 (Review & Calculation)
    router.push("/service/tds-estimate" as any);
  };

  const requiredDocs = documents.filter((d) => d.isMandatory);
  const conditionalDocs = documents.filter((d) => !d.isMandatory);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color={BrandColors.PRIMARY_BLUE_DARK} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>TDS Refund</Text>
          <Text style={styles.headerSubtitle}>Step 2 of 5: Documents</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* Scrollable Document List */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 85 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Short Description */}
        <Text style={styles.shortDescriptionText}>
          Upload your income and tax records for CA assessment and refund verification.
        </Text>

        {/* 1. Required Documents */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="shield-checkmark" size={16} color={BrandColors.PRIMARY_ORANGE} />
            <Text style={styles.sectionTitle}>Required Documents</Text>
          </View>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>
              {requiredDocs.filter((d) => d.status === "uploaded").length}/{requiredDocs.length}
            </Text>
          </View>
        </View>

        {requiredDocs.map((doc) => (
          <TdsDocumentCard
            key={doc.id}
            item={doc}
            isUploading={uploadingDocId === doc.id}
            uploadProgress={uploadProgress}
            error={docErrors[doc.id]}
            onUploadPress={() => setActiveUploadDoc(doc)}
            onChange={() => setActiveUploadDoc(doc)}
            onDelete={() => handleDelete(doc.id)}
          />
        ))}

        {/* 2. Conditional Documents (if any applicable) */}
        {conditionalDocs.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 14 }]}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="document-text-outline" size={16} color={BrandColors.PRIMARY_BLUE} />
                <Text style={styles.sectionTitle}>Conditional Documents</Text>
              </View>
              <View style={[styles.sectionBadge, { backgroundColor: "#F1F5F9" }]}>
                <Text style={[styles.sectionBadgeText, { color: BrandColors.TEXT_SECONDARY }]}>
                  {conditionalDocs.filter((d) => d.status === "uploaded").length}/{conditionalDocs.length}
                </Text>
              </View>
            </View>

            {conditionalDocs.map((doc) => (
              <TdsDocumentCard
                key={doc.id}
                item={doc}
                isUploading={uploadingDocId === doc.id}
                uploadProgress={uploadProgress}
                error={docErrors[doc.id]}
                onUploadPress={() => setActiveUploadDoc(doc)}
                onChange={() => setActiveUploadDoc(doc)}
                onDelete={() => handleDelete(doc.id)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue to Tax Review</Text>
          <Ionicons name="arrow-forward" size={18} color={BrandColors.WHITE} />
        </TouchableOpacity>
      </View>

      {/* Upload Bottom Sheet Modal */}
      {activeUploadDoc && (
        <DocumentUploadBottomSheet
          visible={Boolean(activeUploadDoc)}
          documentTitle={activeUploadDoc.title}
          maxSizeBytesText="20 MB"
          onClose={() => setActiveUploadDoc(null)}
          onPickFiles={handlePickFiles}
          onPickGallery={handlePickGallery}
          onTakePhoto={handleTakePhoto}
        />
      )}

      {/* Universal Save As Draft Confirmation Modal */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Application Progress?"
        message="You have unsaved changes in your TDS refund documents. Save your progress so you can resume anytime without re-uploading."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default TdsDocumentChecklistScreen;
