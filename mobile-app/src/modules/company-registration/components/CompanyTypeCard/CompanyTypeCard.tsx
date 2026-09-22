import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../design-system/colors";
import { formatCurrencyINR } from "../../../../shared/formatters/currencyFormatter";
import type { CompanyTypeOption } from "../../services/companyRegistrationService";
import { styles } from "./CompanyTypeCard.styles";

export interface CompanyTypeCardProps {
  item: CompanyTypeOption;
  selected: boolean;
  onSelect: (item: CompanyTypeOption) => void;
}

export const CompanyTypeCard: React.FC<CompanyTypeCardProps> = ({
  item,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(item)}
      style={[
        styles.card,
        selected && styles.cardSelected,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Ionicons
          name={selected ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={selected ? BrandColors.PRIMARY_ORANGE : BrandColors.TEXT_MUTED}
        />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={BrandColors.TEXT_SECONDARY} />
          <Text style={styles.metaText}>{item.timeline}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color={BrandColors.TEXT_SECONDARY} />
          <Text style={styles.metaText}>Min {item.minMembers} Members</Text>
        </View>
        <Text style={styles.feeText}>{formatCurrencyINR(item.fee)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CompanyTypeCard;
