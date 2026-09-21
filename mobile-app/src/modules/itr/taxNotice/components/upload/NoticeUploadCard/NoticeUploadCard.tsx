import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DocumentUploadPayload } from "../../../types/taxNotice.types";
import { NoticeUploadSourceModal } from "../../common/NoticeUploadSourceModal";
import { styles } from "./NoticeUploadCard.styles";

interface NoticeUploadCardProps {
  fileName?: string;
  fileSize?: string;
  onUploadSuccess: (fileInfo: { uri: string; name: string; size: string }) => void;
  onRemove?: () => void;
  error?: string;
}

export const NoticeUploadCard: React.FC<NoticeUploadCardProps> = ({
  fileName,
  fileSize,
  onUploadSuccess,
  onRemove,
  error,
}) => {
  const [showModal, setShowModal] = useState(false);
  const isUploaded = !!fileName;

  const handleFileSelected = (payload: DocumentUploadPayload) => {
    onUploadSuccess({
      uri: payload.uri,
      name: payload.name,
      size: payload.size,
    });
  };

  return (
    <>
      <View style={[styles.card, error ? styles.cardError : null]}>
        <View style={styles.iconCircle}>
          <Ionicons name="document-text-outline" size={24} color="#0B1F3A" />
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.title}>Notice Document</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {isUploaded
              ? `${fileName} • ${fileSize || "PDF"}`
              : "PDF, JPG or PNG • Up to 10 MB"}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowModal(true)}
          style={[
            styles.actionButton,
            isUploaded ? styles.uploadedButton : styles.uploadButton,
          ]}
        >
          {isUploaded ? (
            <View style={styles.uploadedContent}>
              <Ionicons name="checkmark" size={14} color="#EA580C" />
              <Text style={styles.uploadedText}>Uploaded</Text>
            </View>
          ) : (
            <Text style={styles.uploadText}>Upload</Text>
          )}
        </TouchableOpacity>
      </View>

      <NoticeUploadSourceModal
        visible={showModal}
        documentTitle="Income Tax Notice"
        onClose={() => setShowModal(false)}
        onFileSelected={handleFileSelected}
      />
    </>
  );
};

