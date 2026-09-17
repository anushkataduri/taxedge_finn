import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "./GstSelectModal.styles";

export interface GstSelectModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export const GstSelectModal: React.FC<GstSelectModalProps> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Options List */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const isSelected = selectedValue === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionItem, isSelected && styles.optionItemActive]}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {option}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={BrandColors.PRIMARY_ORANGE} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
