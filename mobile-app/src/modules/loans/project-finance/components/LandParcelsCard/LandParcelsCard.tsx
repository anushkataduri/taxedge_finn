import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LandParcelItem } from "../../types/projectFinance.types";
import {
  LAND_OWNERSHIP_OPTIONS,
  ACQUISITION_STATUS_OPTIONS,
  TITLE_STATUS_OPTIONS,
  ENCUMBRANCE_OPTIONS,
} from "../../data/projectFinanceData";
import { OptionPickerModal } from "../OptionPickerModal";
import { styles } from "./LandParcelsCard.styles";

interface LandParcelsCardProps {
  parcels: LandParcelItem[];
  onAddParcel: () => void;
  onUpdateParcel: (id: string, field: keyof LandParcelItem, value: any) => void;
  onDeleteParcel: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const LandParcelsCard: React.FC<LandParcelsCardProps> = ({
  parcels,
  onAddParcel,
  onUpdateParcel,
  onDeleteParcel,
  isExpanded,
  onToggleExpand,
}) => {
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    options: string[];
    parcelId: string | null;
    field: keyof LandParcelItem | null;
  }>({
    visible: false,
    title: "",
    options: [],
    parcelId: null,
    field: null,
  });

  const openPicker = (
    title: string,
    options: string[],
    parcelId: string,
    field: keyof LandParcelItem
  ) => {
    setModalConfig({ visible: true, title, options, parcelId, field });
  };

  const handleSelectOption = (value: string) => {
    if (modalConfig.parcelId && modalConfig.field) {
      onUpdateParcel(modalConfig.parcelId, modalConfig.field, value);
    }
    setModalConfig({ visible: false, title: "", options: [], parcelId: null, field: null });
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={onToggleExpand}
          activeOpacity={0.7}
        >
          <View style={styles.iconBadge}>
            <Ionicons name="grid-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>3. Land Parcels</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addParcelBtn} onPress={onAddParcel}>
          <Text style={styles.addParcelText}>+ Add Land Parcel</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {isExpanded && (
        <View style={styles.cardBody}>
          {parcels.map((parcel, index) => (
            <View key={parcel.id} style={styles.parcelBox}>
              <View style={styles.parcelHeader}>
                <Text style={styles.parcelTitle}>Parcel {index + 1}</Text>
                {parcels.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => onDeleteParcel(parcel.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Survey / Plot Number */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Survey / Plot Number <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter survey number"
                  placeholderTextColor="#94A3B8"
                  value={parcel.surveyPlotNumber}
                  onChangeText={(val) =>
                    onUpdateParcel(parcel.id, "surveyPlotNumber", val)
                  }
                />
              </View>

              {/* Area (Acres) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Area (Acres) <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter area"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={parcel.areaAcres}
                  onChangeText={(val) =>
                    onUpdateParcel(parcel.id, "areaAcres", val)
                  }
                />
              </View>

              {/* Ownership */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Ownership <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.pickerContainer}
                  onPress={() =>
                    openPicker(
                      "Select Ownership",
                      LAND_OWNERSHIP_OPTIONS,
                      parcel.id,
                      "ownership"
                    )
                  }
                >
                  <Text
                    style={
                      parcel.ownership
                        ? styles.pickerText
                        : styles.placeholderText
                    }
                  >
                    {parcel.ownership || "Select ownership"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Acquisition Status */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Acquisition Status <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.pickerContainer}
                  onPress={() =>
                    openPicker(
                      "Select Status",
                      ACQUISITION_STATUS_OPTIONS,
                      parcel.id,
                      "acquisitionStatus"
                    )
                  }
                >
                  <Text
                    style={
                      parcel.acquisitionStatus
                        ? styles.pickerText
                        : styles.placeholderText
                    }
                  >
                    {parcel.acquisitionStatus || "Select status"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Title Status */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Title Status <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.pickerContainer}
                  onPress={() =>
                    openPicker(
                      "Select Title Status",
                      TITLE_STATUS_OPTIONS,
                      parcel.id,
                      "titleStatus"
                    )
                  }
                >
                  <Text
                    style={
                      parcel.titleStatus
                        ? styles.pickerText
                        : styles.placeholderText
                    }
                  >
                    {parcel.titleStatus || "Select title status"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Encumbrance */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Encumbrance <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.pickerContainer}
                  onPress={() =>
                    openPicker(
                      "Select Encumbrance",
                      ENCUMBRANCE_OPTIONS,
                      parcel.id,
                      "encumbrance"
                    )
                  }
                >
                  <Text
                    style={
                      parcel.encumbrance
                        ? styles.pickerText
                        : styles.placeholderText
                    }
                  >
                    {parcel.encumbrance || "Select encumbrance"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Reusable Option Picker Modal */}
      <OptionPickerModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        options={modalConfig.options}
        onSelect={handleSelectOption}
        onClose={() =>
          setModalConfig({ visible: false, title: "", options: [], parcelId: null, field: null })
        }
      />
    </View>
  );
};

export default LandParcelsCard;
