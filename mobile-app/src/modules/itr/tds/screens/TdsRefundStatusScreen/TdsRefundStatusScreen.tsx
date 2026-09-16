import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { TdsRefundStatusDetails } from "../../types/status.types";
import { tdsApiService } from "../../services/tdsApiService";
import { tdsDraftService } from "../../services/tdsDraftService";
import { RefundProgressTracker } from "../../components/status/RefundProgressTracker";
import { RefundDetailsCard } from "../../components/status/RefundDetailsCard";
import { styles } from "./TdsRefundStatusScreen.styles";

export const TdsRefundStatusScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    applicationId?: string;
    refundAmount?: string;
    isAdditionalPayable?: string;
  }>();

  const getTodayFormatted = () => {
    const d = new Date();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const [statusDetails, setStatusDetails] = useState<TdsRefundStatusDetails>({
    applicationId: params.applicationId || "TDS-2026-PENDING",
    filedOn: getTodayFormatted(),
    estimatedRefund: params.refundAmount || "₹0",
    isAdditionalTaxPayable: params.isAdditionalPayable === "1",
    refundToBank: "Registered Bank Account",
    indicativeTimeline: "10–20 Business Days",
    currentStageIndex: 2, // "Under Verification"
    stages: [],
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const appId = params.applicationId || (await tdsDraftService.getApplicationId());
      if (appId) {
        try {
          const remote = await tdsApiService.fetchStatus(appId);
          if (isMounted && remote) {
            setStatusDetails((prev) => ({
              ...prev,
              applicationId: remote.applicationId,
              estimatedRefund: `₹${(remote.estimatedRefund || 0).toLocaleString("en-IN")}`,
              isAdditionalTaxPayable: remote.isAdditionalTaxPayable,
              refundToBank: remote.maskedAccountNumber || prev.refundToBank,
              filedOn: remote.createdAt ? remote.createdAt.slice(0, 10) : prev.filedOn,
            }));
          }
        } catch {
          // Keep parameters passed from screen 4
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [params.applicationId]);

  const handleBackToServices = () => {
    router.replace("/service/itr" as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleBackToServices}
          style={styles.backButton}
        >
          <Ionicons name="close" size={20} color={BrandColors.PRIMARY_BLUE_DARK} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>Application Status</Text>
          <Text style={styles.headerSubtitle}>Step 5 of 5: Tracking</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 85 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Confirmation Hero */}
        <View style={styles.successHero}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Application Submitted Successfully</Text>
          <Text style={styles.successSubtitle}>
            Your TDS refund claim and documents have been securely submitted. A TaxEdge Chartered Accountant is currently reviewing your application.
          </Text>
        </View>

        {/* Dynamic Refund Details Card */}
        <RefundDetailsCard details={statusDetails} />

        {/* 9-Stage Progress Timeline */}
        <RefundProgressTracker currentStageIndex={statusDetails.currentStageIndex} />

        {/* Need Help / Support Card */}
        <View style={styles.supportCard}>
          <View style={styles.supportIconBox}>
            <Ionicons name="headset-outline" size={22} color={BrandColors.PRIMARY_ORANGE} />
          </View>
          <View style={styles.supportTextBox}>
            <Text style={styles.supportTitle}>Need Assistance?</Text>
            <Text style={styles.supportSubtitle}>
              Our tax support desk is available Monday to Saturday, 9 AM to 7 PM IST.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleBackToServices}
          style={styles.homeButton}
        >
          <Ionicons name="home-outline" size={18} color={BrandColors.WHITE} />
          <Text style={styles.homeButtonText}>Back to Tax Services</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TdsRefundStatusScreen;
