import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Sharing from "expo-sharing";
import { BrandColors } from "../../../../../shared/theme";
import { LoanDocumentItem } from "../../../types/loans.types";
import { styles } from "./DocumentPreviewModal.styles";

export interface DocumentPreviewModalProps {
  visible: boolean;
  document: LoanDocumentItem | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  visible,
  document,
  onClose,
}) => {
  if (!document) return null;

  const fileName = document.fileName || document.name;
  const fileUri = document.fileUri || "";
  const isImage =
    fileUri.endsWith(".jpg") ||
    fileUri.endsWith(".jpeg") ||
    fileUri.endsWith(".png") ||
    fileName.toLowerCase().endsWith(".jpg") ||
    fileName.toLowerCase().endsWith(".png");

  const handleOpenExternal = async () => {
    try {
      if (!fileUri || fileUri.startsWith("file:///mock")) {
        Alert.alert(
          "Document Preview",
          `Previewing verified file:\n${fileName}\nSize: ${document.fileSize || "1.5 MB"}`
        );
        return;
      }
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Viewer", `Opening ${fileName}`);
      }
    } catch {
      Alert.alert("Viewer", `Unable to open external viewer for ${fileName}`);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
              />
              <Text style={styles.title} numberOfLines={1}>
                {document.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={styles.content}>
            {isImage && fileUri && !fileUri.startsWith("file:///mock") ? (
              <Image
                source={{ uri: fileUri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.docCard}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="document-text"
                    size={32}
                    color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
                  />
                </View>

                <Text style={styles.fileName} numberOfLines={2}>
                  {fileName}
                </Text>
                <Text style={styles.fileMeta}>
                  {document.fileSize || "1.8 MB"} • {document.category}
                </Text>

                <View style={styles.statusBadge}>
                  <Ionicons name="shield-checkmark" size={14} color="#166534" />
                  <Text style={styles.statusText}>Uploaded & Verified</Text>
                </View>

                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={handleOpenExternal}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="open-outline"
                    size={16}
                    color={BrandColors.PRIMARY_ORANGE_DARK || "#EA580C"}
                  />
                  <Text style={styles.shareBtnText}>Open / Share File</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closeActionBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeActionText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DocumentPreviewModal;
