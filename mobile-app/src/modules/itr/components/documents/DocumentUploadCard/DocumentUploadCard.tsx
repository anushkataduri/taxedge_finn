import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
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
  const isUploaded = item.status === "uploaded" || !!item.fileUri;

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // 10 MB limit check (10 * 1024 * 1024 bytes = 10,485,760 bytes)
        if (asset.size && asset.size > 10 * 1024 * 1024) {
          Alert.alert("File Too Large", "Maximum supported file size is 10 MB.");
          return;
        }

        const sizeInMb = asset.size
          ? `${(asset.size / (1024 * 1024)).toFixed(1)} MB`
          : "2.4 MB";

        onUploadSuccess(item.id, {
          uri: asset.uri,
          name: asset.name,
          size: sizeInMb,
          mimeType: asset.mimeType,
        });
      }
    } catch (error) {
      Alert.alert("File Upload", "Could not open document picker.");
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
          onPress={handlePickDocument}
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
          onPress={handlePickDocument}
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
        onPress={handlePickDocument}
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
    </View>
  );
};
