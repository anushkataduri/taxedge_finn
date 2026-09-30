import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../hooks/use-theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { useResponsive } from "../../hooks/use-responsive";
import { useApplicationStore } from "../../store/applicationStore";
import { useNotificationStore } from "../../store/notificationStore";
import { SCREEN_BOTTOM_PADDING } from "../../components/ScreenLayout";
import type { Application, ServiceCategoryId } from "../../types/domain";
import { styles } from "../../styles/app/(main)/applications.styles";
import { ApplicationCardItem } from "@/components/screens/applications/ApplicationCardItem";
import { OverviewCard, type StatusFilterType, type OverviewItem } from "@/components/screens/applications/OverviewCard";
import { CategoryTabsRow } from "@/components/screens/applications/CategoryTabsRow";

// ── Category & Status matchers ────────────────────────────────────────────────

const CATEGORY_MATCHERS: Record<string, (app: Application) => boolean> = {
  GST: (app) =>
    (app.category || "").toUpperCase() === "GST" ||
    (app.serviceId || "").toLowerCase().startsWith("gst"),
  ITR: (app) => {
    const cat = (app.category || "").toUpperCase();
    const sid = (app.serviceId || "").toLowerCase();
    return (
      cat === "ITR" ||
      ["itr-filing", "tds-refund", "previous-year-itr", "revised-itr", "tax-notice-assistance"].includes(sid)
    );
  },
  LOANS: (app) =>
    (app.category || "").toUpperCase() === "LOANS" ||
    (app.serviceId || "").toLowerCase().startsWith("loan"),
  BUSINESS: (app) => {
    const cat = (app.category || "").toUpperCase();
    const sid = (app.serviceId || "").toLowerCase();
    return cat === "BUSINESS" || sid.startsWith("business") || sid.startsWith("company");
  },
  INSURANCE: (app) =>
    (app.category || "").toUpperCase() === "INSURANCE" ||
    (app.serviceId || "").toLowerCase().startsWith("insurance"),
};

const STATUS_FILTER_MATCHERS: Record<StatusFilterType, (status: string) => boolean> = {
  ALL:                () => true,
  IN_PROGRESS:        (s) => s.includes("progress") || (!s.includes("complete") && !s.includes("approved") && !s.includes("verification") && !s.includes("reject")),
  COMPLETED:          (s) => s.includes("complete") || s.includes("approved") || s.includes("disbursed"),
  UNDER_VERIFICATION: (s) => s.includes("verification") || s.includes("review"),
};

