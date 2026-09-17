import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { styles, getWebInputStyle } from "./TaxNoticeDatePickerInput.styles";

export interface TaxNoticeDatePickerInputProps {
  label: string;
  value: string;
  onChange: (formattedDate: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  helperText?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDateToString(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = MONTHS[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export function parseStringToDate(str?: string): Date {
  if (!str) return new Date();
  const parts = str.trim().split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTHS.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export const TaxNoticeDatePickerInput: React.FC<TaxNoticeDatePickerInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder = "Select date",
  helperText,
  maximumDate,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const currentDate = parseStringToDate(value);

  const handleNativeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      onChange(formatDateToString(selectedDate));
    }
    if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  // Web platform rendering
  if (Platform.OS === "web") {
    const formatForWebInput = (date: Date): string => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    const handleWebChange = (e: any) => {
      const val = e.target.value;
      if (val) {
        const [y, m, d] = val.split("-").map(Number);
        const newDate = new Date(y, m - 1, d);
        onChange(formatDateToString(newDate));
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <View style={[styles.inputBox, error ? styles.inputBoxError : null]}>
          {/* @ts-ignore - Web native date input */}
          <input
            type="date"
            defaultValue={value ? formatForWebInput(currentDate) : ""}
            onChange={handleWebChange}
            style={getWebInputStyle()}
          />
          <Ionicons name="calendar-outline" size={20} color="#0B1F3A" />
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}
      </View>
    );
  }

  // Native iOS & Android rendering
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.requiredStar}>*</Text>}
      </Text>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setShowPicker(true)}
        style={[styles.inputBox, error ? styles.inputBoxError : null]}
      >
        <Text
          style={[
            styles.valueText,
            !value ? styles.placeholderText : null,
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#0B1F3A" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleNativeChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

export default TaxNoticeDatePickerInput;
