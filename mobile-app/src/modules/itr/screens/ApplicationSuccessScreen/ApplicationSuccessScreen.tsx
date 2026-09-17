import React from "react";
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
import { SuccessCelebrationHeader } from "../../components/success/SuccessCelebrationHeader";
import { FilingProgressTracker } from "../../components/success/FilingProgressTracker";
import { ApplicationSummaryCard } from "../../components/success/ApplicationSummaryCard";
import { WhatHappensNextCard } from "../../components/success/WhatHappensNextCard";
import { ApplicationSummaryData } from "../../types/success.types";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./ApplicationSuccessScreen.styles";

interface ApplicationSuccessScreenProps {
  onTrackStatus?: () => void;
  onDownloadAcknowledgement?: () => void;
}

export const ApplicationSuccessScreen: React.FC<ApplicationSuccessScreenProps> = ({
  onTrackStatus,
  onDownloadAcknowledgement,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    applicationId?: string;
    serviceTitle?: string;
    formType?: string;
    assessmentYear?: string;
    incomeType?: string;
    regime?: string;
    uploadedDocsCount?: string;
    totalDocsCount?: string;
    refundBank?: string;
  }>();

  const appId = params.applicationId || "ITR-2025-00042";
  const incomeType = params.incomeType || "Salary • Capital Gains • Other Income";
  const formType = params.formType || "ITR-2";
  const rawAy = params.assessmentYear || "2025-2026";
  const formattedAy = rawAy.startsWith("AY") ? rawAy : `AY ${rawAy}`;
  const uploadedCount = params.uploadedDocsCount || "7";
  const totalCount = params.totalDocsCount || "7";
  const docsUploaded = `${uploadedCount} of ${totalCount} received`;
  const refundBank = params.refundBank || "HDFC Bank •••• 1234";
  const taxRegime = params.regime || "New Tax Regime";

  const summaryData: ApplicationSummaryData = {
    applicationId: appId,
    incomeType,
    itrForm: formType,
    assessmentYear: formattedAy,
    taxRegime,
    documentsUploaded: docsUploaded,
    refundBank,
    submissionDate: "16 Sep 2026",
    status: "Received",
  };

  const handleBack = () => {
    router.replace("/service/itr" as any);
  };

  const handleTrackStatus = () => {
    if (onTrackStatus) {
      onTrackStatus();
    } else {
      router.replace({
        pathname: "/(main)/home" as any,
      });
    }
  };

  const handleDownload = () => {
    if (onDownloadAcknowledgement) {
      onDownloadAcknowledgement();
    } else {
      Alert.alert(
        "Application Receipt Downloaded",
        `TaxEdge Application Receipt for ${appId} has been saved to your device.`
      );
    }
  };

  return (
    <View style={[styles.container, getContainerInsetsStyle(insets.top)]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#0B1F3A" />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>ITR Filing</Text>
          <Text style={styles.headerSubtitle}>Application Received</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          getScrollContentInsetsStyle(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Header & ID Card */}
        <SuccessCelebrationHeader applicationId={appId} />

        {/* 6-Stage Progress Tracker */}
        <FilingProgressTracker />

        {/* What We Have Summary Card */}
        <ApplicationSummaryCard summary={summaryData} />

        {/* What Happens Next Card */}
        <WhatHappensNextCard />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={[styles.bottomBar, getBottomBarInsetsStyle(insets.bottom)]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleTrackStatus}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>View Application Status</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleDownload}
          style={styles.secondaryButton}
        >
          <Ionicons name="download-outline" size={18} color="#F97316" />
          <Text style={styles.secondaryButtonText}>Download TaxEdge Application Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApplicationSuccessScreen;
