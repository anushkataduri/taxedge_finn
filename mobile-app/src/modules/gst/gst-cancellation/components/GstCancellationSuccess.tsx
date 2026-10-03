import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { useApplicationStore } from "@/store/applicationStore";
import {
  styles,
  getSuccessHeroStyle,
  getSuccessActionsWrapStyle,
} from "../screens/GstCancellationScreen/GstCancellationScreen.styles";

interface GstCancellationSuccessProps {
  submissionResult: {
    arn?: string;
    appId?: string;
    date?: string;
    [key: string]: any;
  };
  gstin: string;
  cancellationDate: string;
}

export function GstCancellationSuccess({
  submissionResult,
  gstin,
  cancellationDate,
}: GstCancellationSuccessProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const { BackHandler } = require("react-native");
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/(main)/home");
      return true;
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.successContainer}>
      <FocusAwareStatusBar
        barStyle="light-content"
        backgroundColor={BrandColors.PRIMARY_BLUE}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.successScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.successHero, getSuccessHeroStyle(insets.top)]}>
          <View style={styles.successHeroIconBox}>
            <View style={styles.successHeroCheckCircle}>
              <Ionicons name="checkmark" size={36} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.successHeroTitle}>Cancellation Submitted</Text>
          <Text style={styles.successHeroSubtitle}>
            Your application Form REG-16 has been initiated successfully.
          </Text>
        </View>
        <View style={styles.successCard}>
          {[
            { k: "Application Type", v: "GST Cancellation" },
            {
              k: "ARN / Reference",
              v: submissionResult.arn,
              isPrimary: true,
            },
            { k: "GSTIN", v: gstin },
            { k: "Submission Date", v: submissionResult.date },
            { k: "Effective Date", v: cancellationDate },
            { k: "Current Status", v: "Submitted", isSuccess: true },
          ].map((row, i) => (
            <React.Fragment key={row.k}>
              {i > 0 && <View style={styles.successDivider} />}
              <View style={styles.successRow}>
                <Text style={styles.successRowKey}>{row.k}</Text>
                <Text
                  style={[
                    styles.successRowVal,
                    row.isPrimary && styles.successRowValPrimary,
                    row.isSuccess && styles.successRowValSuccess,
                  ]}
                >
                  {row.v}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
      <View
        style={[
          styles.successActionsWrap,
          getSuccessActionsWrapStyle(insets.bottom),
        ]}
      >
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => {
            if (submissionResult.appId) {
              useApplicationStore
                .getState()
                .setSelectedApplicationId(submissionResult.appId);
              router.replace(`/application/${submissionResult.appId}`);
            }
          }}
        >
          <Text style={styles.primaryBtnText}>Track Cancellation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/(main)/home')}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={20} color="#FFFFFF" />
          <Text style={styles.homeBtnText}>Go to Home Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => router.replace('/(main)/applications')}
          activeOpacity={0.8}
        >
          <Ionicons name="folder-open-outline" size={20} color="#475569" />
          <Text style={styles.trackBtnText}>Track in My Applications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            styles.secondaryBtnDanger,
          ]}
          activeOpacity={0.85}
          onPress={() => {
            if (submissionResult.appId) {
              useApplicationStore
                .getState()
                .deleteApplication(submissionResult.appId);
            }
            router.replace("/(main)/home");
          }}
        >
          <Text style={[styles.secondaryBtnText, styles.secondaryBtnTextDanger]}>
            Withdraw Cancellation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
