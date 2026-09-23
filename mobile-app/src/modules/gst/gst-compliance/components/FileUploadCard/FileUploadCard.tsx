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
import {
  styles,
  getCardContainerStyle,
  getUploadingTextStyle,
  getProgressBarTrackStyle,
  getProgressBarFillStyle,
  getIconWrapStyle,
  getFileNameTextStyle,
  getFileSizeTextStyle,
  getSecondaryButtonStyle,
  getSecondaryButtonTextStyle,
  getDeleteButtonStyle,
  getDeleteButtonTextStyle,
  getTitleTextStyle,
  getBadgeStyle,
  getBadgeTextStyle,
  getCameraSecondaryButtonTextStyle,
} from "./FileUploadCard.styles";

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

  const handlePickFile = async () => {
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
      Alert.alert("Upload Error", "Could not select file. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is required to take photos of your document."
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
          onPress: () => {
            onDocChange(null);
          },
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
      return "grid-outline";
    }
    if (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png")
    ) {
      return "image-outline";
    }
    return "document-outline";
  };

  return (
    <View style={[styles.cardContainer, getCardContainerStyle(isDark, Boolean(error))]}>
      {/* Uploading State */}
      {isUploading ? (
        <View style={styles.uploadingBox}>
          <View style={styles.uploadingHeader}>
            <Text style={[styles.uploadingText, getUploadingTextStyle(isDark)]}>
              Uploading Document...
            </Text>
            <Text style={styles.uploadingPercent}>
              {uploadProgress}%
            </Text>
          </View>
          <View style={[styles.progressBarTrack, getProgressBarTrackStyle(isDark)]}>
            <View
              style={[
                styles.progressBarFill,
                getProgressBarFillStyle(uploadProgress),
              ]}
            />
          </View>
        </View>
      ) : uploadedDoc ? (
        /* Minimal Uploaded State */
        <View style={styles.contentContainer}>
          {/* Top Row: Icon + Filename + ✓ Uploaded Badge */}
          <View style={styles.topRow}>
            <View style={styles.titleWithIcon}>
              <View style={[styles.iconWrap, getIconWrapStyle(isDark)]}>
                <Ionicons
                  name={getDocIcon(uploadedDoc.name)}
                  size={20}
                  color={BrandColors.PRIMARY_BLUE_ACCENT}
                />
              </View>
              <Text
                style={[styles.fileNameText, getFileNameTextStyle(isDark)]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {uploadedDoc.name}
              </Text>
            </View>

            <View style={styles.successBadge}>
              <Ionicons name="checkmark-circle" size={13} color="#16A34A" />
              <Text style={styles.successBadgeText}>Uploaded</Text>
            </View>
          </View>

          {/* File Size */}
          <Text style={[styles.fileSizeText, getFileSizeTextStyle(isDark)]}>
            {uploadedDoc.sizeFormatted}
          </Text>

          {/* Action Buttons: Replace & Delete */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePickFile}
              style={[styles.secondaryButton, getSecondaryButtonStyle(isDark)]}
            >
              <Ionicons
                name="swap-horizontal"
                size={16}
                color={isDark ? "#E2E8F0" : "#334155"}
              />
              <Text style={[styles.secondaryButtonText, getSecondaryButtonTextStyle(isDark)]}>
                Replace
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDelete}
              style={[
                styles.secondaryButton,
                styles.deleteButton,
                getDeleteButtonStyle(isDark),
              ]}
            >
              <Ionicons name="trash-outline" size={16} color="#DC2626" />
              <Text style={[styles.secondaryButtonText, getDeleteButtonTextStyle()]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Minimal Empty State */
        <View style={styles.contentContainer}>
          {/* Top Row: Icon + Title + Required Badge */}
          <View style={styles.topRow}>
            <View style={styles.titleWithIcon}>
              <Ionicons
                name="document-text-outline"
                size={19}
                color={BrandColors.PRIMARY_BLUE_ACCENT}
              />
              <Text style={[styles.titleText, getTitleTextStyle(isDark)]}>
                {title}
              </Text>
            </View>

            <View style={[styles.badge, getBadgeStyle(required, isDark)]}>
              <Text style={[styles.badgeText, getBadgeTextStyle(required, isDark)]}>
                {required ? "Required" : "Optional"}
              </Text>
            </View>
          </View>

          {/* Two Action Buttons: [ 📷 Camera ]  [ ☁ Upload File ] */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleTakePhoto}
              style={[styles.secondaryButton, getSecondaryButtonStyle(isDark)]}
            >
              <Ionicons
                name="camera-outline"
                size={18}
                color={isDark ? "#F8FAFC" : "#1E293B"}
              />
              <Text style={[styles.secondaryButtonText, getCameraSecondaryButtonTextStyle(isDark)]}>
                Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePickFile}
              style={styles.primaryButton}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.primaryButtonText}>Upload File</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Inline Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};
