import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { FilingDocItem } from "@/modules/gst/gst-filing/config/gstFilingDocumentsConfig";
import { styles } from "@/modules/gst/gst-filing/components/GstFilingDocumentsStep/GstFilingDocumentsStep.styles";

interface GstDocumentPreviewModalProps {
  visible: boolean;
  previewDoc: FilingDocItem | null;
  onClose: () => void;
  onPromptUpload: (docId: string) => void;
}

export const GstDocumentPreviewModal: React.FC<GstDocumentPreviewModalProps> = ({
  visible,
  previewDoc,
  onClose,
  onPromptUpload,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalDocTitle} numberOfLines={1}>
                {previewDoc?.name}
              </Text>
              <Text style={styles.modalDocMeta}>
                {previewDoc?.fileName} • {previewDoc?.fileSize}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color="#1E293B" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalImageContainer}>
            {previewDoc?.fileUri ? (
              <Image
                source={{ uri: previewDoc.fileUri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.modalPlaceholder}>
                <Ionicons
                  name="document-text-outline"
                  size={60}
                  color="#94A3B8"
                />
                <Text style={styles.modalPlaceholderText}>
                  Preview not available
                </Text>
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalReplaceBtn}
              onPress={() => {
                const id = previewDoc?.id;
                onClose();
                if (id) onPromptUpload(id);
              }}
            >
              <Ionicons
                name="sync-outline"
                size={16}
                color={BrandColors.PRIMARY_BLUE}
              />
              <Text style={styles.modalReplaceText}>Re-upload</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalDoneBtn} onPress={onClose}>
              <Text style={styles.modalDoneText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
