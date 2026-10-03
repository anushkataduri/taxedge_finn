import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles, getIconBoxStyle } from "./GstUnifiedDocumentStep.styles";
import {
  DocumentItem,
  DocumentDisplayStatus,
  isPdfDocument,
  getDocumentStatus,
  STATUS_LABELS,
} from "./GstUnifiedDocumentStep.types";

interface CardProps {
  doc: DocumentItem;
  status: DocumentDisplayStatus;
  isUploading: boolean;
  needsAddressProof: boolean;
  onOpenAddressModal: () => void;
  onPreview: (id: string) => void;
  onReplace: (id: string) => void;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
}

export const GstDocumentCard: React.FC<CardProps> = ({
  doc,
  status,
  isUploading,
  needsAddressProof,
  onOpenAddressModal,
  onPreview,
  onReplace,
  onRemove,
  onRetry,
}) => {
  const hasFile = Boolean(doc.fileUri);
  const isBusy =
    status === "processing" || status === "uploading" || isUploading;

  const renderBadge = () => {
    const badgeStyle =
      status === "uploaded"
        ? styles.statusUploaded
        : status === "error"
          ? styles.statusError
          : status === "ready"
            ? styles.statusReady
            : status === "processing" || status === "uploading"
              ? styles.statusBusy
              : styles.statusPending;
    const textStyle =
      status === "uploaded"
        ? styles.statusUploadedText
        : status === "error"
          ? styles.statusErrorText
          : status === "ready"
            ? styles.statusReadyText
            : status === "processing" || status === "uploading"
              ? styles.statusBusyText
              : styles.statusPendingText;
    return (
      <View style={[styles.statusBadge, badgeStyle]}>
        {status === "processing" || status === "uploading" ? (
          <ActivityIndicator
            size="small"
            color="#0F3567"
            style={styles.statusSpinner}
          />
        ) : (
          <Ionicons
            name={
              status === "uploaded"
                ? "checkmark-circle"
                : status === "error"
                  ? "alert-circle"
                  : status === "ready"
                    ? "time-outline"
                    : "ellipse-outline"
            }
            size={12}
            color={
              status === "uploaded"
                ? "#059669"
                : status === "error"
                  ? "#DC2626"
                  : status === "ready"
                    ? "#C2410C"
                    : "#94A3B8"
            }
          />
        )}
        <Text style={[styles.statusBadgeText, textStyle]}>
          {STATUS_LABELS[status]}
        </Text>
      </View>
    );
  };

  const renderPreview = () => {
    const pdf = isPdfDocument(doc);
    const meta = [
      doc.fileSize,
      pdf ? "PDF" : "Image",
      doc.uploadedAt ? `Added ${doc.uploadedAt}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    return (
      <View style={styles.filePreviewRow}>
        {pdf ? (
          <View style={styles.fileThumbPdf}>
            <Ionicons name="document-text" size={24} color="#FF7A00" />
          </View>
        ) : (
          <Image
            key={doc.fileUri}
            source={{ uri: doc.fileUri }}
            style={styles.fileThumb}
            resizeMode="cover"
          />
        )}
        <View style={styles.fileMetaCol}>
          <Text style={styles.fileNameText} numberOfLines={1}>
            {doc.fileName || "Selected document"}
          </Text>
          <Text style={styles.fileMetaText} numberOfLines={1}>
            {meta}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.docCard,
        status === "uploaded" && styles.docCardUploaded,
        status === "error" && styles.docCardError,
      ]}
    >
      <View style={styles.cardTopRow}>
        <View style={[styles.iconBox, getIconBoxStyle(doc.iconBg)]}>
          <Ionicons
            name={doc.iconName as any}
            size={20}
            color={doc.iconColor}
          />
        </View>
        <View style={styles.docInfoCol}>
          <View style={styles.titleRow}>
            <Text style={styles.docName}>{doc.name}</Text>
            {doc.required && <Text style={styles.requiredAsterisk}> *</Text>}
          </View>
          {doc.id === "address-proof" && !hasFile ? (
            <TouchableOpacity
              onPress={onOpenAddressModal}
              style={styles.addressProofPickerBtn}
            >
              <Text style={[styles.docSubtitle, styles.docSubtitleLink]}>
                {needsAddressProof ? "Select Address Proof" : doc.subtitle}
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color={BrandColors.PRIMARY_BLUE}
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          ) : (
            <Text style={styles.docSubtitle} numberOfLines={1}>
              {doc.subtitle}
            </Text>
          )}
        </View>
        {renderBadge()}
      </View>

      {status === "processing" ? (
        <View style={styles.processingRow}>
          <ActivityIndicator size="small" color="#FF7A00" />
          <Text style={styles.processingText}>Preparing document…</Text>
        </View>
      ) : hasFile ? (
        renderPreview()
      ) : null}

      {status === "error" && doc.uploadError && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={16} color="#DC2626" />
          <Text style={styles.errorBoxText}>{doc.uploadError}</Text>
          {doc.canRetry && onRetry && (
            <TouchableOpacity
              style={[styles.retryBtn, isUploading && styles.actionDisabled]}
              disabled={isUploading}
              onPress={() => onRetry(doc.id)}
            >
              <Ionicons name="refresh" size={13} color="#FFFFFF" />
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {hasFile && status !== "processing" ? (
        <View style={styles.uploadedActionRow}>
          <TouchableOpacity
            style={styles.viewBtn}
            activeOpacity={0.7}
            onPress={() => onPreview(doc.id)}
          >
            <Ionicons
              name="eye-outline"
              size={16}
              color={BrandColors.PRIMARY_BLUE}
            />
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
          <View style={styles.actionBtnDivider} />
          <TouchableOpacity
            style={[styles.replaceBtn, isBusy && styles.actionDisabled]}
            disabled={isBusy}
            onPress={() => onReplace(doc.id)}
          >
            <Ionicons name="sync-outline" size={15} color="#64748B" />
            <Text style={styles.replaceBtnText}>Replace</Text>
          </TouchableOpacity>
          <View style={styles.actionBtnDivider} />
          <TouchableOpacity
            style={[styles.deleteBtn, isBusy && styles.actionDisabled]}
            disabled={isBusy}
            onPress={() => onRemove(doc.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ) : !hasFile && status !== "processing" ? (
        <View style={styles.uploadButtonsRow}>
          <TouchableOpacity
            style={[
              styles.uploadBtn,
              styles.uploadBtnPrimary,
              isUploading && styles.actionDisabled,
            ]}
            disabled={isUploading}
            onPress={() => onReplace(doc.id)}
          >
            <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
            <Text style={styles.uploadBtnPrimaryText}>Upload</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
