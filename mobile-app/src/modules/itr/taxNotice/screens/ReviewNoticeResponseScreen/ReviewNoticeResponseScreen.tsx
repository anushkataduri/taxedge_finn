import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TaxNoticeHeader } from "../../components/common";
import { DraftedResponseCard } from "../../components/review";
import { generateNoticeDraftResponse } from "../../mock/taxNoticeData";
import { useApplicationStore } from "@/store/applicationStore";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./ReviewNoticeResponseScreen.styles";

export const ReviewNoticeResponseScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createApplication = useApplicationStore((state) => state.createApplication);
  const customer = useAuthStore((state) => state.customer);
  const authUser = useAuthStore((state) => state.authenticatedUser);

  const params = useLocalSearchParams<{
    noticeNumber?: string;
    assessmentYear?: string;
    noticeDate?: string;
  }>();

  // Checked by default matching reference design
  const [isChecked, setIsChecked] = useState(true);

  const customerName = customer?.name || authUser?.name || "";
  const customerPan = customer?.pan || (authUser as any)?.pan || "";
  const nNumber = params.noticeNumber?.trim() || "";
  const ay = params.assessmentYear || "AY 2025–26";

  const responseText = generateNoticeDraftResponse({
    name: customerName,
    pan: customerPan,
    noticeNumber: nNumber || undefined,
    noticeDate: params.noticeDate,
    assessmentYear: ay,
    section: "143(1)(a)",
  });

  const handleEditRequest = () => {
    Alert.alert(
      "Request Edits",
      "Please describe the edits you would like our Tax Executive to make in this response.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send to Executive",
          onPress: () => Alert.alert("Sent", "Your edit request has been sent to your Tax Executive."),
        },
      ]
    );
  };

  const handleApproveAndSubmit = () => {
    if (!isChecked) {
      Alert.alert(
        "Confirmation Required",
        "Please confirm that you have reviewed the response before submitting."
      );
      return;
    }

    const createdAppId = createApplication(
      "tax-notice-assistance",
      `Tax Notice Response (${nNumber || "Section 143(1)(a)"})`,
      "ITR",
      {
        noticeNumber: nNumber,
        assessmentYear: ay,
        noticeDate: params.noticeDate || "",
        section: "143(1)(a)",
        assesseeName: customerName,
        pan: customerPan,
        status: "Response Submitted",
      },
      [
        "Notice Copy",
        "AIS Statement",
        "Form 26AS",
        "Bank Statement",
        "Supporting Proof",
      ],
      1499, // service fee
      "Paid"
    );

    // Navigate to Screen 5: Notice Status
    router.push({
      pathname: "/service/tax-notice-status" as any,
      params: {
        applicationId: createdAppId,
        noticeNumber: nNumber,
        assessmentYear: ay,
      },
    });
  };

  return (
    <View style={[styles.container, getContainerInsetsStyle(insets.top)]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <TaxNoticeHeader subtitle="Review Response" />

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          getScrollContentInsetsStyle(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Please review our response</Text>
          <Text style={styles.pageSubtitle}>
            Your Tax Executive has prepared the following response to the Income
            Tax Department.
          </Text>
        </View>

        {/* Drafted Response Letter */}
        <DraftedResponseCard responseText={responseText} />

        {/* Checkbox Section */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsChecked(!isChecked)}
          style={styles.checkboxRow}
        >
          <View style={[styles.checkbox, isChecked ? styles.checkboxActive : null]}>
            {isChecked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>
            I have reviewed the response and confirm that the details are correct.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Sticky Action Buttons */}
      <View
        style={[
          styles.bottomBar,
          getBottomBarInsetsStyle(insets.bottom),
        ]}
      >
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleEditRequest}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleApproveAndSubmit}
            style={styles.approveButton}
          >
            <Text style={styles.approveButtonText}>Approve & Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReviewNoticeResponseScreen;
