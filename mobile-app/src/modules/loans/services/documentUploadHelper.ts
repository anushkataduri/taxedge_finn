import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const pickLoanImageFromGallery = async (): Promise<{
  uri: string;
  name: string;
  size: string;
} | null> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant photo library permissions to upload documents."
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.85,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const filename = asset.fileName || `document_${Date.now()}.jpg`;
      const sizeMb = asset.fileSize
        ? `${(asset.fileSize / (1024 * 1024)).toFixed(2)} MB`
        : "1.2 MB";
      return {
        uri: asset.uri,
        name: filename,
        size: sizeMb,
      };
    }
  } catch {
    Alert.alert("Gallery Error", "Unable to open gallery. Please try again.");
  }
  return null;
};

export const pickLoanImageFromCamera = async (): Promise<{
  uri: string;
  name: string;
  size: string;
} | null> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera permissions to take document photos."
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.85,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: `captured_doc_${Date.now()}.jpg`,
        size: "1.5 MB",
      };
    }
  } catch {
    Alert.alert("Camera Error", "Unable to access camera. Please try again.");
  }
  return null;
};