function getResumeRoute(app: Application): any {
  return app.formData?.resumeRoute
    ? app.formData.resumeRoute
    : app.serviceId === "tds-refund"
      ? "/service/tds-form"
      : `/service/${app.serviceId || "itr"}`;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ApplicationsScreen() {
  const colors  = useTheme();
  const isDark  = useColorScheme() === "dark";
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  useResponsive();

  const applications    = useApplicationStore((s) => s.applications);
  const isLoading       = useApplicationStore((s) => s.isLoading);
  const error           = useApplicationStore((s) => s.error);
  const loadApplications = useApplicationStore((s) => s.loadApplications);
  const unreadCount     = useNotificationStore((s) => s.unreadCount);

  const [refreshing,        setRefreshing]        = useState(false);
  const [selectedCategory,  setSelectedCategory]  = useState<"ALL" | ServiceCategoryId>("ALL");
  const [statusFilter,      setStatusFilter]      = useState<StatusFilterType>("ALL");

  const fetchApplications = useCallback(async () => {
    try { await loadApplications(); } catch {}
  }, [loadApplications]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);
  useFocusEffect(useCallback(() => { fetchApplications(); }, [fetchApplications]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await loadApplications(); } catch {} finally { setRefreshing(false); }
  }, [loadApplications]);

  // ── Derived counts ──────────────────────────────────────────────────────────

  const totalCount            = applications.length;
  const inProgressCount       = useMemo(() => applications.filter((a) => STATUS_FILTER_MATCHERS.IN_PROGRESS((a.status || "").toLowerCase())).length, [applications]);
  const completedCount        = useMemo(() => applications.filter((a) => STATUS_FILTER_MATCHERS.COMPLETED((a.status || "").toLowerCase())).length, [applications]);
  const underVerificationCount = useMemo(() => applications.filter((a) => STATUS_FILTER_MATCHERS.UNDER_VERIFICATION((a.status || "").toLowerCase())).length, [applications]);

  const filteredApplications = useMemo(
    () =>
      applications
        .filter((app) => {
          const matchesCategory =
            selectedCategory === "ALL" ||
            Boolean(CATEGORY_MATCHERS[selectedCategory]?.(app));
          const matchesStatus = STATUS_FILTER_MATCHERS[statusFilter]((app.status || "").toLowerCase());
          return matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        }),
    [applications, selectedCategory, statusFilter]
  );

  const overviewItems: OverviewItem[] = [
    { key: "ALL",                count: totalCount,             label: "Total\nApplications",  color: isDark ? colors.text : "#083B75", isAll: true },
    { key: "IN_PROGRESS",        count: inProgressCount,        label: "In Progress",          color: "#EA580C" },
    { key: "COMPLETED",          count: completedCount,         label: "Completed",            color: isDark ? colors.text : "#083B75" },
    { key: "UNDER_VERIFICATION", count: underVerificationCount, label: "Under\nVerification",  color: "#EA580C" },
  ];

  const handleApplicationPress = useCallback((item: Application) => {
    const isDraft = item.status === "Draft" || Boolean(item.formData?.isDraft);
    isDraft
      ? router.push(getResumeRoute(item))
      : (useApplicationStore.getState().setSelectedApplicationId(item.id),
         router.push(`/application/${item.id}`));
  }, [router]);

  const cardBg     = isDark ? colors.backgroundElement : "#FFFFFF";
  const cardBorder = isDark ? colors.border : "#F1F5F9";

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : "#F8FAFC" }]}>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#0A2346" />

      {/* Navy header */}
      <View style={[styles.navyHeader, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>My Applications</Text>
            <Text style={styles.headerSubtitle}>Track all your service applications</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/notifications")}
            style={styles.bellButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications" size={24} color="#FF5722" />
            {unreadCount > 0 && <View style={styles.bellDotBadge} />}
          </TouchableOpacity>
        </View>

        {/* Category tabs */}
        <CategoryTabsRow
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {/* Scrollable body */}
      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: SCREEN_BOTTOM_PADDING }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FF5722"
            colors={["#FF5722"]}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: isDark ? colors.text : "#0F172A" }]}>
                Application Overview
              </Text>
            </View>

            <OverviewCard
              items={overviewItems}
              statusFilter={statusFilter}
              selectedCategory={selectedCategory}
              isDark={isDark}
              colors={colors}
              onSelect={setStatusFilter}
              cardBg={cardBg}
              cardBorder={cardBorder}
            />

            <View style={styles.recentHeaderRow}>
              <Text style={[styles.sectionTitle, { color: isDark ? colors.text : "#0F172A" }]}>
                Recent Applications
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          isLoading && applications.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF5722" />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading applications...
              </Text>
            </View>
          ) : error && applications.length === 0 ? (
            <View style={[styles.errorContainer, { backgroundColor: cardBg, borderColor: isDark ? colors.border : "#FEE2E2" }]}>
              <Ionicons name="alert-circle-outline" size={44} color="#EA580C" />
              <Text style={[styles.errorTitle, { color: isDark ? colors.text : "#0F172A" }]}>
                Failed to load applications
              </Text>
              <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={fetchApplications} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="folder-open-outline"
                size={48}
                color={colors.textSecondary}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {applications.length === 0 ? "No applications yet" : "No applications match this filter"}
              </Text>
              {applications.length === 0 && (
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                  Your real-time submitted applications will appear here
                </Text>
              )}
            </View>
          )
        }
        renderItem={({ item }) => (
          <ApplicationCardItem
            item={item}
            isDark={isDark}
            textColor={isDark ? colors.text : "#0F172A"}
            borderColor={cardBorder}
            bgColor={cardBg}
            onPress={handleApplicationPress}
          />
        )}
      />
    </View>
  );
}
