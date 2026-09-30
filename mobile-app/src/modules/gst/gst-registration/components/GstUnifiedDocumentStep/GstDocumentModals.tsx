import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { modalStyles as styles } from "./GstDocumentModals.styles";
import {
  DocumentDisplayStatus,
  DocumentItem,
  isPdfDocument,
  getDocumentStatus,
  STATUS_LABELS,
} from "./GstUnifiedDocumentStep.types";

interface PreviewModalProps {
  previewDoc: DocumentItem | null;
  onClose: () => void;
  onReplace: (id: string) => void;
  isUploading: boolean;
}

export const DocumentPreviewModal: React.FC<PreviewModalProps> = ({
  previewDoc,
  onClose,
  onReplace,
  isUploading,
}) => {
  return !previewDoc ? null : (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalDocTitle} numberOfLines={1}>
                {previewDoc.name}
              </Text>
              <Text style={styles.modalDocMeta}>
                {previewDoc.fileName || "Selected document"} ·{" "}
                {STATUS_LABELS[getDocumentStatus(previewDoc)]}
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
            {previewDoc.fileUri && !isPdfDocument(previewDoc) ? (
              <Image
                source={{ uri: previewDoc.fileUri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            ) : previewDoc.fileUri ? (
              <View style={styles.modalPdfPlaceholder}>
                <Ionicons name="document-text" size={60} color="#FF7A00" />
                <Text style={styles.modalPlaceholderText}>
                  PDF document selected
                </Text>
              </View>
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
              style={[
                styles.modalReplaceBtn,
                isUploading && styles.actionDisabled,
              ]}
              disabled={isUploading}
              onPress={() => {
                onClose();
                onReplace(previewDoc.id);
              }}
            >
              <Ionicons
                name="sync-outline"
                size={16}
                color={BrandColors.PRIMARY_BLUE}
              />
              <Text style={styles.modalReplaceText}>Replace</Text>
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

interface AddressProofModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (proof: string) => void;
  currentValue?: string;
}

const ADDRESS_PROOF_TYPES = [
  "Rental Agreement",
  "Ownership Proof",
  "Electricity Bill",
  "Other Address Proof",
];

export const AddressProofSelectModal: React.FC<AddressProofModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentValue,
}) => {
  return !visible ? null : (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.selectModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.selectModalContent}>
          <Text style={styles.selectModalTitle}>Select Address Proof</Text>
          {ADDRESS_PROOF_TYPES.map((proof) => (
            <TouchableOpacity
              key={proof}
              style={styles.selectModalOption}
              onPress={() => {
                onSelect(proof);
                onClose();
              }}
            >
              <Text style={styles.selectModalOptionText}>{proof}</Text>
              {currentValue === proof && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={BrandColors.PRIMARY_BLUE}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
