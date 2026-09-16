import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { ItrCategoryType } from "../../types/itrFiling.types";
import { styles } from "./Step0CategorySelect.styles";

interface Step0CategorySelectProps {
  selectedCategory: ItrCategoryType | null;
  accountType?: string;
  onSelectCategory: (category: ItrCategoryType) => void;
  onStartApplication: () => void;
}

interface CategoryOption {
  id: ItrCategoryType;
  title: string;
  subtitle: string;
  formBadge: string;
  iconName: keyof typeof Ionicons.glyphMap;
  disallowedAccountTypes?: string[];
}

const ALL_CATEGORIES: CategoryOption[] = [
  {
    id: "salaried",
    title: "Salaried",
    subtitle: "Form 16 available",
    formBadge: "ITR-1",
    iconName: "person-outline",
    disallowedAccountTypes: [
      "Proprietorship",
      "Partnership",
      "LLP",
      "Private Limited",
      "Public Limited",
      "HUF",
    ],
  },
  {
    id: "business",
    title: "Business Income",
    subtitle: "Proprietor / Business",
    formBadge: "ITR-3/4",
    iconName: "storefront-outline",
  },
  {
    id: "professional",
    title: "Professional",
    subtitle: "Doctor, Lawyer, CA etc.",
    formBadge: "ITR-3",
    iconName: "medkit-outline",
    disallowedAccountTypes: ["Private Limited", "Public Limited", "HUF"],
  },
  {
    id: "freelancer",
    title: "Freelancer",
    subtitle: "Independent Contractor",
    formBadge: "ITR-3/4",
    iconName: "laptop-outline",
    disallowedAccountTypes: [
      "Partnership",
      "LLP",
      "Private Limited",
      "Public Limited",
      "HUF",
    ],
  },
  {
    id: "trader_investor",
    title: "Trader / Investor",
    subtitle: "Stock & F&O Trading",
    formBadge: "ITR-3",
    iconName: "trending-up-outline",
  },
  {
    id: "rental",
    title: "Rental Income",
    subtitle: "House / Property Income",
    formBadge: "ITR-1/2",
    iconName: "home-outline",
    disallowedAccountTypes: [
      "Partnership",
      "LLP",
      "Private Limited",
      "Public Limited",
    ],
  },
  {
    id: "capital_gains",
    title: "Capital Gains",
    subtitle: "Property / Shares / MF",
    formBadge: "ITR-2",
    iconName: "document-text-outline",
  },
  {
    id: "multiple",
    title: "Multiple Sources",
    subtitle: "Salary + Business etc.",
    formBadge: "ITR-2/3",
    iconName: "link-outline",
  },
];

export const Step0CategorySelect: React.FC<Step0CategorySelectProps> = ({
  selectedCategory,
  accountType = "Individual",
  onSelectCategory,
  onStartApplication,
}) => {
  // Pure functional filtering based on accountType
  const visibleCategories = useMemo(() => {
    return ALL_CATEGORIES.filter((cat) => {
      if (!cat.disallowedAccountTypes) return true;
      return !cat.disallowedAccountTypes.includes(accountType);
    });
  }, [accountType]);

  // Ensure an active category is always selected
  const currentSelected = useMemo(() => {
    if (selectedCategory && visibleCategories.some((c) => c.id === selectedCategory)) {
      return selectedCategory;
    }
    return visibleCategories[0]?.id || "salaried";
  }, [selectedCategory, visibleCategories]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card (Replicating Image 1) */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerIconBox}>
              <Ionicons name="calculator-outline" size={24} color={BrandColors.PRIMARY_ORANGE} />
            </View>
            <View style={styles.headerTitleCol}>
              <Text style={styles.headerTitle}>ITR Filing</Text>
              <Text style={styles.headerCategoryTag}>ITR CATEGORY</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            We'll recommend the right ITR form for you.
          </Text>

          {/* Account Type context notice */}
          <View style={styles.accountTypeRow}>
            <View style={styles.accountTypeBadge}>
              <Ionicons name="shield-outline" size={12} color="#1D4ED8" />
              <Text style={styles.accountTypeBadgeText}>{accountType}</Text>
            </View>
            <Text style={styles.accountTypeNotice}>
              Categories customized for your legal account type
            </Text>
          </View>
        </View>

        {/* 2-Column Grid */}
        <View style={styles.gridContainer}>
          {visibleCategories.map((cat) => {
            const isSelected = currentSelected === cat.id;

            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => onSelectCategory(cat.id)}
              >
                {/* Top Right Checkmark when selected */}
                {isSelected && (
                  <View style={styles.cardCheckmarkBox}>
                    <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                  </View>
                )}

                {/* Card Icon */}
                <View
                  style={[
                    styles.cardIconBox,
                    isSelected && styles.cardIconBoxSelected,
                  ]}
                >
                  <Ionicons
                    name={cat.iconName}
                    size={20}
                    color={isSelected ? BrandColors.PRIMARY_ORANGE : "#083B75"}
                  />
                </View>

                {/* Card Titles */}
                <View>
                  <Text
                    style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}
                    numberOfLines={1}
                  >
                    {cat.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardSubtitle,
                      isSelected && styles.cardSubtitleSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {cat.subtitle}
                  </Text>
                </View>

                {/* Form Badge */}
                <View
                  style={[styles.formTag, isSelected && styles.formTagSelected]}
                >
                  <Text
                    style={[
                      styles.formTagText,
                      isSelected && styles.formTagTextSelected,
                    ]}
                  >
                    {cat.formBadge}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Start Application Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.startBtn}
          onPress={onStartApplication}
        >
          <Text style={styles.startBtnText}>Start Application</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Step0CategorySelect;
