import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Sharing from "expo-sharing";
import type { LoanDocumentItem } from "../../types/loans.types";
import { styles, previewModalColors, closeButtonHitSlop } from "./DocumentPreviewModal.styles";

export interface DocumentPreviewModalProps {
  visible: boolean;
  document: LoanDocumentItem | null;
  onClose: () => void;
}

/** Placeholder URIs used by demo data; they cannot be rendered or shared. */
const MOCK_URI_PREFIX = "file:///mock";

const isImageFile = (fileUri: string, fileName: string): boolean => {
  const lowerName = fileName.toLowerCase();
  return (
    fileUri.endsWith(".jpg") ||
    fileUri.endsWith(".jpeg") ||
    fileUri.endsWith(".png") ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".png")
  );
};

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  visible,
  document,
  onClose,
}) => {
  if (!document) return null;

  const fileName = document.fileName || document.name;
  const fileUri = document.fileUri || "";
  const isMockFile = !fileUri || fileUri.startsWith(MOCK_URI_PREFIX);
  const showImage = isImageFile(fileUri, fileName) && !isMockFile;

  const handleOpenExternal = async () => {
    try {
      if (isMockFile) {
        Alert.alert(
          "Document Preview",
          `Previewing verified file:\n${fileName}\nSize: ${document.fileSize || "1.5 MB"}`
        );
        return;
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        return;
      }
      Alert.alert("Viewer", `Opening ${fileName}`);
    } catch {
      Alert.alert("Viewer", `Unable to open external viewer for ${fileName}`);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="document-text-outline" size={20} color={previewModalColors.documentIcon} />
              <Text style={styles.title} numberOfLines={1}>
                {document.name}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={closeButtonHitSlop}>
              <Ionicons name="close" size={22} color={previewModalColors.closeIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {showImage ? (
              <Image source={{ uri: fileUri }} style={styles.imagePreview} resizeMode="contain" />
            ) : (
              <View style={styles.docCard}>
                <View style={styles.iconCircle}>
                  <Ionicons name="document-text" size={32} color={previewModalColors.documentIcon} />
                </View>

                <Text style={styles.fileName} numberOfLines={2}>
                  {fileName}
                </Text>
                <Text style={styles.fileMeta}>
                  {document.fileSize || "1.8 MB"} • {document.category}
                </Text>

                <View style={styles.statusBadge}>
                  <Ionicons name="shield-checkmark" size={14} color={previewModalColors.verifiedIcon} />
                  <Text style={styles.statusText}>Uploaded & Verified</Text>
                </View>

                <TouchableOpacity style={styles.shareBtn} onPress={handleOpenExternal} activeOpacity={0.8}>
                  <Ionicons name="open-outline" size={16} color={previewModalColors.shareIcon} />
                  <Text style={styles.shareBtnText}>Open / Share File</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeActionBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.closeActionText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DocumentPreviewModal;
