import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  TaxNoticeSupportingDoc,
  DocumentUploadPayload,
} from "../../../types/taxNotice.types";
import { NoticeUploadSourceModal } from "../../common/NoticeUploadSourceModal";
import { styles } from "./NoticeDocUploadCard.styles";

interface NoticeDocUploadCardProps {
  item: TaxNoticeSupportingDoc;
  iconName: keyof typeof Ionicons.glyphMap;
  onUploadSuccess: (
    id: string,
    fileInfo: { uri: string; name: string; size: string }
  ) => void;
  onRemove?: (id: string) => void;
}

export const NoticeDocUploadCard: React.FC<NoticeDocUploadCardProps> = ({
  item,
  iconName,
  onUploadSuccess,
  onRemove,
}) => {
  const [showModal, setShowModal] = useState(false);
  const isUploaded = item.status === "uploaded" || !!item.fileUri;

  const handleFileSelected = (payload: DocumentUploadPayload) => {
    onUploadSuccess(item.id, {
      uri: payload.uri,
      name: payload.name,
      size: payload.size,
    });
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name={iconName} size={22} color="#0B1F3A" />
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.title}>
            {item.title}
            {item.isMandatory ? " *" : " (Optional)"}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {isUploaded && item.fileName
              ? `${item.fileName} • ${item.fileSize || "1.5 MB"}`
              : item.subtitle}
          </Text>
        </View>

        {isUploaded ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowModal(true)}
            style={styles.uploadedBadge}
          >
            <Ionicons name="checkmark" size={14} color="#EA580C" />
            <Text style={styles.uploadedText}>Uploaded</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowModal(true)}
            style={styles.uploadButton}
          >
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        )}
      </View>

      <NoticeUploadSourceModal
        visible={showModal}
        documentTitle={item.title}
        onClose={() => setShowModal(false)}
        onFileSelected={handleFileSelected}
      />
    </>
  );
};

