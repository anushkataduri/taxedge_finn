import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { PersonalDetails } from "../../../types/customerIncome.types";
import {
  cleanPan,
  cleanAadhaar,
  cleanMobile,
  cleanPinCode,
} from "../../../utils/tdsValidation";
import { validatePersonalDetails } from "../../../validation/tdsCustomerSchema";
import { styles } from "./TdsRefundPersonalInfoCard.styles";

export interface TdsRefundPersonalInfoCardProps {
  personalData: PersonalDetails;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onSaveProfile: (updated: PersonalDetails) => Promise<boolean | void>;
}

export const TdsRefundPersonalInfoCard: React.FC<TdsRefundPersonalInfoCardProps> = ({
  personalData,
  isLoading = false,
  isError = false,
  errorMessage = "Unable to load your profile information.",
  onRetry,
  onSaveProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<PersonalDetails>(personalData);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize local edit buffer when prop updates while not editing
  useEffect(() => {
    if (!isEditing) {
      setEditForm(personalData);
    }
  }, [personalData, isEditing]);

  // Privacy mask helpers
  const maskAadhaar = (num: string): string => {
    const clean = num ? num.replace(/\D/g, "") : "";
    if (clean.length >= 4) {
      return `XXXX XXXX ${clean.slice(-4)}`;
    }
    return "Not provided";
  };

  const formatPan = (pan: string): string => {
    if (!pan || !pan.trim()) return "Not provided";
    const clean = pan.trim().toUpperCase();
    if (clean.length === 10) {
      return `XXXXX${clean.slice(5)}`;
    }
    return clean;
  };

  const formatMobile = (mob: string): string => {
    const clean = mob ? mob.replace(/\D/g, "") : "";
    if (clean.length === 10) {
      return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return mob || "Not provided";
  };

  const formatDob = (dob: string): string => {
    if (!dob || !dob.trim()) return "Not provided";
    const clean = dob.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      const [y, m, d] = clean.split("-");
      return `${d}/${m}/${y}`;
    }
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(clean)) {
      return clean.replace(/-/g, "/");
    }
    return clean;
  };

  const formatAddress = (): { text: string; isMissing: boolean } => {
    const lines: string[] = [];
    if (personalData.residentialAddress?.trim()) {
      lines.push(personalData.residentialAddress.trim());
    }
    const cityState: string[] = [];
    if (personalData.city?.trim()) cityState.push(personalData.city.trim());
    if (personalData.state?.trim()) cityState.push(personalData.state.trim());
    const region = cityState.join(", ");
    if (region && personalData.pinCode?.trim()) {
      lines.push(`${region} - ${personalData.pinCode.trim()}`);
    } else if (region) {
      lines.push(region);
    } else if (personalData.pinCode?.trim()) {
      lines.push(`PIN: ${personalData.pinCode.trim()}`);
    }

    if (lines.length === 0) {
      return { text: "Not provided", isMissing: true };
    }
    return { text: lines.join("\n"), isMissing: false };
  };

  const hasMissingMandatory =
    !personalData.fullName?.trim() ||
    !personalData.pan?.trim() ||
    !personalData.dob?.trim() ||
    !personalData.mobileNumber?.trim() ||
    !personalData.email?.trim() ||
    !personalData.residentialAddress?.trim() ||
    !personalData.city?.trim() ||
    !personalData.state?.trim() ||
    !personalData.pinCode?.trim();

  const handleStartEdit = () => {
    setEditForm({ ...personalData });
    setEditErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...personalData });
    setEditErrors({});
    setIsEditing(false);
  };

  const updateEditField = (field: keyof PersonalDetails, val: string) => {
    setEditForm((prev) => ({ ...prev, [field]: val }));
    if (editErrors[field]) {
      setEditErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = async () => {
    const validation = validatePersonalDetails(editForm);
    if (!validation.isValid) {
      setEditErrors(validation.errors);
      return;
    }

    try {
      setIsSaving(true);
      await onSaveProfile(editForm);
      setIsEditing(false);
      setEditErrors({});
    } catch {
      // Handled by parent or toast
    } finally {
      setIsSaving(false);
    }
  };

  // ========================================================
  // 1. SKELETON LOADING STATE
  // ========================================================
  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.skeletonHeader}>
          <View style={[styles.skeletonBar, styles.skeletonBarTitle]} />
          <View style={[styles.skeletonBar, styles.skeletonBarAction]} />
        </View>
        <View style={styles.skeletonContainer}>
          <View style={[styles.skeletonBar, styles.skeletonBarFull]} />
          <View style={[styles.skeletonBar, styles.skeletonBarMedium]} />
          <View style={[styles.skeletonBar, styles.skeletonBarLong]} />
          <View style={[styles.skeletonBar, styles.skeletonBarShort]} />
        </View>
      </View>
    );
  }

  // ========================================================
  // 2. ERROR STATE WITH RETRY
  // ========================================================
  if (isError) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.headerBadge}>
              <Ionicons name="person-outline" size={16} color={BrandColors.PRIMARY_BLUE} />
            </View>
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle" size={28} color="#DC2626" />
          </View>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          {onRetry && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={onRetry}
              style={styles.retryButton}
            >
              <Ionicons name="refresh" size={14} color="#B91C1C" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // ========================================================
  // 3. EDITABLE FORM STATE
  // ========================================================
  if (isEditing) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.headerBadge}>
              <Ionicons name="create-outline" size={16} color={BrandColors.PRIMARY_BLUE} />
            </View>
            <Text style={styles.cardTitle}>Edit Personal Information</Text>
          </View>
        </View>

        <View style={styles.editFormContainer}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Full Name (as per PAN) <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, editErrors.fullName ? styles.textInputError : null]}
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
              value={editForm.fullName}
              onChangeText={(t) => updateEditField("fullName", t)}
            />
            {editErrors.fullName && (
              <Text style={styles.fieldErrorText}>{editErrors.fullName}</Text>
            )}
          </View>

          {/* PAN & Aadhaar */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>
                PAN Number <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, editErrors.pan ? styles.textInputError : null]}
                placeholder="Enter PAN"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={10}
                value={editForm.pan}
                onChangeText={(t) => updateEditField("pan", cleanPan(t))}
              />
              {editErrors.pan && (
                <Text style={styles.fieldErrorText}>{editErrors.pan}</Text>
              )}
            </View>

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Aadhaar Number</Text>
              <TextInput
                style={[styles.textInput, editErrors.aadhaar ? styles.textInputError : null]}
                placeholder="12-digit Aadhaar"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={12}
                value={editForm.aadhaar}
                onChangeText={(t) => updateEditField("aadhaar", cleanAadhaar(t))}
              />
              {editErrors.aadhaar && (
                <Text style={styles.fieldErrorText}>{editErrors.aadhaar}</Text>
              )}
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Date of Birth <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, editErrors.dob ? styles.textInputError : null]}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#94A3B8"
              value={editForm.dob}
              onChangeText={(t) => updateEditField("dob", t)}
            />
            {editErrors.dob && (
              <Text style={styles.fieldErrorText}>{editErrors.dob}</Text>
            )}
          </View>

          {/* Mobile & Email */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>
                Mobile Number <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, editErrors.mobileNumber ? styles.textInputError : null]}
                placeholder="10-digit mobile"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
                value={editForm.mobileNumber}
                onChangeText={(t) => updateEditField("mobileNumber", cleanMobile(t))}
              />
              {editErrors.mobileNumber && (
                <Text style={styles.fieldErrorText}>{editErrors.mobileNumber}</Text>
              )}
            </View>

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>
                Email Address <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, editErrors.email ? styles.textInputError : null]}
                placeholder="Enter email"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={editForm.email}
                onChangeText={(t) => updateEditField("email", t)}
              />
              {editErrors.email && (
                <Text style={styles.fieldErrorText}>{editErrors.email}</Text>
              )}
            </View>
          </View>

          {/* Residential Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Residential Address <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, editErrors.residentialAddress ? styles.textInputError : null]}
              placeholder="House/Flat, Street address"
              placeholderTextColor="#94A3B8"
              value={editForm.residentialAddress}
              onChangeText={(t) => updateEditField("residentialAddress", t)}
            />
            {editErrors.residentialAddress && (
              <Text style={styles.fieldErrorText}>{editErrors.residentialAddress}</Text>
            )}
          </View>

          {/* City, State & PIN */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>
                City <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, editErrors.city ? styles.textInputError : null]}
                placeholder="City"
                placeholderTextColor="#94A3B8"
                value={editForm.city}
                onChangeText={(t) => updateEditField("city", t)}
              />
              {editErrors.city && (
                <Text style={styles.fieldErrorText}>{editErrors.city}</Text>
              )}
            </View>

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>
                State <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, editErrors.state ? styles.textInputError : null]}
                placeholder="State"
                placeholderTextColor="#94A3B8"
                value={editForm.state}
                onChangeText={(t) => updateEditField("state", t)}
              />
              {editErrors.state && (
                <Text style={styles.fieldErrorText}>{editErrors.state}</Text>
              )}
            </View>

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>
                PIN <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, editErrors.pinCode ? styles.textInputError : null]}
                placeholder="PIN code"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                value={editForm.pinCode}
                onChangeText={(t) => updateEditField("pinCode", cleanPinCode(t))}
              />
              {editErrors.pinCode && (
                <Text style={styles.fieldErrorText}>{editErrors.pinCode}</Text>
              )}
            </View>
          </View>

          {/* Cancel and Save Actions */}
          <View style={styles.editActionsRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleCancelEdit}
              disabled={isSaving}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={isSaving}
              style={[styles.saveButton, isSaving ? styles.saveButtonDisabled : null]}
            >
              {isSaving && <ActivityIndicator size="small" color="#FFFFFF" />}
              <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Save"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ========================================================
  // 4. READ-ONLY COMPACT CARD (DEFAULT)
  // ========================================================
  const addressInfo = formatAddress();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.headerBadge}>
            <Ionicons name="person-outline" size={16} color={BrandColors.PRIMARY_BLUE} />
          </View>
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleStartEdit}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={12} color={BrandColors.PRIMARY_ORANGE_DARK} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRowsList}>
        {/* Full Name */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text
            style={[
              styles.infoValue,
              !personalData.fullName?.trim() ? styles.infoValueMissing : null,
            ]}
            numberOfLines={1}
          >
            {personalData.fullName?.trim() || "Not provided"}
          </Text>
        </View>

        {/* PAN */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PAN</Text>
          <Text
            style={[
              styles.infoValue,
              !personalData.pan?.trim() ? styles.infoValueMissing : null,
            ]}
          >
            {formatPan(personalData.pan)}
          </Text>
        </View>

        {/* Aadhaar */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Aadhaar</Text>
          <Text
            style={[
              styles.infoValue,
              !personalData.aadhaar?.trim() ? styles.infoValueMissing : null,
            ]}
          >
            {maskAadhaar(personalData.aadhaar)}
          </Text>
        </View>

        {/* Date of Birth */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text
            style={[
              styles.infoValue,
              !personalData.dob?.trim() ? styles.infoValueMissing : null,
            ]}
          >
            {formatDob(personalData.dob)}
          </Text>
        </View>

        {/* Mobile */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mobile</Text>
          <Text
            style={[
              styles.infoValue,
              !personalData.mobileNumber?.trim() ? styles.infoValueMissing : null,
            ]}
          >
            {formatMobile(personalData.mobileNumber)}
          </Text>
        </View>

        {/* Email */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text
            style={[
              styles.infoValue,
              !personalData.email?.trim() ? styles.infoValueMissing : null,
            ]}
            numberOfLines={2}
          >
            {personalData.email?.trim() || "Not provided"}
          </Text>
        </View>

        {/* Address */}
        <View style={[styles.infoRow, styles.infoRowLast]}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text
            style={[
              styles.infoValue,
              styles.addressValue,
              addressInfo.isMissing ? styles.infoValueMissing : null,
            ]}
          >
            {addressInfo.text}
          </Text>
        </View>
      </View>

      {/* Missing mandatory fields banner */}
      {hasMissingMandatory && (
        <View style={styles.missingBanner}>
          <View style={styles.missingBannerLeft}>
            <Ionicons name="alert-circle-outline" size={16} color="#B45309" />
            <Text style={styles.missingText}>
              Required profile details are missing for TDS refund.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleStartEdit}
            style={styles.completeProfileBtn}
          >
            <Text style={styles.completeProfileBtnText}>Complete Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TdsRefundPersonalInfoCard;
