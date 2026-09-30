import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ProjectClassificationForm } from "../../types/projectFinance.types";
import {
  PROJECT_SECTORS,
  SUB_SECTORS,
  PROJECT_TYPES,
  DEVELOPMENT_CATEGORIES,
} from "../../data/projectFinanceData";
import { OptionPickerModal } from "../OptionPickerModal";
import { styles } from "./ProjectClassificationCard.styles";

interface ProjectClassificationCardProps {
  data: ProjectClassificationForm;
  onChange: (field: keyof ProjectClassificationForm, value: any) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ProjectClassificationCard: React.FC<
  ProjectClassificationCardProps
> = ({ data, onChange, isExpanded, onToggleExpand }) => {
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    field: keyof ProjectClassificationForm | null;
  }>({
    visible: false,
    title: "",
    options: [],
    field: null,
  });

  const openPicker = (
    title: string,
    options: string[],
    field: keyof ProjectClassificationForm
  ) => {
    setModalConfig({ visible: true, title, options, field });
  };

  const handleSelectOption = (value: string) => {
    if (modalConfig.field) {
      onChange(modalConfig.field, value);
      if (modalConfig.field === "projectSector") {
        onChange("projectSubSector", "");
      }
    }
    setModalConfig({ visible: false, title: "", options: [], field: null });
  };

  const subSectorOptions = data.projectSector
    ? SUB_SECTORS[data.projectSector] || ["General Infrastructure"]
    : ["Select Sector First"];

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
            <Ionicons name="document-text-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>Project Classification</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748B"
        />
      </TouchableOpacity>

      {/* Body - Line by Line */}
      {isExpanded && (
        <View style={styles.cardBody}>
          {/* Project Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Project Name <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter project name"
              placeholderTextColor="#94A3B8"
              value={data.projectName}
              onChangeText={(text) => onChange("projectName", text)}
            />
          </View>

          {/* Project Sector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Project Sector <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("Select Project Sector", PROJECT_SECTORS, "projectSector")
              }
            >
              <Text
                style={
                  data.projectSector ? styles.pickerText : styles.placeholderText
                }
                numberOfLines={1}
              >
                {data.projectSector || "Select sector"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Project Sub-Sector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Project Sub-Sector <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker(
                  "Select Sub-Sector",
                  subSectorOptions,
                  "projectSubSector"
                )
              }
            >
              <Text
                style={
                  data.projectSubSector
                    ? styles.pickerText
                    : styles.placeholderText
                }
                numberOfLines={1}
              >
                {data.projectSubSector || "Select sub-sector"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Project Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Project Type <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("Select Project Type", PROJECT_TYPES, "projectType")
              }
            >
              <Text
                style={
                  data.projectType ? styles.pickerText : styles.placeholderText
                }
                numberOfLines={1}
              >
                {data.projectType || "Select project type"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Greenfield / Expansion / Modernization */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Greenfield / Expansion / Modernization{" "}
              <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker(
                  "Select Development Option",
                  DEVELOPMENT_CATEGORIES,
                  "developmentCategory"
                )
              }
            >
              <Text
                style={
                  data.developmentCategory
                    ? styles.pickerText
                    : styles.placeholderText
                }
                numberOfLines={1}
              >
                {data.developmentCategory || "Select option"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
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

export default ProjectClassificationCard;
