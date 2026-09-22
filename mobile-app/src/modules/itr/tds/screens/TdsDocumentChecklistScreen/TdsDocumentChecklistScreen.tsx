import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TdsDocumentItem, DocumentUploadPayload } from "../../types/tdsDocuments.types";
import { INITIAL_TDS_DOCUMENTS } from "../../constants/tdsDocuments.constants";
import {
  TdsDocumentHeader,
  TdsUploadProgressBar,
  TdsDocumentCard,
} from "../../components/documents";
import { useApplicationStore } from "@/store/applicationStore";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./TdsDocumentChecklistScreen.styles";

export const TdsDocumentChecklistScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const tdsDraft = useApplicationStore((state) => state.tdsDraft);
  const saveTdsDraft = useApplicationStore((state) => state.saveTdsDraft);
  const clearTdsDraft = useApplicationStore((state) => state.clearTdsDraft);

  // Pure functional initial state: restore uploaded docs from draft synchronously - zero loops
  const [documents, setDocuments] = useState<TdsDocumentItem[]>(() => {
    const draft = useApplicationStore.getState().tdsDraft;
    if (draft && draft.documents && Array.isArray(draft.documents) && draft.documents.length > 0) {
      const savedMap = new Map(draft.documents.map((d: any) => [d.id, d]));
      return INITIAL_TDS_DOCUMENTS.map((doc) => {
        const saved = savedMap.get(doc.id);
        if (!saved) return doc;
        return {
          ...doc,
          status: (saved.status === "uploaded" ? "uploaded" : "not_uploaded") as TdsDocumentItem["status"],
          fileUri: saved.fileUri,
          fileName: saved.fileName,
          fileSize: saved.fileSize,
          mimeType: saved.mimeType,
          fileTypeLabel: saved.fileTypeLabel,
        };
      });
    }
    return INITIAL_TDS_DOCUMENTS;
  });

  // Keep state synchronized with draft store functionally - zero loops
  useEffect(() => {
    if (tdsDraft && tdsDraft.documents && Array.isArray(tdsDraft.documents) && tdsDraft.documents.length > 0) {
      const savedMap = new Map(tdsDraft.documents.map((d: any) => [d.id, d]));
      setDocuments((prev) =>
        prev.map((doc) => {
          const saved = savedMap.get(doc.id);
          if (!saved) return doc;
          return {
            ...doc,
            status: (saved.status === "uploaded" ? "uploaded" : "not_uploaded") as TdsDocumentItem["status"],
            fileUri: saved.fileUri,
            fileName: saved.fileName,
            fileSize: saved.fileSize,
            mimeType: saved.mimeType,
            fileTypeLabel: saved.fileTypeLabel,
          };
        })
      );
    }
  }, [tdsDraft?.documents]);

  // Universal draft guard hook (same pattern as GST and ITR)
  const {
    showDraftModal,
    openDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () =>
      documents.some((d) => Boolean(d.fileUri || d.status === "uploaded")),
    onSaveDraft: () => {
      saveTdsDraft?.({
        formData: tdsDraft?.formData || {},
        documents: documents as any,
        step: "DOCUMENTS",
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    },
    onDiscardDraft: () => {
      clearTdsDraft?.();
    },
  });

  // Functional count of uploaded documents - zero loops
  const uploadedCount = documents.filter(
    (d) => d.status === "uploaded" || !!d.fileUri
  ).length;
  const totalCount = documents.length;

  // Check mandatory completeness functionally - zero loops
  const mandatoryDocs = documents.filter((d) => d.isMandatory);
  const isMandatoryComplete = mandatoryDocs.every(
    (d) => d.status === "uploaded" || !!d.fileUri
  );

  const handleUploadSuccess = (id: string, payload: DocumentUploadPayload) => {
    const updated = documents.map((doc) =>
      doc.id === id
        ? {
            ...doc,
            status: "uploaded" as const,
            fileUri: payload.uri,
            fileName: payload.name,
            fileSize: payload.size,
            mimeType: payload.mimeType,
            fileTypeLabel: payload.fileTypeLabel,
            errorMessage: undefined,
          }
        : doc
    );
    setDocuments(updated);

    // Immediately persist uploaded documents to draft store
    saveTdsDraft?.({
      formData: tdsDraft?.formData || {},
      documents: updated as any,
      step: "DOCUMENTS",
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  };

  const handleUploadError = (id: string, errorMessage: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: "not_uploaded",
              errorMessage,
            }
          : doc
      )
    );
  };

  const handleRemove = (id: string) => {
    const updated = documents.map((doc) =>
      doc.id === id
        ? {
            ...doc,
            status: "not_uploaded" as const,
            fileUri: undefined,
            fileName: undefined,
            fileSize: undefined,
            mimeType: undefined,
            fileTypeLabel: undefined,
            errorMessage: undefined,
          }
        : doc
    );
    setDocuments(updated);

    // Immediately persist document removal to draft store
    saveTdsDraft?.({
      formData: tdsDraft?.formData || {},
      documents: updated as any,
      step: "DOCUMENTS",
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  };

  const handleContinue = () => {
    if (!isMandatoryComplete) {
      // Mark missing mandatory documents with inline card errors functionally - zero loops
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.isMandatory && !doc.fileUri && doc.status !== "uploaded"
            ? {
                ...doc,
                errorMessage: "This required document must be uploaded to proceed",
              }
            : doc
        )
      );
      return;
    }

    // Save state into draft store
    saveTdsDraft?.({
      formData: tdsDraft?.formData || {},
      documents: documents as any,
      step: "DOCUMENTS",
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    // Navigate to next screen: TDS Refund Estimate & Review Screen
    router.push("/service/tds-estimate" as any);
  };

  const handleBackPress = () => {
    const isDirty = documents.some((d) => Boolean(d.fileUri || d.status === "uploaded"));
    if (isDirty) {
      openDraftModal();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/service/itr" as any);
    }
  };

  const containerInsetsStyle = getContainerInsetsStyle(insets.top);
  const scrollContentInsetsStyle = getScrollContentInsetsStyle(insets.bottom);
  const bottomBarInsetsStyle = getBottomBarInsetsStyle(insets.bottom);

  return (
    <View style={[styles.container, containerInsetsStyle]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header with back guard */}
      <TdsDocumentHeader onBack={handleBackPress} />

      {/* Main Scrollable Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, scrollContentInsetsStyle]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar Header */}
        <TdsUploadProgressBar
          uploadedCount={uploadedCount}
          totalCount={totalCount}
        />

        {/* 9 Document Cards with inline field validation - zero loops */}
        {documents.map((doc) => (
          <TdsDocumentCard
            key={doc.id}
            item={doc}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            onRemove={handleRemove}
          />
        ))}
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, bottomBarInsetsStyle]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            isMandatoryComplete
              ? styles.continueActive
              : styles.continueDisabled,
          ]}
        >
          <Text style={styles.continueButtonText}>Proceed to Review</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Universal Draft Modal (Same as GST & ITR) */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Document Progress?"
        message="You have uploaded documents in your TDS refund application. Save your progress so you can resume anytime without re-uploading."
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
