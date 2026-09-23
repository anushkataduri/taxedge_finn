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
import { DocumentUploadBottomSheet } from "@/modules/itr/tds/components/upload/DocumentUploadBottomSheet/DocumentUploadBottomSheet";
import { BusinessDocumentItem } from "../../../types/documentUpload.types";
import { DocumentUploadIcon } from "../DocumentUploadIcons";
import { styles } from "./DocumentUploadCard.styles";

interface DocumentUploadCardProps {
  item: BusinessDocumentItem;
  onUploadSuccess: (
    id: string,
    fileInfo: { uri: string; name: string; size: string; mimeType?: string }
  ) => void;
  onRemove: (id: string) => void;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  item,
  onUploadSuccess,
  onRemove,
}) => {
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const isUploaded = item.status === "uploaded" || !!item.fileUri;

  const handleFilePicked = (uri: string, name: string, size?: number, mimeType?: string) => {
    // 10 MB limit check (10 * 1024 * 1024 bytes = 10,485,760 bytes)
    if (size && size > 10 * 1024 * 1024) {
      Alert.alert("File Too Large", "Maximum supported file size is 10 MB.");
      return;
    }

    const sizeInMb = size
      ? `${(size / (1024 * 1024)).toFixed(1)} MB`
      : "2.4 MB";

    onUploadSuccess(item.id, {
      uri,
      name,
      size: sizeInMb,
      mimeType,
    });
    setShowUploadSheet(false);
  };

  const handlePickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        handleFilePicked(asset.uri, asset.name, asset.size, asset.mimeType);
      }
    } catch (error) {
      Alert.alert("File Upload", "Could not open document picker.");
    }
  };

  const handlePickGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Photo library permission is needed to upload documents.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const pickedName = asset.fileName || `doc_${Date.now()}.jpg`;
        handleFilePicked(asset.uri, pickedName, (asset as any).fileSize, asset.mimeType);
      }
    } catch {
      Alert.alert("Gallery Error", "Could not open photo gallery. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera permission is needed to photograph documents.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const pickedName = asset.fileName || `camera_doc_${Date.now()}.jpg`;
        handleFilePicked(asset.uri, pickedName, (asset as any).fileSize, asset.mimeType);
      }
    } catch {
      Alert.alert("Camera Error", "Could not open camera. Please try again.");
    }
  };

  const renderStatusButton = () => {
    if (item.status === "verified") {
      return (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-done" size={14} color="#FFFFFF" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      );
    }

    if (item.status === "under_review") {
      return (
        <View style={styles.underReviewBadge}>
          <Ionicons name="time-outline" size={14} color="#0B1F3A" />
          <Text style={styles.underReviewText}>Under Review</Text>
        </View>
      );
    }

    if (item.status === "rejected") {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowUploadSheet(true)}
          style={styles.rejectedButton}
        >
          <Ionicons name="refresh-outline" size={14} color="#DC2626" />
          <Text style={styles.rejectedText}>Re-upload</Text>
        </TouchableOpacity>
      );
    }

    if (isUploaded) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowUploadSheet(true)}
          style={styles.uploadedBadge}
        >
          <Ionicons name="checkmark" size={14} color="#F97316" />
          <Text style={styles.uploadedText}>Uploaded</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowUploadSheet(true)}
        style={styles.uploadButton}
      >
        <Ionicons name="arrow-up-outline" size={15} color="#F97316" />
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.leftGroup}>
        <DocumentUploadIcon type={item.iconType} />

        <View style={styles.textGroup}>
          <Text style={styles.docTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.docSubtitle} numberOfLines={1}>
            {isUploaded && item.fileName
              ? `${item.fileName} • ${item.fileSize || "2.4 MB"}`
              : item.subtitle}
          </Text>
        </View>
      </View>

      {renderStatusButton()}

      {/* Unified Document Upload Bottom Sheet */}
      <DocumentUploadBottomSheet
        visible={showUploadSheet}
        documentTitle={item.title}
        maxSizeBytesText="10 MB"
        onClose={() => setShowUploadSheet(false)}
        onPickFiles={handlePickFiles}
        onPickGallery={handlePickGallery}
        onTakePhoto={handleTakePhoto}
      />
    </View>
  );
};
