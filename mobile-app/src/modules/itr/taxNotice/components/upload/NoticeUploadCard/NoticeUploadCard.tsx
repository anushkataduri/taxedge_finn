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
import { styles } from "./NoticeUploadCard.styles";

interface NoticeUploadCardProps {
  fileName?: string;
  fileSize?: string;
  onUploadSuccess: (fileInfo: { uri: string; name: string; size: string }) => void;
  error?: string;
}

export const NoticeUploadCard: React.FC<NoticeUploadCardProps> = ({
  fileName,
  fileSize,
  onUploadSuccess,
  error,
}) => {
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const isUploaded = !!fileName;

  const handleFilePicked = (uri: string, name: string, size?: number) => {
    // 10 MB limit check
    if (size && size > 10 * 1024 * 1024) {
      Alert.alert("File Too Large", "Maximum supported file size is 10 MB.");
      return;
    }

    const sizeInMb = size
      ? `${(size / (1024 * 1024)).toFixed(1)} MB`
      : "2.4 MB";

    onUploadSuccess({
      uri,
      name,
      size: sizeInMb,
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
        handleFilePicked(asset.uri, asset.name, asset.size);
      }
    } catch {
      Alert.alert("Upload Error", "Could not open file picker.");
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
        const pickedName = asset.fileName || `notice_${Date.now()}.jpg`;
        handleFilePicked(asset.uri, pickedName, (asset as any).fileSize);
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
        const pickedName = asset.fileName || `camera_notice_${Date.now()}.jpg`;
        handleFilePicked(asset.uri, pickedName, (asset as any).fileSize);
      }
    } catch {
      Alert.alert("Camera Error", "Could not open camera. Please try again.");
    }
  };

  return (
    <View style={[styles.card, error ? styles.cardError : null]}>
      <View style={styles.iconCircle}>
        <Ionicons name="document-text-outline" size={24} color="#0B1F3A" />
      </View>

      <View style={styles.textGroup}>
        <Text style={styles.title}>Notice Document</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {isUploaded ? `${fileName} • ${fileSize || "2.4 MB"}` : "PDF, JPG or PNG • Up to 10 MB"}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowUploadSheet(true)}
        style={[styles.actionButton, isUploaded ? styles.uploadedButton : styles.uploadButton]}
      >
        {isUploaded ? (
          <View style={styles.uploadedContent}>
            <Ionicons name="checkmark" size={14} color="#EA580C" />
            <Text style={styles.uploadedText}>Uploaded</Text>
          </View>
        ) : (
          <Text style={styles.uploadText}>Upload</Text>
        )}
      </TouchableOpacity>

      {/* Unified Document Upload Bottom Sheet */}
      <DocumentUploadBottomSheet
        visible={showUploadSheet}
        documentTitle="Notice Document"
        maxSizeBytesText="10 MB"
        onClose={() => setShowUploadSheet(false)}
        onPickFiles={handlePickFiles}
        onPickGallery={handlePickGallery}
        onTakePhoto={handleTakePhoto}
      />
    </View>
  );
};
