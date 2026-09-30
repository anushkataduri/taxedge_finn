import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  TaxNoticeHeader,
  TaxNoticeDatePickerInput,
} from "../../components/common";
import { NoticeUploadCard } from "../../components/upload";
import { TaxNoticeFormData } from "../../types/taxNotice.types";
import {
  INITIAL_TAX_NOTICE_FORM_DATA,
  NOTICE_TYPE_OPTIONS,
} from "../../mock/taxNoticeData";
import { useApplicationStore } from "@/store/applicationStore";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { taxNoticeApi } from "../../../services/taxNoticeApi";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./UploadNoticeScreen.styles";

export const UploadNoticeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const taxNoticeDraft = useApplicationStore((state) => state.taxNoticeDraft);
  const saveTaxNoticeDraft = useApplicationStore((state) => state.saveTaxNoticeDraft);
  const clearTaxNoticeDraft = useApplicationStore((state) => state.clearTaxNoticeDraft);

  const authUser = useAuthStore((state) => state.authenticatedUser);
  const customer = useAuthStore((state) => state.customer);
  const profilePan = customer?.pan || authUser?.pan || "";

  // 2-step flow: 1 = Notice Details, 2 = Upload Notice
  const [currentStep, setCurrentStep] = useState<1 | 2>(() => {
    if (taxNoticeDraft?.step === "UPLOAD") return 2;
    return 1;
  });

  // Pure functional initial state: restore from draft or start clean (no predefined mock values)
  const [formData, setFormData] = useState<TaxNoticeFormData>(() => {
    if (taxNoticeDraft && taxNoticeDraft.formData) {
      return {
        ...INITIAL_TAX_NOTICE_FORM_DATA,
        ...taxNoticeDraft.formData,
        pan: taxNoticeDraft.formData.pan || "",
      } as TaxNoticeFormData;
    }
    return {
      ...INITIAL_TAX_NOTICE_FORM_DATA,
      pan: "",
    };
  });

  const [showAyDropdown, setShowAyDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ayOptions = [
    "AY 2027-28",
    "AY 2026-27",
    "AY 2025-26",
    "AY 2024-25",
    "AY 2023-24",
    "AY 2022-23",
    "Other"
  ];
  const [showOtherAyInput, setShowOtherAyInput] = useState(false);

  // Universal Draft Guard Hook for intercepting back navigation
  const {
    showDraftModal,
    openDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () =>
      Boolean(
        (formData.pan && formData.pan !== profilePan) ||
        formData.noticeNumber ||
        formData.noticeDate ||
        formData.responseDueDate ||
        formData.customerExplanation ||
        formData.noticeFileName
      ),
    onSaveDraft: () => {
      saveTaxNoticeDraft({
        formData,
        step: currentStep === 1 ? "DETAILS" : "UPLOAD",
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    },
    onDiscardDraft: () => {
      clearTaxNoticeDraft();
    },
  });

  const handleFieldChange = (field: keyof TaxNoticeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleUploadSuccess = (fileInfo: {
    uri: string;
    name: string;
    size: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      noticeFileUri: fileInfo.uri,
      noticeFileName: fileInfo.name,
      noticeFileSize: fileInfo.size,
    }));
    if (errors.file) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.file;
        return next;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    const panTrimmed = (formData.pan || "").trim().toUpperCase();
    if (!panTrimmed) {
      newErrors.pan = "PAN is required.";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panTrimmed)) {
      newErrors.pan = "Enter a valid 10-character PAN (e.g. ABCDE1234F).";
    }

    if (!formData.assessmentYear.trim()) {
      newErrors.assessmentYear = "Assessment year is required.";
    }

    if (!formData.noticeType.trim()) {
      newErrors.noticeType = "Please select the notice type.";
    }

    if (!formData.noticeDate.trim()) {
      newErrors.noticeDate = "Notice date is required.";
    }

    if (!formData.noticeNumber.trim()) {
      newErrors.noticeNumber = "Notice reference number / DIN is required.";
    }

    if (!formData.responseDueDate.trim()) {
      newErrors.responseDueDate = "Response due date is required.";
    }

    if (!formData.customerExplanation.trim()) {
      newErrors.customerExplanation = "Please provide a brief explanation of your case.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.noticeFileName) {
      newErrors.file = "Please upload your Income Tax notice document.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleStep1Continue = async () => {
    if (!validateStep1()) return;

    try {
      setIsSubmitting(true);
      
      let noticeId = taxNoticeDraft?.formData?.noticeId;
      const payload = {
        pan: formData.pan,
        assessmentYear: formData.assessmentYear,
        noticeType: formData.noticeType,
        noticeDate: formData.noticeDate,
        noticeNumber: formData.noticeNumber,
        responseDueDate: formData.responseDueDate,
        customerExplanation: formData.customerExplanation,
        noticeFileUri: "",
        noticeFileName: "",
        noticeFileType: "application/pdf"
      };

      if (noticeId) {
        await taxNoticeApi.updateTaxNotice(noticeId, payload);
      } else {
        noticeId = await taxNoticeApi.registerTaxNotice(payload);
      }

      saveTaxNoticeDraft({
        formData,
        step: "DOCUMENTS",
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      router.push({
        pathname: "/service/tax-notice-documents" as any,
        params: {
          noticeId,
          pan: formData.pan,
          noticeNumber: formData.noticeNumber,
          noticeDate: formData.noticeDate,
          responseDueDate: formData.responseDueDate,
          noticeType: formData.noticeType,
          assessmentYear: formData.assessmentYear,
        },
      });
    } catch (err: any) {
      console.error("API Error: ", err);
      Alert.alert("Registration Failed", err.message || "Could not register tax notice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const handleHeaderBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      openDraftModal();
    }
  };

  return (
    <View style={[styles.container, getContainerInsetsStyle(insets.top)]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header with Draft Action */}
            <TaxNoticeHeader
        subtitle="Notice Details"
        onBack={handleHeaderBack}
      />

      {/* Main Form Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          getScrollContentInsetsStyle(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        

                  {/* ================= STEP 1: NOTICE DETAILS ================= */}
          <View>
            
            <View style={styles.titleSection}>
              <Text style={styles.pageTitle}>Enter Notice Information</Text>
              <Text style={styles.pageSubtitle}>
                Provide details from your notice. This helps our Tax Executive analyze the legal sections and prepare your defense.
              </Text>
            </View>

            {/* Field 1: PAN */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Permanent Account Number (PAN) <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, errors.pan ? styles.inputError : null]}
                placeholder="Enter 10-digit PAN (e.g. ABCDE1234F)"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={10}
                value={formData.pan}
                onChangeText={(text) => handleFieldChange("pan", text.toUpperCase())}
              />
              {errors.pan ? <Text style={styles.errorText}>{errors.pan}</Text> : null}
            </View>

            {/* Field 2: Assessment Year */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Assessment Year (AY) <Text style={styles.requiredStar}>*</Text>
              </Text>
              {showOtherAyInput ? (
                <View style={[styles.textInput, { flexDirection: "row", alignItems: "center", paddingRight: 8 }, errors.assessmentYear ? styles.inputError : null]}>
                  <TextInput
                    style={{ flex: 1, color: "#0F172A", fontSize: 16, height: 48 }}
                    placeholder="E.g., AY 2028-29"
                    placeholderTextColor="#94A3B8"
                    value={formData.assessmentYear}
                    onChangeText={(text) => handleFieldChange("assessmentYear", text)}
                    autoFocus
                  />
                  <TouchableOpacity onPress={() => { setShowOtherAyInput(false); handleFieldChange("assessmentYear", ""); }}>
                    <Ionicons name="close-circle" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowAyDropdown(!showAyDropdown)}
                    style={[styles.dropdownSelector, errors.assessmentYear ? styles.inputError : null]}
                  >
                    <Text style={[styles.dropdownValue, !formData.assessmentYear && { color: "#94A3B8" }]}>{formData.assessmentYear || "Select Assessment Year"}</Text>
                    <Ionicons
                      name={showAyDropdown ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  {showAyDropdown && (
                    <View style={styles.dropdownMenu}>
                      {ayOptions.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          activeOpacity={0.7}
                          onPress={() => {
                            if (opt === "Other") { 
                              setShowOtherAyInput(true); 
                              handleFieldChange("assessmentYear", ""); 
                            } else { 
                              setShowOtherAyInput(false); 
                              handleFieldChange("assessmentYear", opt); 
                            }
                            setShowAyDropdown(false);
                          }}
                          style={styles.dropdownItem}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              formData.assessmentYear === opt
                                ? styles.dropdownItemActive
                                : null,
                            ]}
                          >
                            {opt}
                          </Text>
                          {formData.assessmentYear === opt && (
                            <Ionicons name="checkmark" size={16} color="#F97316" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Field 3: Notice Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Notice Type / Section <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                style={[
                  styles.dropdownSelector,
                  errors.noticeType ? styles.inputError : null,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownValue,
                    !formData.noticeType ? { color: "#94A3B8" } : null,
                  ]}
                  numberOfLines={1}
                >
                  {formData.noticeType || "Select Notice Type"}
                </Text>
                <Ionicons
                  name={showTypeDropdown ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>

              {showTypeDropdown && (
                <View style={styles.dropdownMenu}>
                  {NOTICE_TYPE_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      activeOpacity={0.7}
                      onPress={() => {
                        handleFieldChange("noticeType", item.label);
                        setShowTypeDropdown(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text
                          style={[
                            styles.dropdownItemText,
                            formData.noticeType === item.label
                              ? styles.dropdownItemActive
                              : null,
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                          {item.description}
                        </Text>
                      </View>
                      {formData.noticeType === item.label && (
                        <Ionicons name="checkmark" size={16} color="#F97316" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.noticeType ? (
                <Text style={styles.errorText}>{errors.noticeType}</Text>
              ) : null}
            </View>

            {/* Field 4: Notice Date (Interactive Calendar DatePicker) */}
            <TaxNoticeDatePickerInput
              label="Notice Date"
              required
              value={formData.noticeDate}
              onChange={(dateStr) => handleFieldChange("noticeDate", dateStr)}
              placeholder="Select date mentioned on notice"
              helperText="Date of issuance stated on the top right of your notice"
              error={errors.noticeDate}
              maximumDate={new Date()}
            />

            {/* Field 5: Notice Reference Number / DIN */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Notice Reference Number / DIN <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  errors.noticeNumber ? styles.inputError : null,
                ]}
                placeholder="e.g. CPC/2526/A3/284419260 or DIN"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={formData.noticeNumber}
                onChangeText={(text) => handleFieldChange("noticeNumber", text)}
              />
              <Text style={styles.inputHint}>
                Document Identification Number (DIN) or CPC Communication number
              </Text>
              {errors.noticeNumber ? (
                <Text style={styles.errorText}>{errors.noticeNumber}</Text>
              ) : null}
            </View>

            {/* Field 6: Response Due Date (Interactive Calendar DatePicker) */}
            <TaxNoticeDatePickerInput
              label="Response Due Date"
              required
              value={formData.responseDueDate}
              onChange={(dateStr) => handleFieldChange("responseDueDate", dateStr)}
              placeholder="Select response due date"
              helperText="Last date allowed by the IT Department to file response (typically 15-30 days)"
              error={errors.responseDueDate}
            />

            {/* Field 7: Customer Explanation */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Your Explanation / Background <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  errors.customerExplanation ? styles.inputError : null,
                ]}
                multiline
                numberOfLines={4}
                placeholder="Describe your case, income sources, reason for discrepancy, or if you already paid taxes..."
                placeholderTextColor="#94A3B8"
                value={formData.customerExplanation}
                onChangeText={(text) => handleFieldChange("customerExplanation", text)}
              />
              {errors.customerExplanation ? (
                <Text style={styles.errorText}>{errors.customerExplanation}</Text>
              ) : null}
            </View>

                        {/* Blue Guidance Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <Ionicons name="information" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.infoText}>
                You can find the DIN, notice date, and assessment year on the top portion of your Income Tax communication.
              </Text>
            </View>
          </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomBar, getBottomBarInsetsStyle(insets.bottom)]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleStep1Continue}
          style={[styles.continueButton, isSubmitting && { opacity: 0.7 }]}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.continueButtonText}>Continue to Supporting Documents</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Universal Draft Confirmation Modal */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Notice Progress?"
        message="You have unsaved notice information. Save as draft to continue anytime without losing your inputs."
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default UploadNoticeScreen;

