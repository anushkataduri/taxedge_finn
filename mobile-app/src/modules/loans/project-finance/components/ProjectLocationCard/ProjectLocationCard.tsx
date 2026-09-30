import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ProjectLocationForm } from "../../types/projectFinance.types";
import {
  INDIAN_STATES,
  CITIES_BY_STATE,
  PROJECT_ZONES,
} from "../../data/projectFinanceData";
import { OptionPickerModal } from "../OptionPickerModal";
import { styles } from "./ProjectLocationCard.styles";

interface ProjectLocationCardProps {
  data: ProjectLocationForm;
  onChange: (field: keyof ProjectLocationForm, value: any) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ProjectLocationCard: React.FC<ProjectLocationCardProps> = ({
  data,
  onChange,
  isExpanded,
  onToggleExpand,
}) => {
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    field: keyof ProjectLocationForm | null;
  }>({
    visible: false,
    title: "",
    options: [],
    field: null,
  });

  const openPicker = (
    title: string,
    options: string[],
    field: keyof ProjectLocationForm
  ) => {
    setModalConfig({ visible: true, title, options, field });
  };

  const handleSelectOption = (value: string) => {
    if (modalConfig.field) {
      onChange(modalConfig.field, value);
      if (modalConfig.field === "state") {
        onChange("district", "");
      }
    }
    setModalConfig({ visible: false, title: "", options: [], field: null });
  };

  const districtOptions = data.state
    ? CITIES_BY_STATE[data.state] || ["District 1", "District 2"]
    : ["Select State First"];

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
            <Ionicons name="location-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>1. Project Location</Text>
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
          {/* Project Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Project Address <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter project address"
              placeholderTextColor="#94A3B8"
              value={data.projectAddress}
              onChangeText={(text) => onChange("projectAddress", text)}
            />
          </View>

          {/* State */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              State <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => openPicker("Select State", INDIAN_STATES, "state")}
            >
              <Text
                style={data.state ? styles.pickerText : styles.placeholderText}
              >
                {data.state || "Select state"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* District */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              District <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("Select District", districtOptions, "district")
              }
            >
              <Text
                style={
                  data.district ? styles.pickerText : styles.placeholderText
                }
              >
                {data.district || "Select district"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* PIN Code */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              PIN Code <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter PIN code"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={6}
              value={data.pinCode}
              onChangeText={(text) => onChange("pinCode", text)}
            />
          </View>

          {/* Project Zone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Project Zone <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("Select Project Zone", PROJECT_ZONES, "projectZone")
              }
            >
              <Text
                style={
                  data.projectZone ? styles.pickerText : styles.placeholderText
                }
              >
                {data.projectZone || "Select zone"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Nearest Town / City */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Nearest Town / City <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter town / city"
              placeholderTextColor="#94A3B8"
              value={data.nearestTown}
              onChangeText={(text) => onChange("nearestTown", text)}
            />
          </View>

          {/* Distance */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Distance from Nearest Town (km)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter distance"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={data.distanceFromTown}
              onChangeText={(text) => onChange("distanceFromTown", text)}
            />
          </View>
        </View>
      )}

      {/* Reusable Option Picker Modal */}
      <OptionPickerModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        options={modalConfig.options}
        onSelect={handleSelectOption}
        onClose={() =>
          setModalConfig({ visible: false, title: "", options: [], field: null })
        }
      />
    </View>
  );
};

export default ProjectLocationCard;
