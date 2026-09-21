/**
 * Screen: GST Cancellation (REG-16)
 * Flow: 1. Form -> 2. Review & Submit -> 3. Successfully Submitted
 * Reuses existing GST Amendment tracking and My Application screens.
 * Strictly under 300 lines.
 */
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { BrandColors } from "@/shared/theme";
import {
  GstServiceBanner,
  GstSelectModal,
  GstDatePickerModal,
} from "@/modules/gst/components/common";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { pickImageFromCamera } from "@/modules/gst/utils/imageUploadHelper";
import {
  styles,
  CANCELLATION_REASONS,
  ACCEPTED_PROOFS,
} from "./GstCancellationScreen.styles";
import { useApplicationStore } from "@/store/applicationStore";
import { gstCancellationApi } from "@/modules/gst/services/gstCancellationApi";
import { GstCancellationSuccess } from "../../components/GstCancellationSuccess";
import { GstCancellationReview } from "../../components/GstCancellationReview";
import { GstSupportingProof } from "../../components/GstSupportingProof";
import { GstAcceptedProofs } from "../../components/GstAcceptedProofs";

export default function GstCancellationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentStep, setCurrentStep] = useState<"FORM" | "REVIEW" | "SUCCESS">(
    "FORM",
  );
  const [gstin, setGstin] = useState(""),
    [reason, setReason] = useState(""),
    [otherReason, setOtherReason] = useState("");
  const [cancellationDate, setCancellationDate] = useState(""),
    [closingStock, setClosingStock] = useState("");
  const [pendingLiabilities, setPendingLiabilities] = useState(""),
    [lastGstr3b, setLastGstr3b] = useState("");
  const [supportingDoc, setSupportingDoc] = useState<{
    uri: string;
    name: string;
    size: string;
  } | null>(null);

  const [isVoluntaryUnderOneYear, setIsVoluntaryUnderOneYear] = useState<
    boolean | null
  >(null);
  const [areAllReturnsFiled, setAreAllReturnsFiled] = useState<boolean | null>(
    null,
  );

  const [isProofsExpanded, setIsProofsExpanded] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false),
    [showDateModal, setShowDateModal] = useState(false);
  const [isFinalReturnDeclared, setIsFinalReturnDeclared] = useState(false),
    [isReviewDeclared, setIsReviewDeclared] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}),
    [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    arn: string;
    date: string;
    appId: string;
  } | null>(null);

  const {
    showDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () =>
      Boolean(
        gstin ||
        reason ||
        cancellationDate ||
        closingStock ||
        lastGstr3b ||
        supportingDoc,
      ),
    onSaveDraft: () => {},
    onDiscardDraft: () => {},
    isSubmitted: () => currentStep === "SUCCESS",
  });

  const clearError = (k: string) =>
    setErrors((p) => {
      const n = { ...p };
      delete n[k];
      return n;
    });

  const handleBrowseFiles = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets?.[0]) {
        const f = res.assets[0];
        setSupportingDoc({
          uri: f.uri,
          name: f.name,
          size: f.size ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : "0.1 MB",
        });
      }
    } catch {
      Alert.alert(
        "Picker Error",
        "Could not select document. Please try again.",
      );
    }
  };

  const handleScanFile = async () => {
    const uri = await pickImageFromCamera(false);
    if (uri)
      setSupportingDoc({
        uri,
        name: `Scan_${Date.now().toString().slice(-4)}.jpg`,
        size: "1.2 MB",
      });
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!GstValidators.isValidGstin(gstin))
      e.gstin = "Please enter a valid 15-character GSTIN.";
    if (!reason) e.reason = "Please select a reason for cancellation.";
    if (
      reason === "Other Valid Reason" &&
      !GstValidators.isNotEmpty(otherReason, 3)
    )
      e.otherReason = "Please specify the reason.";

    // New Eligibility Checks
    if (isVoluntaryUnderOneYear === null) {
      e.isVoluntaryUnderOneYear = "Please answer this question.";
    } else if (isVoluntaryUnderOneYear === true) {
      e.isVoluntaryUnderOneYear =
        "You cannot cancel a voluntary registration before 1 year.";
    }

    if (areAllReturnsFiled === null) {
      e.areAllReturnsFiled = "Please answer this question.";
    } else if (areAllReturnsFiled === false) {
      e.areAllReturnsFiled = "Please file all pending GST returns first.";
    }

    if (!cancellationDate)
      e.cancellationDate = "Cancellation date is required.";
    if (!GstValidators.isNotEmpty(closingStock, 3))
      e.closingStock = "Please enter closing stock details or 'Nil'.";
    if (!GstValidators.isNotEmpty(lastGstr3b, 3))
      e.lastGstr3b = "Latest filed GSTR-3B ARN / period is required.";
    if (!isFinalReturnDeclared)
      e.declaration = "Please confirm the final return filing declaration.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitCancellation = async () => {
    if (!isReviewDeclared)
      return Alert.alert(
        "Declaration Required",
        "Please tick the declaration checkbox to authorise filing.",
      );
    setIsSubmitting(true);

    try {
      // 1. Call Backend API
      await gstCancellationApi.createCancellation({
        gstin,
        reason,
        otherReason,
        cancellationDate,
        closingStock,
        pendingLiabilities,
        lastGstr3b,
        supportingDoc,
      });

      // 2. Create Application in Global Store
      setIsSubmitting(false);
      markSubmitted();
      const arn = `AA290926${Math.floor(100000 + Math.random() * 900000)}`;
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const finalReason =
        reason === "Other Valid Reason" ? otherReason : reason;
      const appId = useApplicationStore.getState().createApplication(
        "gst-cancellation",
        "GST Cancellation (REG-16)",
        "GST",
        {
          gstin,
          arn,
          reason: finalReason,
          cancellationDate,
          closingStock,
          pendingLiabilities: pendingLiabilities || "Nil",
          lastGstr3b,
          submissionDate: date,
          supportingDoc: supportingDoc?.name || "None",
        },
        supportingDoc
          ? [supportingDoc.name, "Last GSTR-3B Filing Proof"]
          : ["Last GSTR-3B Filing Proof", "Closing Stock Valuation"],
        0,
      );
      setSubmissionResult({ arn, date, appId });
      setCurrentStep("SUCCESS");
    } catch (err: any) {
      setIsSubmitting(false);
      Alert.alert(
        "Submission Failed",
        err.message || "Failed to submit GST Cancellation.",
      );
    }
  };

  /* ---------------- SCREEN 3: SUCCESSFULLY SUBMITTED ---------------- */
  if (currentStep === "SUCCESS" && submissionResult) {
    return (
      <GstCancellationSuccess
        submissionResult={submissionResult}
        gstin={gstin}
        cancellationDate={cancellationDate}
      />
    );
  }
  /* ---------------- SCREEN 2: REVIEW & SUBMIT ---------------- */
  if (currentStep === "REVIEW") {
    return (
      <GstCancellationReview
        formData={{
          gstin,
          reason,
          otherReason,
          cancellationDate,
          closingStock,
          pendingLiabilities,
          lastGstr3b,
          supportingDoc,
        }}
        isReviewDeclared={isReviewDeclared}
        setIsReviewDeclared={setIsReviewDeclared}
        isSubmitting={isSubmitting}
        handleSubmitCancellation={handleSubmitCancellation}
        onBack={() => setCurrentStep("FORM")}
      />
    );
  }
  /* ---------------- SCREEN 1: GST CANCELLATION FORM ---------------- */
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
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
        <Text style={styles.headerTitle}>GST Cancellation</Text>
        <View style={styles.placeholderBox} />
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <GstServiceBanner
          iconName="ban"
          text="Formally surrender and cancel your GST registration via Form REG-16"
        />
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            GSTIN (15-Character) <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.gstin && styles.inputError]}
            placeholder="e.g. 29AAAAA0000A1Z5"
            placeholderTextColor="#94A3B8"
            value={gstin}
            autoCapitalize="characters"
            maxLength={15}
            onChangeText={(t) => {
              setGstin(t.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
              clearError("gstin");
            }}
          />
          {errors.gstin ? (
            <Text style={styles.errorText}>{errors.gstin}</Text>
          ) : null}
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Reason for Cancellation <Text style={styles.star}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.selectBox, errors.reason && styles.inputError]}
            activeOpacity={0.7}
            onPress={() => setShowReasonModal(true)}
          >
            <Text
              style={[styles.selectText, !reason && styles.placeholderText]}
            >
              {reason || "Select Reason for Cancellation"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.reason ? (
            <Text style={styles.errorText}>{errors.reason}</Text>
          ) : null}
        </View>
        {reason === "Other Valid Reason" && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Please Specify Reason <Text style={styles.star}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.otherReason && styles.inputError]}
              placeholder="Describe reason for cancelling"
              placeholderTextColor="#94A3B8"
              value={otherReason}
              onChangeText={(t) => {
                setOtherReason(t);
                clearError("otherReason");
              }}
            />
            {errors.otherReason ? (
              <Text style={styles.errorText}>{errors.otherReason}</Text>
            ) : null}
          </View>
        )}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Date Cancellation Is Sought <Text style={styles.star}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.selectBox,
              errors.cancellationDate && styles.inputError,
            ]}
            activeOpacity={0.7}
            onPress={() => setShowDateModal(true)}
          >
            <Text
              style={[
                styles.selectText,
                !cancellationDate && styles.placeholderText,
              ]}
            >
              {cancellationDate || "Select effective cancellation date"}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#083B75" />
          </TouchableOpacity>
          {errors.cancellationDate ? (
            <Text style={styles.errorText}>{errors.cancellationDate}</Text>
          ) : null}
        </View>

        {/* New Eligibility Checks */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Did you register voluntarily AND is your registration less than 1
            year old? <Text style={styles.star}>*</Text>
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
            <TouchableOpacity
              style={[
                styles.selectBox,
                { flex: 1, alignItems: "center", justifyContent: "center" },
                isVoluntaryUnderOneYear === true && {
                  borderColor: BrandColors.PRIMARY_BLUE,
                  backgroundColor: "#F0F9FF",
                },
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setIsVoluntaryUnderOneYear(true);
                clearError("isVoluntaryUnderOneYear");
              }}
            >
              <Text
                style={[
                  styles.selectText,
                  isVoluntaryUnderOneYear === true && {
                    color: BrandColors.PRIMARY_BLUE,
                    fontWeight: "600",
                  },
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectBox,
                { flex: 1, alignItems: "center", justifyContent: "center" },
                isVoluntaryUnderOneYear === false && {
                  borderColor: BrandColors.PRIMARY_BLUE,
                  backgroundColor: "#F0F9FF",
                },
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setIsVoluntaryUnderOneYear(false);
                clearError("isVoluntaryUnderOneYear");
              }}
            >
              <Text
                style={[
                  styles.selectText,
                  isVoluntaryUnderOneYear === false && {
                    color: BrandColors.PRIMARY_BLUE,
                    fontWeight: "600",
                  },
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
          {errors.isVoluntaryUnderOneYear ? (
            <Text style={styles.errorText}>
              {errors.isVoluntaryUnderOneYear}
            </Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Are all your GST returns filed up to today?{" "}
            <Text style={styles.star}>*</Text>
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
            <TouchableOpacity
              style={[
                styles.selectBox,
                { flex: 1, alignItems: "center", justifyContent: "center" },
                areAllReturnsFiled === true && {
                  borderColor: BrandColors.PRIMARY_BLUE,
                  backgroundColor: "#F0F9FF",
                },
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setAreAllReturnsFiled(true);
                clearError("areAllReturnsFiled");
              }}
            >
              <Text
                style={[
                  styles.selectText,
                  areAllReturnsFiled === true && {
                    color: BrandColors.PRIMARY_BLUE,
                    fontWeight: "600",
                  },
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectBox,
                { flex: 1, alignItems: "center", justifyContent: "center" },
                areAllReturnsFiled === false && {
                  borderColor: BrandColors.PRIMARY_BLUE,
                  backgroundColor: "#F0F9FF",
                },
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setAreAllReturnsFiled(false);
                clearError("areAllReturnsFiled");
              }}
            >
              <Text
                style={[
                  styles.selectText,
                  areAllReturnsFiled === false && {
                    color: BrandColors.PRIMARY_BLUE,
                    fontWeight: "600",
                  },
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
          {errors.areAllReturnsFiled ? (
            <Text style={styles.errorText}>{errors.areAllReturnsFiled}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Details of Closing Stock & Input Tax Reversal{" "}
            <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={[styles.textArea, errors.closingStock && styles.inputError]}
            placeholder="Describe closing inventory value and ITC reversal or enter 'Nil'"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            maxLength={300}
            value={closingStock}
            onChangeText={(t) => {
              setClosingStock(t);
              clearError("closingStock");
            }}
          />
          <View style={styles.counterRow}>
            {errors.closingStock ? (
              <Text style={styles.errorText}>{errors.closingStock}</Text>
            ) : (
              <View />
            )}
            <Text style={styles.charCount}>{closingStock.length}/300</Text>
          </View>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Pending Dues / Liabilities (Optional)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter any pending penalty or tax dues, if any"
            placeholderTextColor="#94A3B8"
            value={pendingLiabilities}
            onChangeText={setPendingLiabilities}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Last GSTR-3B Filed ARN / Period <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.lastGstr3b && styles.inputError]}
            placeholder="e.g. AA290826000000X / July 2026"
            placeholderTextColor="#94A3B8"
            value={lastGstr3b}
            onChangeText={(t) => {
              setLastGstr3b(t);
              clearError("lastGstr3b");
            }}
          />
          {errors.lastGstr3b ? (
            <Text style={styles.errorText}>{errors.lastGstr3b}</Text>
          ) : null}
        </View>

        <GstSupportingProof
          supportingDoc={supportingDoc}
          setSupportingDoc={setSupportingDoc}
          handleBrowseFiles={handleBrowseFiles}
          handleScanFile={handleScanFile}
        />

        <View style={styles.acceptedProofsCard}>
          <View style={styles.acceptedProofsHeader}>
            <Ionicons
              name="information-circle"
              size={20}
              color={BrandColors.PRIMARY_ORANGE}
            />
            <Text style={styles.acceptedProofsTitle}>Accepted proofs</Text>
          </View>
          <View style={styles.acceptedProofList}>
            {(isProofsExpanded
              ? ACCEPTED_PROOFS
              : ACCEPTED_PROOFS.slice(0, 3)
            ).map((proofText, idx) => (
              <View key={idx} style={styles.acceptedProofItem}>
                <Text style={styles.acceptedProofBullet}>•</Text>
                <Text style={styles.acceptedProofText}>{proofText}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.viewMoreBtn}
            activeOpacity={0.7}
            onPress={() => setIsProofsExpanded((p) => !p)}
          >
            <Text style={styles.viewMoreText}>
              {isProofsExpanded ? "View Less" : "View More"}
            </Text>
            <Ionicons
              name={isProofsExpanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={BrandColors.PRIMARY_ORANGE}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.declarationRow}
          activeOpacity={0.8}
          onPress={() => {
            setIsFinalReturnDeclared(!isFinalReturnDeclared);
            clearError("declaration");
          }}
        >
          <View
            style={[
              styles.checkbox,
              isFinalReturnDeclared && styles.checkboxActive,
            ]}
          >
            {isFinalReturnDeclared && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.declarationLabel}>
              Final Return Declaration (GSTR-10){" "}
              <Text style={styles.star}>*</Text>
            </Text>
            <Text style={styles.declarationSubText}>
              I confirm all outward tax dues are settled and will file final
              return GSTR-10 within 3 months of cancellation order.
            </Text>
          </View>
        </TouchableOpacity>
        {errors.declaration ? (
          <Text style={styles.errorText}>{errors.declaration}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.actionOrangeBtn}
          activeOpacity={0.85}
          onPress={() => {
            if (validateForm()) setCurrentStep("REVIEW");
          }}
        >
          <Text style={styles.actionOrangeBtnText}>Review Cancellation</Text>
        </TouchableOpacity>
      </ScrollView>

      <GstSelectModal
        visible={showReasonModal}
        title="Select Reason for Cancellation"
        options={CANCELLATION_REASONS}
        selectedValue={reason}
        onSelect={(v) => {
          setReason(v);
          clearError("reason");
        }}
        onClose={() => setShowReasonModal(false)}
      />
      <GstDatePickerModal
        visible={showDateModal}
        title="Date Cancellation Is Sought"
        selectedDate={cancellationDate}
        onSelectDate={(d) => {
          setCancellationDate(d);
          clearError("cancellationDate");
        }}
        onClose={() => setShowDateModal(false)}
      />
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Cancellation Draft?"
        message="You have unsaved changes in your GST cancellation request. Save your progress so you can resume anytime."
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
