import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/shared/hooks/useTheme";
import { BrandColors } from "@/shared/theme";
import {
  formatFileSize,
  isFileSizeValid,
  isFileTypeAllowed,
  MAX_FILE_SIZE_BYTES,
} from "@/modules/gst/utils/gstValidation";
import { UploadedDocInfo } from "@/modules/gst/validation/complianceSchema";
import { styles } from "@/modules/gst/gst-compliance/components/FileUploadCard/FileUploadCard.styles";
import {
  FileUploadSourceModal,
  FileUploadPreviewModal,
} from "@/modules/gst/gst-compliance/components/FileUploadCard/FileUploadModals";

export interface FileUploadCardProps {
  title: string;
  description?: string;
  required?: boolean;
  allowedExtensions: string[];
  supportedFormatsText?: string;
  maxSizeBytes?: number;
  uploadedDoc: UploadedDocInfo | null;
  onDocChange: (doc: UploadedDocInfo | null) => void;
  error?: string;
  onClearError?: () => void;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  title,
  description,
  required = false,
  allowedExtensions,
  supportedFormatsText = "PDF, JPG, PNG, XLS, XLSX, CSV",
  maxSizeBytes = MAX_FILE_SIZE_BYTES,
  uploadedDoc,
  onDocChange,
  error,
  onClearError,
}) => {
  const { isDark } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const getMimeTypes = (): string[] => {
    const mimes: string[] = [];
    if (allowedExtensions.includes(".pdf")) mimes.push("application/pdf");
    if (
      allowedExtensions.includes(".xls") ||
      allowedExtensions.includes(".xlsx")
    ) {
      mimes.push("application/vnd.ms-excel");
      mimes.push(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    }
    if (allowedExtensions.includes(".csv")) {
      mimes.push("text/csv");
      mimes.push("application/csv");
      mimes.push("text/comma-separated-values");
    }
    if (
      allowedExtensions.includes(".jpg") ||
      allowedExtensions.includes(".png") ||
      allowedExtensions.includes(".jpeg")
    ) {
      mimes.push("image/*");
    }
    return mimes.length > 0 ? mimes : ["*/*"];
  };

  const simulateProgress = (callback: () => void) => {
    setIsUploading(true);
    setUploadProgress(20);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(100);
            callback();
          }, 100);
          return 95;
        }
        return prev + 30;
      });
    }, 70);
  };

  const handlePickDocument = async () => {
    setSourceModalVisible(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: getMimeTypes(),
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name || `${title.replace(/\s+/g, "_")}.pdf`;
        const fileSize = asset.size;

        if (!isFileTypeAllowed(fileName, allowedExtensions)) {
          Alert.alert(
            "Unsupported File",
            `Please upload a valid file (${supportedFormatsText}).\nMaximum size: 20 MB.`
          );
          return;
        }

        if (!isFileSizeValid(fileSize, maxSizeBytes)) {
          Alert.alert(
            "File Too Large",
            "Maximum size allowed is 20 MB. Please select a smaller file."
          );
          return;
        }

        simulateProgress(() => {
          onDocChange({
            uri: asset.uri,
            name: fileName,
            size: fileSize,
            sizeFormatted: formatFileSize(fileSize),
            mimeType: asset.mimeType,
          });
          if (onClearError) onClearError();
        });
      }
    } catch {
      Alert.alert("Upload Error", "Could not select document. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    setSourceModalVisible(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is required to capture your document."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.85,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const cleanName = `${title.replace(/\s+/g, "_")}_Capture.jpg`;
        const fileSize = asset.fileSize;

        if (!isFileSizeValid(fileSize, maxSizeBytes)) {
          Alert.alert(
            "File Too Large",
            "Captured photo exceeds 20 MB limit. Please take with standard resolution."
          );
          return;
        }

        simulateProgress(() => {
          onDocChange({
            uri: asset.uri,
            name: cleanName,
            size: fileSize,
            sizeFormatted: formatFileSize(fileSize || 1500000),
            mimeType: "image/jpeg",
          });
          if (onClearError) onClearError();
        });
      }
    } catch {
      Alert.alert("Camera Error", "Could not capture photo. Please try again.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Remove Document?",
      `Are you sure you want to remove "${uploadedDoc?.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDocChange(null),
        },
      ]
    );
  };

  const getDocIcon = (filename: string): keyof typeof Ionicons.glyphMap => {
    const lower = filename.toLowerCase();
    if (lower.endsWith(".pdf")) return "document-text";
    if (
      lower.endsWith(".xls") ||
      lower.endsWith(".xlsx") ||
      lower.endsWith(".csv")
    ) {
      return "grid";
    }
    if (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".webp")
    ) {
      return "image";
    }
    return "document-outline";
  };

  const isUploaded = Boolean(uploadedDoc);

  return (
    <View
      style={[
        styles.cardContainer,
        isUploaded
          ? isDark
            ? styles.cardContainerDarkUploaded
            : styles.cardContainerUploaded
          : isDark
          ? styles.cardContainerDarkEmpty
          : styles.cardContainerEmpty,
        Boolean(error) && styles.cardContainerError,
      ]}
    >
      {/* Uploading Progress */}
      {isUploading ? (
        <View style={styles.uploadingBox}>
          <View style={styles.uploadingHeader}>
            <Text style={styles.uploadingText}>Uploading Document...</Text>
            <Text style={styles.uploadingPercent}>{uploadProgress}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${uploadProgress}%` }]}
            />
          </View>
        </View>
      ) : (
        <>
          {/* Top Row: Icon + Title/Subtitle + Uploaded Info */}
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.iconBox,
                isUploaded ? styles.iconBoxUploaded : styles.iconBoxEmpty,
              ]}
            >
              <Ionicons
                name={
                  isUploaded
                    ? getDocIcon(uploadedDoc?.name || "")
                    : "document-text-outline"
                }
                size={22}
                color={
                  isUploaded
                    ? "#16A34A"
                    : BrandColors.PRIMARY_BLUE_ACCENT
                }
              />
            </View>

            <View style={styles.textCol}>
              <View style={styles.titleRow}>
                <Text
                  style={[styles.cardTitle, isDark && styles.cardTitleDark]}
                >
                  {title}
                </Text>
                {required ? <Text style={styles.star}> *</Text> : null}
              </View>

              <Text
                style={[
                  styles.cardSubtitle,
                  isDark && styles.cardSubtitleDark,
                ]}
              >
                {description || supportedFormatsText || "Max 20 MB · PDF, JPG, PNG, XLS"}
              </Text>

              {isUploaded && uploadedDoc ? (
                <View style={styles.uploadedInfoRow}>
                  <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                  <Text
                    style={[
                      styles.uploadedFileName,
                      isDark && styles.uploadedFileNameDark,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {uploadedDoc.name} ({uploadedDoc.sizeFormatted})
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Bottom Action Row (Image 1 Layout) */}
          <View style={styles.bottomActionRow}>
            {isUploaded && uploadedDoc ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPreviewModalVisible(true)}
                  style={[styles.viewBtn, isDark && styles.viewBtnDark]}
                >
                  <Ionicons
                    name="eye-outline"
                    size={15}
                    color={isDark ? "#E2E8F0" : "#334155"}
                  />
                  <Text
                    style={[
                      styles.viewBtnText,
                      isDark && styles.viewBtnTextDark,
                    ]}
                  >
                    View
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSourceModalVisible(true)}
                  style={[styles.changeBtn, isDark && styles.changeBtnDark]}
                >
                  <Ionicons
                    name="swap-horizontal"
                    size={15}
                    color={isDark ? "#FDBA74" : "#EA580C"}
                  />
                  <Text
                    style={[
                      styles.changeBtnText,
                      isDark && styles.changeBtnTextDark,
                    ]}
                  >
                    Change
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleDelete}
                  style={[styles.deleteBtn, isDark && styles.deleteBtnDark]}
                >
                  <Ionicons name="trash-outline" size={15} color="#DC2626" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSourceModalVisible(true)}
                style={[styles.uploadBtn, isDark && styles.uploadBtnDark]}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={16}
                  color={isDark ? "#93C5FD" : "#1D4ED8"}
                />
                <Text
                  style={[
                    styles.uploadBtnText,
                    isDark && styles.uploadBtnTextDark,
                  ]}
                >
                  Upload File
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {/* Validation Error */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Source Selection Modal (Camera vs Gallery/Files) */}
      <FileUploadSourceModal
        visible={sourceModalVisible}
        isDark={isDark}
        onClose={() => setSourceModalVisible(false)}
        onTakePhoto={handleTakePhoto}
        onPickDocument={handlePickDocument}
      />

      {/* Document Preview Modal */}
      <FileUploadPreviewModal
        visible={previewModalVisible}
        isDark={isDark}
        uploadedDoc={uploadedDoc}
        onClose={() => setPreviewModalVisible(false)}
      />
    </View>
  );
};

export default FileUploadCard;
