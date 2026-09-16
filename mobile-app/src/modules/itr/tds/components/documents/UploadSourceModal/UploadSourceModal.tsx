import React from "react";
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./UploadSourceModal.styles";

interface UploadSourceModalProps {
  visible: boolean;
  documentTitle: string;
  maxSizeText?: string;
  onChooseFiles: () => void;
  onSelectGallery: () => void;
  onTakePhoto: () => void;
  onClose: () => void;
}

export const UploadSourceModal: React.FC<UploadSourceModalProps> = ({
  visible,
  documentTitle,
  maxSizeText = "Maximum file size: 2 MB",
  onChooseFiles,
  onSelectGallery,
  onTakePhoto,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header Title & Subtitle */}
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>
                  {`Upload ${documentTitle}`}
                </Text>
                <Text style={styles.subtitle}>
                  {`Select file source • ${maxSizeText}`}
                </Text>
              </View>

              {/* 3 Source Options */}
              <View style={styles.optionsContainer}>
                {/* 1. Choose from Files / Drive */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={onChooseFiles}
                  style={styles.optionCard}
                >
                  <View style={[styles.iconBox, styles.filesIconBox]}>
                    <Ionicons name="folder-outline" size={22} color="#0284C7" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Choose from Files / Drive</Text>
                    <Text style={styles.optionSubtitle}>PDF, JPG or PNG (up to 2 MB)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>

                {/* 2. Select from Gallery */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={onSelectGallery}
                  style={styles.optionCard}
                >
                  <View style={[styles.iconBox, styles.galleryIconBox]}>
                    <Ionicons name="images-outline" size={22} color="#9333EA" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Select from Gallery</Text>
                    <Text style={styles.optionSubtitle}>Upload existing photo from gallery</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>

                {/* 3. Take Photo with Camera */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={onTakePhoto}
                  style={styles.optionCard}
                >
                  <View style={[styles.iconBox, styles.cameraIconBox]}>
                    <Ionicons name="camera-outline" size={22} color="#059669" />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Take Photo with Camera</Text>
                    <Text style={styles.optionSubtitle}>Directly capture document clearly</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={styles.cancelButton}
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

export default UploadSourceModal;
