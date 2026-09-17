import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./GstDatePickerModal.styles";

export interface GstDatePickerModalProps {
  visible: boolean;
  title?: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const GstDatePickerModal: React.FC<GstDatePickerModalProps> = ({
  visible,
  title = "Select Date",
  selectedDate: _selectedDate,
  onSelectDate,
  onClose,
}) => {
  const [day, setDay] = useState(15);
  const [monthIndex, setMonthIndex] = useState(7); // Aug
  const [year, setYear] = useState(2026);

  const handleConfirm = () => {
    const formatted = `${day < 10 ? `0${day}` : day} ${MONTH_NAMES[monthIndex]} ${year}`;
    onSelectDate(formatted);
    onClose();
  };

  const setQuickDate = (daysAhead: number) => {
    const target = new Date(2026, 7, 19 + daysAhead);
    const d = target.getDate();
    const m = MONTH_NAMES[target.getMonth()];
    const y = target.getFullYear();
    onSelectDate(`${d < 10 ? `0${d}` : d} ${m} ${y}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Quick Select Pills */}
          <Text style={styles.sectionHeading}>Quick Selection</Text>
          <View style={styles.pillsRow}>
            <TouchableOpacity style={styles.pill} onPress={() => setQuickDate(0)}>
              <Text style={styles.pillText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pill} onPress={() => setQuickDate(7)}>
              <Text style={styles.pillText}>In 7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pill} onPress={() => setQuickDate(15)}>
              <Text style={styles.pillText}>In 15 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pill} onPress={() => setQuickDate(30)}>
              <Text style={styles.pillText}>In 30 Days</Text>
            </TouchableOpacity>
          </View>

          {/* Steppers for Day, Month, Year */}
          <View style={styles.stepperRow}>
            {/* Day */}
            <View style={styles.stepperCol}>
              <Text style={styles.stepperLabel}>Day</Text>
              <View style={styles.stepperBox}>
                <TouchableOpacity
                  onPress={() => setDay((d) => Math.max(1, d - 1))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="remove" size={16} color="#083B75" />
                </TouchableOpacity>
                <Text style={styles.stepVal}>{day}</Text>
                <TouchableOpacity
                  onPress={() => setDay((d) => Math.min(31, d + 1))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="add" size={16} color="#083B75" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Month */}
            <View style={styles.stepperCol}>
              <Text style={styles.stepperLabel}>Month</Text>
              <View style={styles.stepperBox}>
                <TouchableOpacity
                  onPress={() => setMonthIndex((m) => Math.max(0, m - 1))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="remove" size={16} color="#083B75" />
                </TouchableOpacity>
                <Text style={styles.stepVal}>{MONTH_NAMES[monthIndex]}</Text>
                <TouchableOpacity
                  onPress={() => setMonthIndex((m) => Math.min(11, m + 1))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="add" size={16} color="#083B75" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Year */}
            <View style={styles.stepperCol}>
              <Text style={styles.stepperLabel}>Year</Text>
              <View style={styles.stepperBox}>
                <TouchableOpacity
                  onPress={() => setYear((y) => Math.max(2020, y - 1))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="remove" size={16} color="#083B75" />
                </TouchableOpacity>
                <Text style={styles.stepVal}>{year}</Text>
                <TouchableOpacity
                  onPress={() => setYear((y) => Math.min(2030, y + 1))}
                  style={styles.stepBtn}
                >
                  <Ionicons name="add" size={16} color="#083B75" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={handleConfirm}>
            <Text style={styles.confirmBtnText}>Set Date</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
