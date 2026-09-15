import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
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
  const isUploaded = !!fileName;

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // 10 MB limit check
        if (asset.size && asset.size > 10 * 1024 * 1024) {
          Alert.alert("File Too Large", "Maximum supported file size is 10 MB.");
          return;
        }

        const sizeInMb = asset.size
          ? `${(asset.size / (1024 * 1024)).toFixed(1)} MB`
          : "2.4 MB";

        onUploadSuccess({
          uri: asset.uri,
          name: asset.name,
          size: sizeInMb,
        });
      }
    } catch {
      Alert.alert("Upload Error", "Could not open file picker.");
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
        onPress={handlePickDocument}
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
    </View>
  );
};
