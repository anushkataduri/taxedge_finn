import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../hooks/use-theme";
import { PrimaryButton } from "../PrimaryButton/PrimaryButton";
import { SecondaryButton } from "../SecondaryButton";
import type { ApplicationDocument, IconName } from "../../types/domain";
import {
  CATEGORIES,
  GST_KEYWORDS,
  KYC_KEYWORDS,
  styles,
} from "./DocumentChecklist.styles";

export interface DocumentChecklistProps {
  documents: ApplicationDocument[];
  onUpload: (docName: string, fileUri: string) => void;
  /**
   * Sort the documents under KYC / GST / Financial headings. Turn this off when
   * the caller has already grouped them - the vault screen passes one category
   * at a time, and a second set of headings inside it would just repeat itself.
   */
  grouped?: boolean;
}

const PICKER_STRATEGIES = {
  camera: {
    request: ImagePicker.requestCameraPermissionsAsync,
    launch: () => ImagePicker.launchCameraAsync({ quality: 0.8 }),
    deniedMessage: "Camera access is required to take photos",
  },
  gallery: {
    request: ImagePicker.requestMediaLibraryPermissionsAsync,
    launch: () => ImagePicker.launchImageLibraryAsync({ quality: 0.8 }),
    deniedMessage: "Gallery access is required to choose photos",
  },
} as const;

const IMAGE_EXTENSIONS = [".jpg", ".png", ".jpeg"] as const;

