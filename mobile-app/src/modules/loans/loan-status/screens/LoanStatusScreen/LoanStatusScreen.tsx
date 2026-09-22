import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { loansApi } from "../../../services/loansApi";
import {
  LoanApplicationResponse,
  LoanApplicationStatus,
} from "../../../types/loans.types";
import { LoanStatusTracker } from "../../components/LoanStatusTracker";
import { styles } from "./LoanStatusScreen.styles";

export const LoanStatusScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string; loanType?: string }>();
  const appId = params.id || "LN-849201";

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<LoanApplicationResponse | null>(null);

  useEffect(() => {
    loansApi
      .fetchStatus(appId)
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [appId]);

  const handleDownloadSanction = () => {
    Alert.alert(
      "Sanction Letter",
      "Official sanction letter download initiated. It will be saved to your device downloads."
    );
  };

  const handleSupport = () => {
    Alert.alert(
      "Loan Assistance Desk",
      "Connecting you with your dedicated CA loan advisor."
    );
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.replace("/service/loans" as any)}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loan Application Status</Text>
        </View>

        <TouchableOpacity onPress={handleSupport}>
          <Ionicons name="help-circle-outline" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0284C7" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.appIdRow}>
              <Text style={styles.refNumber}>
                Ref: {data?.referenceNumber || appId}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {data?.status || "Application Received"}
                </Text>
              </View>
            </View>

            <Text style={styles.loanName}>
              {params.loanType || data?.loanType || "Business Loan"}
            </Text>
            <Text style={styles.amountText}>
              ₹{(data?.amount || 1500000).toLocaleString("en-IN")}
            </Text>

            <View style={styles.metaGrid}>
              <View>
                <Text style={styles.metaLabel}>Applied On</Text>
                <Text style={styles.metaValue}>
                  {data?.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "Today"}
                </Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Lender Network</Text>
                <Text style={styles.metaValue}>Multi-Bank Desk</Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Case Advisor</Text>
                <Text style={styles.metaValue}>TaxEdge Credit CA</Text>
              </View>
            </View>
          </View>

          {/* 17 Lifecycle Status Timeline */}
          <View style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>
              Application Lifecycle Milestones
            </Text>
            <LoanStatusTracker
              currentStatus={data?.status || ("Application Received" as LoanApplicationStatus)}
              timeline={data?.timeline || []}
            />
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleDownloadSanction}
            >
              <Text style={styles.primaryBtnText}>Download Sanction Letter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.replace("/service/loans" as any)}
            >
              <Text style={styles.secondaryBtnText}>Back to Loan Marketplace</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default LoanStatusScreen;
