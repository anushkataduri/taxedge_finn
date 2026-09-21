/**
 * Component: RequestTypeSection
 * Migrated from internal StyleSheet to external styles module.
 * Uses shared design tokens from src/shared/theme.ts.
 */

import { StyleSheet } from "react-native";
import { BrandColors } from "@/shared/theme";

export const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  optionalTag: {
    fontSize: 12,
    fontWeight: "400",
  },
  star: {
    color: "#EF4444",
  },
  textInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    fontSize: 14.5,
  },
  textAreaInput: {
    minHeight: 84,
    borderRadius: 12,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 6,
    fontWeight: "500",
  },
});

export const getSectionHeaderColor = (isDark: boolean) => ({
  color: isDark ? "#F8FAFC" : "#0F172A",
});
