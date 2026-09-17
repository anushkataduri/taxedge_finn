import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { useApplicationStore } from "@/store/applicationStore";
import { styles } from "../screens/GstCancellationScreen/GstCancellationScreen.styles";

interface GstCancellationSuccessProps {
  submissionResult: any;
  gstin: string;
  cancellationDate: string;
}

export function GstCancellationSuccess({ submissionResult, gstin, cancellationDate }: GstCancellationSuccessProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
    return (
      <View style={styles.successContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={BrandColors.PRIMARY_BLUE}
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.successHero, { paddingTop: insets.top + 32 }]}>
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
                c: BrandColors.PRIMARY_BLUE,
              },
              { k: "GSTIN", v: gstin },
              { k: "Submission Date", v: submissionResult.date },
              { k: "Effective Date", v: cancellationDate },
              { k: "Current Status", v: "Submitted", c: "#16A34A" },
            ].map((row, i) => (
              <React.Fragment key={row.k}>
                {i > 0 && <View style={styles.successDivider} />}
                <View style={styles.successRow}>
                  <Text style={styles.successRowKey}>{row.k}</Text>
                  <Text
                    style={[
                      styles.successRowVal,
                      row.c ? { color: row.c } : null,
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
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => {
              useApplicationStore
                .getState()
                .setSelectedApplicationId(submissionResult.appId);
              router.push(`/application/${submissionResult.appId}`);
            }}
          >
            <Text style={styles.primaryBtnText}>Track Cancellation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/(main)/applications")}
          >
            <Text style={styles.secondaryBtnText}>My Application</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  
}
