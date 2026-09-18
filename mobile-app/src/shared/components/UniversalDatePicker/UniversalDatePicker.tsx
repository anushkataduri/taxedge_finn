import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
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
} from "./UniversalDatePicker.styles";

export interface UniversalDatePickerProps {
  label?: string;
  value: string;
  onChange: (formattedDate: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  helperText?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  validateMinDate?: string;
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
  const clean = str.trim();

  // Try "DD MMM YYYY"
  const parts = clean.split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTHS.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }

  // Try "DD-MM-YYYY"
  const dashParts = clean.split("-");
  if (dashParts.length === 3 && dashParts[0].length <= 2) {
    const d = parseInt(dashParts[0], 10);
    const m = parseInt(dashParts[1], 10) - 1;
    const y = parseInt(dashParts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      return new Date(y, m, d);
    }
  }

  const parsed = new Date(clean);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export const UniversalDatePicker: React.FC<UniversalDatePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder = "Select Date",
  helperText,
  maximumDate,
  minimumDate,
  validateMinDate,
}) => {
  const { isDark } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [tempIosDate, setTempIosDate] = useState<Date>(() => parseStringToDate(value));

  const effectiveMinDate = minimumDate || (validateMinDate ? parseStringToDate(validateMinDate) : undefined);
  const currentDate = parseStringToDate(value);

  const handleNativeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      if (Platform.OS === "ios") {
        setTempIosDate(selectedDate);
      } else {
        onChange(formatDateToString(selectedDate));
      }
    }
  };

  const handleIosConfirm = () => {
    setShowPicker(false);
    onChange(formatDateToString(tempIosDate));
  };

  const handleIosCancel = () => {
    setShowPicker(false);
  };

  const iconColor = isDark ? "#94A3B8" : "#64748B";

  // Web Platform input
  if (Platform.OS === "web") {
    const formatForWeb = (d: Date): string => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
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
        {label ? (
          <Text style={[styles.label, getLabelThemeStyle(isDark)]}>
            {label} {required && <Text style={styles.star}>*</Text>}
          </Text>
        ) : null}

        <View style={[styles.inputBox, getInputBoxThemeStyle(isDark, !!error)]}>
          <Ionicons name="calendar-outline" size={20} color={iconColor} />
          <input
            type="date"
            value={value ? formatForWeb(currentDate) : ""}
            onChange={handleWebChange}
            min={effectiveMinDate ? formatForWeb(effectiveMinDate) : undefined}
            max={maximumDate ? formatForWeb(maximumDate) : undefined}
            style={getWebInputStyle(isDark)}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {helperText && !error ? <Text style={styles.helperText}>{helperText}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, getLabelThemeStyle(isDark)]}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setTempIosDate(parseStringToDate(value));
          setShowPicker(true);
        }}
        style={[styles.inputBox, getInputBoxThemeStyle(isDark, !!error)]}
      >
        <View style={styles.iconBox}>
          <Ionicons name="calendar-outline" size={17} color="#EA580C" />
        </View>

        <Text
          style={[
            styles.valueText,
            getValueTextThemeStyle(value, isDark),
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>

        <Ionicons name="chevron-down" size={18} color={iconColor} />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {helperText && !error ? <Text style={styles.helperText}>{helperText}</Text> : null}

      {/* Android Picker */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleNativeChange}
          minimumDate={effectiveMinDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS Modal Picker */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleIosCancel}
        >
          <View style={styles.iosModalOverlay}>
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={handleIosCancel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.iosCancelButton}>Cancel</Text>
                </TouchableOpacity>

                <Text style={styles.iosHeaderTitle}>{label || "Select Date"}</Text>

                <TouchableOpacity onPress={handleIosConfirm} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.iosDoneButton}>Done</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempIosDate}
                mode="date"
                display="spinner"
                onChange={handleNativeChange}
                minimumDate={effectiveMinDate}
                maximumDate={maximumDate}
                textColor={isDark ? "#F8FAFC" : "#0F172A"}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default UniversalDatePicker;
