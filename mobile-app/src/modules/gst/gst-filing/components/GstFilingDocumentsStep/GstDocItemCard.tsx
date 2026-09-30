import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { FilingDocItem } from "../../config/gstFilingDocumentsConfig";
import { styles, getIconBoxStyle } from "./style";

interface GstDocItemCardProps {
  doc: FilingDocItem;
  filingNature?: "Regular Return" | "Nil Return";
  onPreview: (doc: FilingDocItem) => void;
  onPromptUpload: (docId: string) => void;
  onUploadOption: (docId: string, source: "gallery" | "camera") => void;
  onRemoveDoc: (docId: string) => void;
}

export const GstDocItemCard: React.FC<GstDocItemCardProps> = ({
  doc,
  filingNature,
  onPreview,
  onPromptUpload,
  onUploadOption,
  onRemoveDoc,
}) => {
  const isUploaded = Boolean(doc.fileUri);

  const getStatusBadgeStyle = () => {
    if (isUploaded) return styles.statusUploaded;
    if (doc.badgeType === "Recommended") return styles.statusRecommended;
    if (doc.badgeType === "Conditional") return styles.statusConditional;
    if (doc.required && filingNature !== "Nil Return") return styles.statusRequired;
    return styles.statusOptional;
  };

  const getStatusBadgeTextStyle = () => {
    if (isUploaded) return styles.statusUploadedText;
    if (doc.badgeType === "Recommended") return styles.statusRecommendedText;
    if (doc.badgeType === "Conditional") return styles.statusConditionalText;
    if (doc.required && filingNature !== "Nil Return") return styles.statusRequiredText;
    return styles.statusOptionalText;
  };

  const getBadgeIconColor = () => {
    if (isUploaded) return "#059669";
    if (doc.badgeType === "Recommended") return "#D97706";
    if (doc.badgeType === "Conditional") return "#2563EB";
    if (doc.required && filingNature !== "Nil Return") return "#DC2626";
    return "#64748B";
  };

  const getBadgeLabel = () => {
    if (isUploaded) return "Uploaded";
    if (filingNature === "Nil Return") return "Optional";
    if (doc.badgeType === "Conditional") return "If applicable";
    return doc.badgeType || (doc.required ? "Required" : "Optional");
  };

  return (
    <View style={[styles.docCard, isUploaded && styles.docCardUploaded]}>
      <View style={styles.cardTopRow}>
        {/* Icon */}
        <View style={[styles.iconBox, getIconBoxStyle(doc.iconBg)]}>
          <Ionicons
            name={doc.iconName as any}
            size={20}
            color={doc.iconColor}
          />
        </View>

        {/* Text Info */}
        <View style={styles.docInfoCol}>
          <View style={styles.titleRow}>
            <Text style={styles.docName}>{doc.name}</Text>
            {doc.required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
          </View>
          <Text style={styles.docSubtitle} numberOfLines={1}>
            {isUploaded
              ? `${doc.fileName} (${doc.fileSize})`
              : doc.subtitle}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, getStatusBadgeStyle()]}>
          <Ionicons
            name={isUploaded ? "checkmark-circle" : "ellipse-outline"}
            size={12}
            color={getBadgeIconColor()}
          />
          <Text style={[styles.statusBadgeText, getStatusBadgeTextStyle()]}>
            {getBadgeLabel()}
          </Text>
        </View>
      </View>

      {/* Action Bar */}
      {isUploaded ? (
        <View style={styles.uploadedActionRow}>
          <TouchableOpacity
            style={styles.viewBtn}
            activeOpacity={0.7}
            onPress={() => onPreview(doc)}
          >
            <Ionicons
              name="eye-outline"
              size={16}
              color={BrandColors.PRIMARY_BLUE}
            />
            <Text style={styles.viewBtnText}>View Document</Text>
          </TouchableOpacity>

          <View style={styles.actionBtnDivider} />

          <TouchableOpacity
            style={styles.replaceBtn}
            activeOpacity={0.7}
            onPress={() => onPromptUpload(doc.id)}
          >
            <Ionicons name="sync-outline" size={15} color="#64748B" />
            <Text style={styles.replaceBtnText}>Replace</Text>
          </TouchableOpacity>

          <View style={styles.actionBtnDivider} />

          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.7}
            onPress={() => onRemoveDoc(doc.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.uploadButtonsRow}>
          <TouchableOpacity
            style={styles.uploadBtn}
            activeOpacity={0.8}
            onPress={() => onUploadOption(doc.id, "camera")}
          >
            <Ionicons
              name="camera-outline"
              size={16}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.uploadBtnText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadBtn, styles.uploadBtnPrimary]}
            activeOpacity={0.8}
            onPress={() => onUploadOption(doc.id, "gallery")}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.uploadBtnPrimaryText}>Upload File</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
