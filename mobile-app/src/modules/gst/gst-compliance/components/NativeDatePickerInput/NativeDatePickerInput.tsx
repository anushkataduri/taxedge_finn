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
import { useTheme } from "@/shared/hooks/useTheme";
import {
  styles,
  getLabelThemeStyle,
  getInputBoxThemeStyle,
  getValueTextThemeStyle,
  getWebInputStyle,
} from "./NativeDatePickerInput.styles";

export interface NativeDatePickerInputProps {
  label: string;
  value: string;
  onChange: (formattedDate: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDateToString(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = MONTHS[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

function parseStringToDate(str?: string): Date {
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

export const NativeDatePickerInput: React.FC<NativeDatePickerInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder = "Select Date",
}) => {
  const { isDark } = useTheme();
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
  };

  const iconColor = isDark ? "#94A3B8" : "#64748B";

  // For Web platform
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
        <Text style={[styles.label, getLabelThemeStyle(isDark)]}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text>
        <View
          style={[
            styles.inputBox,
            getInputBoxThemeStyle(isDark, Boolean(error)),
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={iconColor}
          />
          {/* @ts-ignore - Web native date input */}
          <input
            type="date"
            defaultValue={value ? formatForWebInput(currentDate) : ""}
            onChange={handleWebChange}
            style={getWebInputStyle(isDark)}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, getLabelThemeStyle(isDark)]}>
        {label} {required && <Text style={styles.star}>*</Text>}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowPicker(true)}
        style={[
          styles.inputBox,
          getInputBoxThemeStyle(isDark, Boolean(error)),
        ]}
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color={iconColor}
        />
        <Text style={[styles.valueText, getValueTextThemeStyle(value, isDark)]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleNativeChange}
          themeVariant={isDark ? "dark" : "light"}
        />
      )}
    </View>
  );
};
