import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { UploadedDocInfo } from "@/modules/gst/validation/complianceSchema";
import { styles } from "@/modules/gst/gst-compliance/components/FileUploadCard/FileUploadCard.styles";

interface FileUploadSourceModalProps {
  visible: boolean;
  isDark: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onPickDocument: () => void;
}

export const FileUploadSourceModal: React.FC<FileUploadSourceModalProps> = ({
  visible,
  isDark,
  onClose,
  onTakePhoto,
  onPickDocument,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalBackdrop}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={[styles.optionsSheet, isDark && styles.optionsSheetDark]}>
        <Text
          style={[
            styles.optionsSheetTitle,
            isDark && styles.optionsSheetTitleDark,
          ]}
        >
          Choose Upload Source
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.optionItem, isDark && styles.optionItemDark]}
          onPress={onTakePhoto}
        >
          <View style={styles.optionIconBox}>
            <Ionicons name="camera-outline" size={20} color="#2563EB" />
          </View>
          <Text
            style={[styles.optionItemText, isDark && styles.optionItemTextDark]}
          >
            Take Photo with Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.optionItem, isDark && styles.optionItemDark]}
          onPress={onPickDocument}
        >
          <View style={styles.optionIconBox}>
            <Ionicons name="folder-open-outline" size={20} color="#2563EB" />
          </View>
          <Text
            style={[styles.optionItemText, isDark && styles.optionItemTextDark]}
          >
            Choose from Files or Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.cancelOptionBtn,
            isDark && styles.cancelOptionBtnDark,
          ]}
          onPress={onClose}
        >
          <Text
            style={[
              styles.cancelOptionText,
              isDark && styles.cancelOptionTextDark,
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

interface FileUploadPreviewModalProps {
  visible: boolean;
  isDark: boolean;
  uploadedDoc: UploadedDocInfo | null;
  onClose: () => void;
}

export const FileUploadPreviewModal: React.FC<FileUploadPreviewModalProps> = ({
  visible,
  isDark,
  uploadedDoc,
  onClose,
}) => {
  const isImageFile = (name: string): boolean => {
    const lower = name.toLowerCase();
    return (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".webp")
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.previewModalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.previewCard, isDark && styles.previewCardDark]}>
          <View
            style={[styles.previewHeader, isDark && styles.previewHeaderDark]}
          >
            <Text
              style={[styles.previewTitle, isDark && styles.previewTitleDark]}
              numberOfLines={1}
            >
              {uploadedDoc?.name || "Document Preview"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={isDark ? "#94A3B8" : "#64748B"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.previewContent}>
            {uploadedDoc && isImageFile(uploadedDoc.name) ? (
              <Image
                source={{ uri: uploadedDoc.uri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.pdfFallbackBox}>
                <Ionicons
                  name="document-text"
                  size={56}
                  color={BrandColors.PRIMARY_BLUE_ACCENT}
                />
                <Text style={styles.pdfFallbackText}>{uploadedDoc?.name}</Text>
                <Text style={styles.pdfFallbackText}>
                  Document attached and ready for CA verification.
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
