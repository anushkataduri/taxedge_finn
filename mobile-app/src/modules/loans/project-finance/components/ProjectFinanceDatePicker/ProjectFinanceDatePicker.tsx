import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { BrandColors } from "../../../../../shared/theme";
import { styles } from "./ProjectFinanceDatePicker.styles";

interface ProjectFinanceDatePickerProps {
  label?: string;
  value: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
  required?: boolean;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatDate = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const parseDate = (str?: string): Date => {
  if (!str) return new Date();
  const clean = str.trim();
  if (clean.includes("/")) {
    const parts = clean.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }
  if (clean.includes("-")) {
    const parts = clean.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }
  const parts = clean.split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTHS.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }
  const parsed = new Date(clean);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const ProjectFinanceDatePicker: React.FC<
  ProjectFinanceDatePickerProps
> = ({
  label,
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  required = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => parseDate(value));

  const handleOpen = () => {
    setTempDate(parseDate(value));
    setShowPicker(true);
  };

  const handleNativeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      if (Platform.OS === "ios") {
        setTempDate(selectedDate);
      } else {
        onChange(formatDate(selectedDate));
      }
    }
  };

  const handleIosDone = () => {
    onChange(formatDate(tempDate));
    setShowPicker(false);
  };

  const handleTextChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length >= 5) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    onChange(formatted);
  };

  return (
    <View style={styles.fieldGroup}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
      )}

      <View style={styles.dateContainer}>
        <TextInput
          style={styles.inputField}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          maxLength={10}
        />
        <TouchableOpacity
          style={styles.calendarIconButton}
          onPress={handleOpen}
          activeOpacity={0.7}
          accessibilityLabel="Open calendar"
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
          />
        </TouchableOpacity>
      </View>

      {/* Android DateTimePicker */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display="default"
          onChange={handleNativeChange}
        />
      )}

      {/* iOS Modal DateTimePicker */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable
            style={styles.iosModalOverlay}
            onPress={() => setShowPicker(false)}
          >
            <Pressable style={styles.iosPickerContainer}>
              <View style={styles.iosHeader}>
                <Text style={styles.iosTitle}>{label || "Select Date"}</Text>
                <TouchableOpacity onPress={handleIosDone}>
                  <Text style={styles.iosDoneButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleNativeChange}
                textColor="#0F172A"
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

export default ProjectFinanceDatePicker;
