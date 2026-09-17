import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { PreviousYearDocItem } from "../../../types/document.types";
import { PreviousYearDocIcon } from "../PreviousYearDocIcon";
import { styles } from "./PreviousYearDocCard.styles";

interface PreviousYearDocCardProps {
  item: PreviousYearDocItem;
  onUploadSuccess: (
    id: string,
    fileInfo: { uri: string; name: string; size: string }
  ) => void;
  onRemove?: (id: string) => void;
}

export const PreviousYearDocCard: React.FC<PreviousYearDocCardProps> = ({
  item,
  onUploadSuccess,
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

        // 10 MB Limit Check (10 * 1024 * 1024 bytes)
        if (asset.size && asset.size > 10 * 1024 * 1024) {
          Alert.alert("File Too Large", "Maximum supported file size is 10 MB.");
          return;
        }

        const sizeInMb = asset.size
          ? `${(asset.size / (1024 * 1024)).toFixed(1)} MB`
          : "2.1 MB";

        onUploadSuccess(item.id, {
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
    <View style={styles.card}>
      {/* Icon */}
      <PreviousYearDocIcon type={item.iconType} />

      {/* Text Info */}
      <View style={styles.textGroup}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {isUploaded && item.fileName
            ? `${item.fileName} • ${item.fileSize || "2.1 MB"}`
            : item.subtitle}
        </Text>
      </View>

      {/* Action Button */}
      {isUploaded ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickDocument}
          style={styles.uploadedBadge}
        >
          <Ionicons name="checkmark" size={14} color="#EA580C" />
          <Text style={styles.uploadedText}>Uploaded</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickDocument}
          style={styles.uploadButton}
        >
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
