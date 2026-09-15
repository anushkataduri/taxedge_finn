import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  GstServiceBanner,
  GstSelectModal,
  GstSuccessAnimationScreen,
} from "@/modules/gst/components/common";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { styles } from "./GstCertificateScreen.styles";
import { useAuthStore } from "@/store/authStore";
import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";

const CERTIFICATE_REQUEST_TYPES = [
  "Download Existing Certificate (Form REG-06)",
  "Request Reprint / Duplicate Copy",
  "Certificate Verification & Status Check",
];

export default function GstCertificateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const customer = useAuthStore((state) => state.customer);
  const registeredMobile = customer?.mobile
    ? `+91 ${customer.mobile}`
    : "+91 Verified Registered Mobile";
  const registeredEmail = customer?.email || "Verified Registered Email";

  const [gstin, setGstin] = useState("");
  const [requestType, setRequestType] = useState<string>(
    "Download Existing Certificate (Form REG-06)",
  );
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [error, setError] = useState("");
  const [gstinError, setGstinError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Universal Draft Guard
  const {
    showDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () => Boolean(gstin),
    onSaveDraft: () => {},
    onDiscardDraft: () => {},
    isSubmitted: () => isCompleted,
  });

  const handleGstinChange = (text: string) => {
    const cleaned = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setGstin(cleaned);
    setGstinError("");
  };

  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (requestType.includes("Reprint")) return "Request Reprint";
    return "Download Certificate (REG-06)";
  };

  const handleAction = () => {
    if (!GstValidators.isValidGstin(gstin)) {
      setGstinError("Enter a valid 15-character GSTIN (e.g. 29AAAAA0000A1Z5)");
      Alert.alert(
        "Invalid GSTIN",
        "Please enter a valid 15-character GSTIN to download certificate.",
      );
      return;
    }
    if (!requestType) {
      setError("Please select a request type.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      markSubmitted();
      setIsCompleted(true);

      const appId = useApplicationStore.getState().createApplication(
        "gst-certificate",
        `GST Certificate (${requestType.split(" ")[0]})`,
        "GST",
        {
          gstin,
          requestType,
        },
        ["GST Certificate REG-06"],
        0,
        "Paid",
        true,
      );

      useNotificationStore
        .getState()
        .addNotification(
          "Certificate Ready",
          `Your GST Certificate request for ${gstin} is ready.`,
          "gst",
        );
    }, 800);
  };

  if (isCompleted) {
    if (requestType.includes("Reprint")) {
      return (
        <GstSuccessAnimationScreen
          iconType="reprint"
          title="Reprint Requested!"
          subtitle={`Your certificate reprint request for ${gstin} has been submitted successfully.\n\nWe will deliver the certificate to your email.`}
        />
      );
    }
    return (
      <GstSuccessAnimationScreen
        iconType="certificate"
        title="Certificate Ready!"
        subtitle={`Your official Form REG-06 certificate for ${gstin} is ready for download.`}
      />
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View
        style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={BrandColors.TEXT_PRIMARY}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GST Certificate</Text>
        <View style={styles.placeholderBox} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        overScrollMode="always"
      >
        {/* Top Info Banner */}
        <GstServiceBanner
          iconName="ribbon"
          text="Download or request official GST Registration Certificate (Form REG-06) with digital seal"
        />

        {/* GSTIN (Clean & Editable) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            GSTIN (15-Character) <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, gstinError && styles.inputError]}
            placeholder="e.g. 29AAAAA0000A1Z5"
            placeholderTextColor="#94A3B8"
            value={gstin}
            onChangeText={handleGstinChange}
            autoCapitalize="characters"
            maxLength={15}
          />
          {gstinError ? (
            <Text style={styles.errorText}>{gstinError}</Text>
          ) : null}
        </View>

        {/* Registered Mobile / Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Registered Contact Authorization</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactValue}>{registeredMobile}</Text>
            <Text style={styles.contactValue}>{registeredEmail}</Text>
            <Text style={styles.contactSubText}>
              Official certificate copy will be issued to registered signatory
              credentials
            </Text>
          </View>
        </View>

        {/* Request Type Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Request Type <Text style={styles.star}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.selectBox, error && styles.inputError]}
            activeOpacity={0.7}
            onPress={() => setShowTypeModal(true)}
          >
            <Text
              style={[
                styles.selectText,
                !requestType && styles.placeholderText,
              ]}
            >
              {requestType || "Select Request Type"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Illustration Preview Graphic */}
        <View style={styles.illustrationWrap}>
          <View style={styles.docGraphic}>
            <Ionicons name="document-text-outline" size={60} color="#BFDBFE" />
            <View style={styles.sealBadge}>
              <Ionicons name="ribbon" size={20} color="#2563EB" />
            </View>
          </View>
        </View>

        {/* Dynamic Orange CTA Button */}
        <TouchableOpacity
          style={styles.actionOrangeBtn}
          activeOpacity={0.85}
          onPress={handleAction}
          disabled={isProcessing}
        >
          <Text style={styles.actionOrangeBtnText}>{getButtonText()}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Request Type Modal */}
      <GstSelectModal
        visible={showTypeModal}
        title="Select Request Type"
        options={CERTIFICATE_REQUEST_TYPES}
        selectedValue={requestType}
        onSelect={(v) => {
          setRequestType(v);
          setError("");
        }}
        onClose={() => setShowTypeModal(false)}
      />

      {/* Universal Save As Draft Confirmation Modal */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Progress?"
        message="You have unsaved changes in your GST certificate request. Save your progress so you can resume anytime without re-entering details."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
}
