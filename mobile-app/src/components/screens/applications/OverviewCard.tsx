/**
 * OverviewCard
 * The four-column summary card at the top of the Applications screen.
 * Shows Total, In Progress, Completed, and Under Verification counts.
 * Tapping a column filters the list below.
 */

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { styles, getOverviewValColor, getOverviewSubStyle } from "@/styles/app/(main)/applications.styles";

export type StatusFilterType =
  | "ALL"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "UNDER_VERIFICATION";

export interface OverviewItem {
  key: StatusFilterType;
  count: number;
  label: string;
  color: string;
  isAll?: boolean;
}

interface OverviewCardProps {
  items: OverviewItem[];
  statusFilter: StatusFilterType;
  selectedCategory: string;
  isDark: boolean;
  colors: ReturnType<typeof useTheme>;
  onSelect: (key: StatusFilterType) => void;
  cardBg: string;
  cardBorder: string;
}

export function OverviewCard({
  items,
  statusFilter,
  selectedCategory,
  isDark,
  colors,
  onSelect,
  cardBg,
  cardBorder,
}: OverviewCardProps) {
  return (
    <View style={[styles.overviewCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      {items.map((item, idx) => {
        const isSelected = item.isAll
          ? statusFilter === "ALL" && selectedCategory === "ALL"
          : statusFilter === item.key;

        return (
          <React.Fragment key={item.key}>
            {idx > 0 && (
              <View
                style={[
                  styles.overviewDivider,
                  { backgroundColor: isDark ? colors.border : "#F1F5F9" },
                ]}
              />
            )}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                onSelect(
                  statusFilter === item.key && item.key !== "ALL" ? "ALL" : item.key
                )
              }
              style={[
                styles.overviewCol,
                isSelected &&
                  (isDark
                    ? { backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#FF5722" }
                    : styles.activeOverviewCol),
              ]}
            >
              <Text style={[styles.overviewVal, getOverviewValColor(isSelected, isDark, item)]}>
                {item.count}
              </Text>
              <Text style={[styles.overviewSub, getOverviewSubStyle(isSelected, isDark, colors)]}>
                {item.label}
              </Text>
              <View
                style={
                  isSelected
                    ? styles.activeOverviewIndicator
                    : styles.inactiveOverviewIndicator
                }
              />
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
}
