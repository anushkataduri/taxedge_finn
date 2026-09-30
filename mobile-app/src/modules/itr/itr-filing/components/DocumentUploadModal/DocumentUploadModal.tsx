import React from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { DocumentUploadBottomSheet } from "@/modules/itr/tds/components/upload/DocumentUploadBottomSheet/DocumentUploadBottomSheet";

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
  const formatSize = (sizeInBytes: number): string =>
    `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;

  const getFileSize = async (uri: string, providedSize?: number): Promise<number> => {
    if (providedSize && providedSize > 0) return providedSize;
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && (fileInfo as any).size) {
        return (fileInfo as any).size as number;
      }
    } catch {
      // Unable to determine size; treat as safe
    }
    return 0;
  };

  // Used only for file/document picker — enforces the 2 MB limit.
  const checkDocumentSizeAndProceed = async (
    uri: string,
    name: string,
    providedSize?: number,
    mimeType?: string
  ): Promise<boolean> => {
    const sizeInBytes = await getFileSize(uri, providedSize);

    if (sizeInBytes > 0 && sizeInBytes > MAX_FILE_SIZE_BYTES) {
      Alert.alert(
        "File Too Large",
        "The selected file exceeds 2 MB. Please select a smaller file (under 2 MB) to proceed."
      );
      return false;
    }

    onFilePicked({
      uri,
      name,
      size: sizeInBytes > 0 ? formatSize(sizeInBytes) : "",
      mimeType,
    });
    onClose();
    return true;
  };

  // Used for camera/gallery — no size restriction since images are captured by the user.
  const proceedWithImage = async (
    uri: string,
    name: string,
    providedSize?: number,
    mimeType?: string
  ): Promise<void> => {
    const sizeInBytes = await getFileSize(uri, providedSize);
    onFilePicked({
      uri,
      name,
      size: sizeInBytes > 0 ? formatSize(sizeInBytes) : "",
      mimeType,
    });
    onClose();
  };

  // Option 1: Pick from Files / Drive (PDF/image — enforce 2 MB)
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        await checkDocumentSizeAndProceed(
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

  // Option 2: Pick from Photo Gallery (no size restriction)
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
        quality: 0.7,
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `document_${Date.now()}.jpg`;
        await proceedWithImage(
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

  // Option 3: Take Photo with Camera (no size restriction)
  const handlePickCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera permission is needed to photograph documents.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `camera_doc_${Date.now()}.jpg`;
        await proceedWithImage(
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
    <DocumentUploadBottomSheet
      visible={visible}
      documentTitle={docTitle}
      maxSizeBytesText="2 MB"
      onClose={onClose}
      onPickFiles={handlePickDocument}
      onPickGallery={handlePickGallery}
      onTakePhoto={handlePickCamera}
    />
  );
};
