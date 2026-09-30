import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TaxNoticeSupportingDoc } from "../../../types/taxNotice.types";
import { NoticeUploadSourceModal } from "../../common/NoticeUploadSourceModal";
import { styles } from "./NoticeDocUploadCard.styles";

interface NoticeDocUploadCardProps {
  item: TaxNoticeSupportingDoc;
  iconName: keyof typeof Ionicons.glyphMap;
  onUploadSuccess: (id: string, fileInfo: { uri: string; name: string; size: string; mimeType?: string }) => void;
  onRemove?: (id: string) => void;
  hasError?: boolean;
}

export const NoticeDocUploadCard: React.FC<NoticeDocUploadCardProps> = ({ item, iconName, onUploadSuccess, onRemove, hasError }) => {
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleUploadClick = () => {
    setShowSourceModal(true);
  };

  const handleDocumentPicked = (fileInfo: { uri: string; name: string; size: string; mimeType?: string }) => {
    onUploadSuccess(item.id, fileInfo);
    setShowSourceModal(false);
  };

  const isUploaded = item.status === "uploaded" && item.fileUri;
  const isImage = item.fileName?.toLowerCase().match(/\.(jpg|jpeg|png)$/i);

  return (
    <>
      <View style={[styles.cardContainer, hasError ? styles.cardError : null]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={20} color="#EA580C" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.cardTitle}>
              {item.title} {item.isMandatory && <Text style={styles.mandatoryStar}>*</Text>}
            </Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
        </View>

        {isUploaded ? (
          <View style={styles.uploadedContainer}>
            <View style={styles.fileInfo}>
              <Ionicons name={isImage ? "image-outline" : "document-text-outline"} size={20} color="#10B981" />
              <View style={styles.fileTextContainer}>
                <Text style={styles.fileName} numberOfLines={1}>{item.fileName}</Text>
                <Text style={styles.fileSize}>{item.fileSize}</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => setShowPreview(true)} style={styles.actionButton}>
                <Ionicons name="eye-outline" size={20} color="#0B1F3A" />
              </TouchableOpacity>
              {onRemove && (
                <TouchableOpacity onPress={() => onRemove(item.id)} style={[styles.actionButton, styles.deleteButton]}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.8} style={styles.uploadButton} onPress={handleUploadClick}>
            <Ionicons name="cloud-upload-outline" size={22} color="#0B1F3A" />
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </TouchableOpacity>
        )}
      </View>

      <NoticeUploadSourceModal
        visible={showSourceModal}
        documentTitle={item.title}
        onClose={() => setShowSourceModal(false)}
        onFileSelected={(payload) => handleDocumentPicked({ uri: payload.uri, name: payload.name, size: payload.size, mimeType: payload.mimeType })}
      />

      <Modal visible={showPreview} transparent={false} animationType="slide">
        <SafeAreaView style={styles.previewModal}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle} numberOfLines={1}>{item.fileName}</Text>
            <TouchableOpacity onPress={() => setShowPreview(false)} style={styles.closePreviewButton}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.previewContent}>
            {isImage ? (
              <Image source={{ uri: item.fileUri }} style={styles.previewImage} resizeMode="contain" />
            ) : (
              <View style={styles.noPreview}>
                <Ionicons name="document-text" size={64} color="#94A3B8" />
                <Text style={styles.noPreviewText}>Preview not available for this file type.</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};
