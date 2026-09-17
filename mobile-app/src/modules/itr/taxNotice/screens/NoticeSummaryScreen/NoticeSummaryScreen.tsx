import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TaxNoticeHeader } from "../../components/common";
import {
  NoticeMetadataCard,
  NoticeExplanationCard,
} from "../../components/summary";
import { MOCK_NOTICE_SUMMARY } from "../../mock/taxNoticeData";
import { TaxNoticeSummaryData } from "../../types/taxNotice.types";
import {
  styles,
  getContainerInsetsStyle,
  getScrollContentInsetsStyle,
  getBottomBarInsetsStyle,
} from "./NoticeSummaryScreen.styles";

export const NoticeSummaryScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    noticeNumber?: string;
    noticeDate?: string;
    assessmentYear?: string;
  }>();

  const noticeDate = params.noticeDate || "Notice Date";
  const assessmentYear = params.assessmentYear || "AY 2025–26";

  const summaryData: TaxNoticeSummaryData = {
    ...MOCK_NOTICE_SUMMARY,
    issuedDate: noticeDate,
    responseDueDate: "Within 30 Days",
    daysLeft: 30,
  };

  const handleContinue = () => {
    // Navigate to Screen 3: Upload Supporting Documents
    router.push({
      pathname: "/service/tax-notice-documents" as any,
      params: {
        noticeNumber: params.noticeNumber,
        noticeDate: params.noticeDate,
        assessmentYear,
      },
    });
  };

  return (
    <View style={[styles.container, getContainerInsetsStyle(insets.top)]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <TaxNoticeHeader subtitle="Notice Summary" />

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
          <Text style={styles.pageTitle}>Here’s what this notice means</Text>
          <Text style={styles.pageSubtitle}>
            A plain-language explanation from your Tax Executive — no jargon.
          </Text>
        </View>

        {/* Notice Metadata Card */}
        <NoticeMetadataCard summary={summaryData} />

        {/* Explanation Card 1: What this notice means */}
        <NoticeExplanationCard
          iconName="document-text-outline"
          title="What this notice means"
          description={MOCK_NOTICE_SUMMARY.whatItMeans}
        />

        {/* Explanation Card 2: What action is required */}
        <NoticeExplanationCard
          iconName="checkmark-circle-outline"
          title="What action is required"
          description={MOCK_NOTICE_SUMMARY.actionRequired}
        />
      </ScrollView>

      {/* Sticky Bottom Action Button */}
      <View
        style={[
          styles.bottomBar,
          getBottomBarInsetsStyle(insets.bottom),
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoticeSummaryScreen;
