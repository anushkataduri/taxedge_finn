import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { TdsDocumentItem, DocumentUploadPayload } from "../../../types/tdsDocuments.types";
import { TdsDocIcon } from "../TdsDocIcon";
import { UploadSourceModal } from "../UploadSourceModal";
import { RemoveConfirmModal } from "../RemoveConfirmModal";
import { ViewDocumentModal } from "../ViewDocumentModal";
import { styles } from "./TdsDocumentCard.styles";

const DEFAULT_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx", "json"];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB matching user mockup

interface TdsDocumentCardProps {
  item: TdsDocumentItem;
  onUploadSuccess: (id: string, payload: DocumentUploadPayload) => void;
  onUploadError: (id: string, errorMessage: string) => void;
  onRemove: (id: string) => void;
}

export const TdsDocumentCard: React.FC<TdsDocumentCardProps> = ({
  item,
  onUploadSuccess,
  onUploadError,
  onRemove,
}) => {
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const isUploaded = item.status === "uploaded" || !!item.fileUri;
  const hasError = !isUploaded && !!item.errorMessage;

  const validateAndProcessFile = (
    asset: { uri: string; name?: string; size?: number; mimeType?: string },
    defaultName: string
  ) => {
    const fileName = asset.name || defaultName;
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    const allowed = item.allowedExtensions || DEFAULT_EXTENSIONS;
    const isValidFormat = allowed.includes(extension);

    if (!isValidFormat) {
      onUploadError(
        item.id,
        `Unsupported file (.${extension || "unknown"}). Accepted: ${item.acceptedFormats}`
      );
      return;
    }

    if (asset.size && asset.size > MAX_FILE_SIZE_BYTES) {
      onUploadError(
        item.id,
        "File exceeds 2 MB limit. Please select a smaller file."
      );
      return;
    }

    const sizeInMb = asset.size
      ? `${(asset.size / (1024 * 1024)).toFixed(2)} MB`
      : "0.32 MB";

    onUploadSuccess(item.id, {
      uri: asset.uri,
      name: fileName,
      size: sizeInMb,
      mimeType: asset.mimeType,
      fileTypeLabel: extension.toUpperCase() || "FILE",
    });
  };

  const handleChooseFiles = async () => {
    setShowSourceModal(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        validateAndProcessFile(result.assets[0], `${item.id}_document.pdf`);
      }
    } catch {
      onUploadError(item.id, "Could not open document picker. Please try again.");
    }
  };

  const handleSelectGallery = async () => {
    setShowSourceModal(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        onUploadError(item.id, "Gallery permission is required to select photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        validateAndProcessFile(
          result.assets[0],
          `${item.id}_gallery_${Date.now()}.jpg`
        );
      }
    } catch {
      onUploadError(item.id, "Could not open photo gallery. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    setShowSourceModal(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        onUploadError(item.id, "Camera permission is required to capture documents.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        validateAndProcessFile(
          result.assets[0],
          `${item.id}_camera_${Date.now()}.jpg`
        );
      }
    } catch {
      onUploadError(item.id, "Could not open camera. Please try again.");
    }
  };

  const handleConfirmRemove = () => {
    setShowRemoveModal(false);
    onRemove(item.id);
  };

  return (
    <View
      style={[
        styles.card,
        isUploaded && styles.cardUploaded,
        hasError && styles.cardError,
      ]}
    >
      {/* Top Main Row */}
      <View style={styles.topRow}>
        {/* Left Document Icon */}
        <View style={[styles.iconContainer, isUploaded && styles.iconContainerUploaded]}>
          {isUploaded ? (
            <Ionicons name="document-text" size={22} color="#16A34A" />
          ) : (
            <TdsDocIcon type={item.iconType} />
          )}
        </View>

        {/* Title & Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {item.title}
            {item.isMandatory ? (
              <Text style={styles.requiredAsterisk}> *</Text>
            ) : (
              <Text style={styles.optionalLabel}> (optional)</Text>
            )}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle || `TDS Certificate issued by employer • up to 2 MB`}
          </Text>

          {/* Uploaded File Info Row */}
          {isUploaded && (
            <View style={styles.uploadedFileRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#059669"
                style={styles.checkDot}
              />
              <Text style={styles.uploadedFileName} numberOfLines={1}>
                {`${item.fileName || "Uploaded document"} (${item.fileSize || "0.32 MB"})`}
              </Text>
            </View>
          )}
        </View>

        {/* Right Action: Upload Pill Button (when NOT uploaded) */}
        {!isUploaded && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowSourceModal(true)}
            style={styles.uploadButton}
          >
            <Ionicons name="arrow-up" size={14} color="#4338CA" />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Uploaded Action Buttons Row: View, Change, Remove */}
      {isUploaded && (
        <View style={styles.uploadedActionsRow}>
          {/* View Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowViewModal(true)}
            style={styles.viewButton}
          >
            <Ionicons name="eye-outline" size={15} color="#1E3A8A" />
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>

          {/* Change Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowSourceModal(true)}
            style={styles.changeButton}
          >
            <Ionicons name="swap-horizontal" size={15} color="#D97706" />
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>

          {/* Remove Trash Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowRemoveModal(true)}
            style={styles.trashButton}
          >
            <Ionicons name="trash-outline" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      )}

      {/* Inline Field Error Indicator */}
      {hasError && (
        <View style={styles.inlineErrorRow}>
          <Ionicons name="alert-circle" size={14} color="#DC2626" style={styles.errorIcon} />
          <Text style={styles.inlineErrorText}>{item.errorMessage}</Text>
        </View>
      )}

      {/* Modal 1: Upload Source Selection */}
      <UploadSourceModal
        visible={showSourceModal}
        documentTitle={item.title}
        maxSizeText="Maximum file size: 2 MB"
        onChooseFiles={handleChooseFiles}
        onSelectGallery={handleSelectGallery}
        onTakePhoto={handleTakePhoto}
        onClose={() => setShowSourceModal(false)}
      />

      {/* Modal 2: Remove Confirmation Dialog */}
      <RemoveConfirmModal
        visible={showRemoveModal}
        title="Remove Document"
        message="Are you sure you want to remove this uploaded file?"
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowRemoveModal(false)}
      />

      {/* Modal 3: View Document Preview */}
      <ViewDocumentModal
        visible={showViewModal}
        title={item.title}
        fileUri={item.fileUri}
        fileName={item.fileName}
        fileSize={item.fileSize}
        fileTypeLabel={item.fileTypeLabel}
        onClose={() => setShowViewModal(false)}
      />
    </View>
  );
};

export default TdsDocumentCard;
