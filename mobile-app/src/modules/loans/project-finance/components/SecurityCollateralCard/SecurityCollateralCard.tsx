import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SecurityCollateralItem } from "../../types/projectFinance.types";
import { SecurityCollateralItemCard } from "./SecurityCollateralItemCard";
import { OptionPickerModal } from "../OptionPickerModal";
import { styles } from "./SecurityCollateralCard.styles";

interface SecurityCollateralCardProps {
  securities: SecurityCollateralItem[];
  onAddSecurity: () => void;
  onUpdateSecurity: (
    id: string,
    field: keyof SecurityCollateralItem,
    value: any
  ) => void;
  onDeleteSecurity: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const SecurityCollateralCard: React.FC<SecurityCollateralCardProps> = ({
  securities,
  onAddSecurity,
  onUpdateSecurity,
  onDeleteSecurity,
  isExpanded,
  onToggleExpand,
}) => {
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    securityId: string;
    field: keyof SecurityCollateralItem | null;
  }>({
    visible: false,
    title: "",
    options: [],
    securityId: "",
    field: null,
  });

  const openPicker = (
    title: string,
    options: string[],
    securityId: string,
    field: keyof SecurityCollateralItem
  ) => {
    setModalConfig({ visible: true, title, options, securityId, field });
  };

  const handleSelectOption = (value: string) => {
    if (modalConfig.field && modalConfig.securityId) {
      onUpdateSecurity(modalConfig.securityId, modalConfig.field, value);
    }
    setModalConfig({
      visible: false,
      title: "",
      options: [],
      securityId: "",
      field: null,
    });
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>1. Security / Collateral</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748B"
        />
      </TouchableOpacity>

      {/* Body */}
      {isExpanded && (
        <View style={styles.cardBody}>
          <Text style={styles.subtitle}>
            Provide details of assets to be offered as security for the loan.
          </Text>

          {securities.map((item, index) => (
            <SecurityCollateralItemCard
              key={item.id}
              item={item}
              index={index}
              totalCount={securities.length}
              onUpdate={(field, value) =>
                onUpdateSecurity(item.id, field, value)
              }
              onDelete={() => onDeleteSecurity(item.id)}
              onOpenPicker={(title, options, field) =>
                openPicker(title, options, item.id, field)
              }
            />
          ))}

          {/* + Add Another Security Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddSecurity}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#F97316" />
            <Text style={styles.addButtonText}>Add Another Security</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reusable Option Picker Modal */}
      <OptionPickerModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        options={modalConfig.options}
        onSelect={handleSelectOption}
        onClose={() =>
          setModalConfig({
            visible: false,
            title: "",
            options: [],
            securityId: "",
            field: null,
          })
        }
      />
    </View>
  );
};

export default SecurityCollateralCard;