export function DocumentChecklist({
  documents,
  onUpload,
  grouped = true,
}: DocumentChecklistProps) {
  const colors = useTheme();

  // State for upload process
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadPress = (docName: string) => {
    setSelectedDoc(docName);
    setShowSourceModal(true);
  };

  const handlePickDocument = async () => {
    setShowSourceModal(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      !result.canceled &&
        result.assets &&
        result.assets.length > 0 &&
        (setPreviewUri(result.assets[0].uri), setShowPreviewModal(true));
    } catch {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handlePickImage = async (mode: "camera" | "gallery") => {
    setShowSourceModal(false);
    try {
      const strategy = PICKER_STRATEGIES[mode];
      const { status } = await strategy.request();
      status !== "granted"
        ? Alert.alert("Permission Denied", strategy.deniedMessage)
        : await (async () => {
            const result = await strategy.launch();
            !result.canceled &&
              result.assets &&
              result.assets.length > 0 &&
              (setPreviewUri(result.assets[0].uri), setShowPreviewModal(true));
          })();
    } catch {
      Alert.alert("Error", "Failed to capture image");
    }
  };

  const handleConfirmUpload = () => {
    selectedDoc &&
      previewUri &&
      (setIsUploading(true),
      setTimeout(() => {
        onUpload(selectedDoc, previewUri);
        setIsUploading(false);
        setShowPreviewModal(false);
        setPreviewUri(null);
        setSelectedDoc(null);
        Alert.alert("Success", "Document uploaded successfully");
      }, 1500));
  };

  // Group documents dynamically using functional predicates
  const getDocumentCategory = (name: string): string => {
    const lowerName = name.toLowerCase();
    return KYC_KEYWORDS.some((kw) => lowerName.includes(kw))
      ? "KYC Documents"
      : GST_KEYWORDS.some((kw) => lowerName.includes(kw))
        ? "GST Documents"
        : "Financial Documents";
  };

  const statusConfigMap: Record<
    string,
    { icon: IconName; color: string; cardBg: string }
  > = {
    Uploaded: {
      icon: "checkmark-circle",
      color: colors.success,
      cardBg: colors.background,
    },
    Rejected: {
      icon: "close-circle",
      color: colors.error,
      cardBg: `${colors.error}08`,
    },
    default: {
      icon: "time-outline",
      color: colors.textSecondary,
      cardBg: colors.background,
    },
  };

  const renderDocItem = (doc: ApplicationDocument, idx: number) => {
    const isUploaded = doc.status === "Uploaded";
    const statusCfg = statusConfigMap[doc.status] ?? statusConfigMap.default;

    return (
      <View
        key={idx}
        style={[
          styles.docCard,
          {
            backgroundColor: statusCfg.cardBg,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.docInfo}>
          <Ionicons name={statusCfg.icon} size={20} color={statusCfg.color} />
          <View style={styles.textContainer}>
            <Text style={[styles.docName, { color: colors.text }]}>
              {doc.name}
            </Text>
          </View>
        </View>

        {!isUploaded ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleUploadPress(doc.name)}
            style={[
              styles.uploadBtn,
              {
                backgroundColor: colors.orangeLight,
              },
            ]}
          >
            <Text style={[styles.uploadBtnText, { color: colors.orange }]}>
              Upload
            </Text>
            <Ionicons
              name="cloud-upload-outline"
              size={14}
              color={colors.orange}
            />
          </TouchableOpacity>
        ) : (
          <Ionicons name="checkmark-done" size={18} color={colors.success} />
        )}
      </View>
    );
  };

  const isImagePreview = Boolean(
    previewUri &&
      (IMAGE_EXTENSIONS.some((ext) => previewUri.endsWith(ext)) ||
        previewUri.startsWith("content://media"))
  );

  return (
    <View style={styles.container}>
      {!grouped && (
        <View style={styles.docsList}>
          {documents.map((doc, idx) => renderDocItem(doc, idx))}
        </View>
      )}

      {grouped &&
        CATEGORIES.map((category) => ({
          category,
          categoryDocs: documents.filter(
            (doc) => getDocumentCategory(doc.name) === category
          ),
        }))
          .filter(({ categoryDocs }) => categoryDocs.length > 0)
          .map(({ category, categoryDocs }) => (
            <View key={category} style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>
                {category}
              </Text>
              <View style={styles.docsList}>
                {categoryDocs.map((doc, idx) => renderDocItem(doc, idx))}
              </View>
            </View>
          ))}

      {/* Select Source Modal */}
      <Modal
        visible={showSourceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.sourceModalContainer,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Upload Document
            </Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Choose source for {selectedDoc}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePickImage("camera")}
              style={[styles.sourceBtn, { borderColor: colors.border }]}
            >
              <Ionicons name="camera-outline" size={24} color={colors.orange} />
              <Text style={[styles.sourceBtnText, { color: colors.text }]}>
                Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handlePickImage("gallery")}
              style={[styles.sourceBtn, { borderColor: colors.border }]}
            >
              <Ionicons name="image-outline" size={24} color={colors.orange} />
              <Text style={[styles.sourceBtnText, { color: colors.text }]}>
                Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePickDocument}
              style={[styles.sourceBtn, { borderColor: colors.border }]}
            >
              <Ionicons
                name="document-outline"
                size={24}
                color={colors.orange}
              />
              <Text style={[styles.sourceBtnText, { color: colors.text }]}>
                Files
              </Text>
            </TouchableOpacity>

            <SecondaryButton
              title="Cancel"
              onPress={() => setShowSourceModal(false)}
              style={styles.cancelBtnMarginTop}
            />
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal
        visible={showPreviewModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.previewModalContainer,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Preview Upload
            </Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              {selectedDoc}
            </Text>

            <View style={[styles.previewBox, { borderColor: colors.border }]}>
              {isImagePreview ? (
                <Image
                  source={{ uri: previewUri ?? "" }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.filePlaceholder}>
                  <Ionicons
                    name="document-text"
                    size={64}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.fileText, { color: colors.text }]}>
                    Document File Selected
                  </Text>
                  <Text
                    style={[styles.fileUri, { color: colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {previewUri}
                  </Text>
                </View>
              )}
            </View>

            {isUploading ? (
              <View style={styles.uploadingState}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.uploadingText, { color: colors.text }]}>
                  Uploading to TaxEdge...
                </Text>
              </View>
            ) : (
              <View style={styles.btnRow}>
                <SecondaryButton
                  title="Cancel"
                  onPress={() => {
                    setShowPreviewModal(false);
                    setPreviewUri(null);
                  }}
                  style={styles.btnFlex1}
                />
                <PrimaryButton
                  title="Confirm"
                  onPress={handleConfirmUpload}
                  style={styles.btnFlex1}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
