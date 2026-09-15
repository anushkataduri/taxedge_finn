import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ASSESSMENT_YEARS } from "../../../mock/categoryDocuments";
import { styles } from "./AssessmentYearPickerModal.styles";

interface AssessmentYearPickerModalProps {
  visible: boolean;
  selectedYear: string;
  onSelect: (year: string) => void;
  onClose: () => void;
}

export const AssessmentYearPickerModal: React.FC<AssessmentYearPickerModalProps> = ({
  visible,
  selectedYear,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Select Assessment Year</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color="#0B1F3A" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={ASSESSMENT_YEARS}
                keyExtractor={(item) => item.value}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                  const isSelected = selectedYear === item.value;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        onSelect(item.value);
                        onClose();
                      }}
                      style={[
                        styles.optionItem,
                        isSelected && styles.selectedOptionItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {item.label}
                      </Text>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
