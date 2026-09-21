import { useState, useCallback } from "react";
import { ScrollView, Alert, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export interface DocumentUploadResult {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface UseDocumentUploadHelperOptions {
  maxSizeMB?: number;
  allowedMimeTypes?: string[];
  scrollRef?: React.RefObject<ScrollView | null>;
  onSuccess?: (result: DocumentUploadResult, docKey?: string) => void;
  onError?: (error: string) => void;
}

export function useDocumentUploadHelper({
  maxSizeMB = 10,
  allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"],
  scrollRef,
  onSuccess,
  onError,
}: UseDocumentUploadHelperOptions = {}) {
  const [activeDocKey, setActiveDocKey] = useState<string | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [currentDocTitle, setCurrentDocTitle] = useState<string>("");

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const scrollToTarget = useCallback((targetY?: number) => {
    if (scrollRef?.current && typeof targetY === "number") {
      scrollRef.current.scrollTo({ y: Math.max(0, targetY - 40), animated: true });
    }
  }, [scrollRef]);

  const openUploadSheet = useCallback((docKey: string, title?: string, targetY?: number) => {
    setActiveDocKey(docKey);
    setCurrentDocTitle(title || docKey);
    setIsSheetVisible(true);
    if (typeof targetY === "number") {
      scrollToTarget(targetY);
    }
  }, [scrollToTarget]);

  const closeUploadSheet = useCallback(() => {
    setIsSheetVisible(false);
    setActiveDocKey(null);
  }, []);

  const validateAndProcessFile = useCallback((file: { uri: string; name: string; size?: number; mimeType?: string }) => {
    if (file.size && file.size > maxSizeBytes) {
      const msg = `File size exceeds maximum limit of ${maxSizeMB}MB.`;
      if (onError) onError(msg);
      else Alert.alert("File Too Large", msg);
      return false;
    }

    if (onSuccess) {
      onSuccess(file, activeDocKey || undefined);
    }
    closeUploadSheet();
    return true;
  }, [maxSizeBytes, maxSizeMB, onError, onSuccess, activeDocKey, closeUploadSheet]);

  const pickFiles = useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        validateAndProcessFile({
          uri: asset.uri,
          name: asset.name,
          size: asset.size,
          mimeType: asset.mimeType,
        });
      }
    } catch (e: any) {
      if (onError) onError(e?.message || "Failed to pick file");
    }
  }, [validateAndProcessFile, onError]);

  const pickGallery = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission Required", "Please allow gallery access to select document photos.");
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        validateAndProcessFile({
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
          mimeType: asset.mimeType || "image/jpeg",
        });
      }
    } catch (e: any) {
      if (onError) onError(e?.message || "Failed to select photo");
    }
  }, [validateAndProcessFile, onError]);

  const takePhoto = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission Required", "Please allow camera access to take document photos.");
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        validateAndProcessFile({
          uri: asset.uri,
          name: asset.fileName || `camera_${Date.now()}.jpg`,
          size: asset.fileSize,
          mimeType: asset.mimeType || "image/jpeg",
        });
      }
    } catch (e: any) {
      if (onError) onError(e?.message || "Failed to take photo");
    }
  }, [validateAndProcessFile, onError]);

  return {
    isSheetVisible,
    activeDocKey,
    currentDocTitle,
    openUploadSheet,
    closeUploadSheet,
    pickFiles,
    pickGallery,
    takePhoto,
    scrollToTarget,
  };
}

export default useDocumentUploadHelper;
