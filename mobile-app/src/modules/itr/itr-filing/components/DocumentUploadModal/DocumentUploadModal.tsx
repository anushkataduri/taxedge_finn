import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { styles } from "./DocumentUploadModal.styles";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export interface UploadedFileInfo {
  uri: string;
  name: string;
  size: string;
  mimeType?: string;
}

interface DocumentUploadModalProps {
  visible: boolean;
  docTitle?: string;
  onClose: () => void;
  onFilePicked: (file: UploadedFileInfo) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  docTitle = "Document",
  onClose,
  onFilePicked,
}) => {
  const checkSizeAndProceed = async (
    uri: string,
    name: string,
    providedSize?: number,
    mimeType?: string
  ): Promise<boolean> => {
    let sizeInBytes = providedSize;

    if (!sizeInBytes) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists && (fileInfo as any).size) {
          sizeInBytes = (fileInfo as any).size;
        }
      } catch {
        // Fallback if FileSystem check is unavailable
        sizeInBytes = 500 * 1024;
      }
    }

    if (sizeInBytes && sizeInBytes > MAX_FILE_SIZE_BYTES) {
      Alert.alert(
        "File Too Large",
        "The selected file exceeds 2 MB. Please select a smaller file (under 2 MB) to proceed."
      );
      return false;
    }

    const formattedSize = sizeInBytes
      ? `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
      : "1.2 MB";

    onFilePicked({
      uri,
      name,
      size: formattedSize,
      mimeType,
    });
    onClose();
    return true;
  };

  // Option 1: Pick from Files / Drive
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        await checkSizeAndProceed(
          asset.uri,
          asset.name || "document.pdf",
          asset.size,
          asset.mimeType
        );
      }
    } catch {
      Alert.alert("File Selection Error", "Could not select the document. Please try again.");
    }
  };

  // Option 2: Pick from Photo Gallery
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
        const fileName = asset.fileName || `document_${Date.now()}.jpg`;
        await checkSizeAndProceed(
          asset.uri,
          fileName,
          (asset as any).fileSize,
          asset.mimeType || "image/jpeg"
        );
      }
    } catch {
      Alert.alert("Gallery Error", "Could not open photo gallery. Please try again.");
    }
  };

  // Option 3: Take Photo with Camera
  const handlePickCamera = async () => {
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
        const fileName = asset.fileName || `camera_doc_${Date.now()}.jpg`;
        await checkSizeAndProceed(
          asset.uri,
          fileName,
          (asset as any).fileSize,
          asset.mimeType || "image/jpeg"
        );
      }
    } catch {
      Alert.alert("Camera Error", "Could not open camera. Please try again.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.dragHandle} />

              <Text style={styles.sheetTitle}>Upload {docTitle}</Text>
              <Text style={styles.sheetSubtitle}>
                Select file source • Maximum file size: 2 MB
              </Text>

              <View style={styles.optionsList}>
                {/* 1. Drive / Files */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.optionRow}
                  onPress={handlePickDocument}
                >
                  <View style={[styles.iconBox, styles.iconBoxFiles]}>
                    <Ionicons name="folder-open-outline" size={22} color="#0284C7" />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>Choose from Files / Drive</Text>
                    <Text style={styles.optionDesc}>PDF, JPG or PNG (up to 2 MB)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>

                {/* 2. Photo Gallery */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.optionRow}
                  onPress={handlePickGallery}
                >
                  <View style={[styles.iconBox, styles.iconBoxGallery]}>
                    <Ionicons name="images-outline" size={22} color="#7E22CE" />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>Select from Gallery</Text>
                    <Text style={styles.optionDesc}>Upload existing photo from gallery</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>

                {/* 3. Camera */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.optionRow}
                  onPress={handlePickCamera}
                >
                  <View style={[styles.iconBox, styles.iconBoxCamera]}>
                    <Ionicons name="camera-outline" size={22} color="#16A34A" />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>Take Photo with Camera</Text>
                    <Text style={styles.optionDesc}>Directly capture document clearly</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
