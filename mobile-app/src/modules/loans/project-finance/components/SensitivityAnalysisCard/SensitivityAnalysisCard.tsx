import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SensitivityAnalysisForm } from "../../types/projectFinance.types";
import { SENSITIVITY_SCENARIOS } from "../../data/projectFinanceData";
import { styles } from "./SensitivityAnalysisCard.styles";

interface SensitivityAnalysisCardProps {
  data: SensitivityAnalysisForm;
  onChange: (field: keyof SensitivityAnalysisForm, value: any) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const SensitivityAnalysisCard: React.FC<SensitivityAnalysisCardProps> = ({
  data,
  onChange,
  isExpanded,
  onToggleExpand,
}) => {
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    field: keyof SensitivityAnalysisForm | null;
  }>({
    visible: false,
    title: "",
    options: [],
    field: null,
  });

  const openPicker = (
    title: string,
    options: string[],
    field: keyof SensitivityAnalysisForm
  ) => {
    setModalConfig({ visible: true, title, options, field });
  };

  const handleSelectOption = (value: string) => {
    if (modalConfig.field) {
      onChange(modalConfig.field, value);
    }
    setModalConfig({ visible: false, title: "", options: [], field: null });
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
            <Ionicons name="pie-chart-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>5. Sensitivity Analysis (Optional)</Text>
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
            Specify key assumptions for sensitivity analysis.
          </Text>

          {/* Scenario */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Scenario</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("Select Scenario", SENSITIVITY_SCENARIOS, "scenario")
              }
            >
              <Text
                style={
                  data.scenario ? styles.pickerText : styles.placeholderText
                }
              >
                {data.scenario || "Select scenario"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Volume Change (%) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Volume Change (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter percentage"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.volumeChangePercent}
              onChangeText={(text) => onChange("volumeChangePercent", text)}
            />
          </View>

          {/* Price Change (%) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Price Change (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter percentage"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.priceChangePercent}
              onChangeText={(text) => onChange("priceChangePercent", text)}
            />
          </View>

          {/* Revenue Impact (%) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Revenue Impact (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Auto calculated"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.revenueImpactPercent}
              onChangeText={(text) => onChange("revenueImpactPercent", text)}
            />
          </View>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={modalConfig.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalConfig({ visible: false, title: "", options: [], field: null })
        }
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            justifyContent: "flex-end",
          }}
          onPress={() =>
            setModalConfig({ visible: false, title: "", options: [], field: null })
          }
        >
          <Pressable
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "60%",
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#0F172A",
                marginBottom: 12,
              }}
            >
              {modalConfig.title}
            </Text>
            <FlatList
              data={modalConfig.options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F1F5F9",
                  }}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={{ fontSize: 14, color: "#1E293B" }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default SensitivityAnalysisCard;
