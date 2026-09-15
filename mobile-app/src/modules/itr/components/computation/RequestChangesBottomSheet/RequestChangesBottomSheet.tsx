import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./RequestChangesBottomSheet.styles";

interface RequestChangesBottomSheetProps {
  visible: boolean;
  onSubmit: (comments: string, selectedTags: string[]) => void;
  onClose: () => void;
}

export const RequestChangesBottomSheet: React.FC<RequestChangesBottomSheetProps> = ({
  visible,
  onSubmit,
  onClose,
}) => {
  const [comments, setComments] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = [
    "Deductions Missing",
    "Income Mismatch",
    "TDS Discrepancy",
    "Wrong Form",
    "Other",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (!comments.trim() && selectedTags.length === 0) {
      Alert.alert("Input Required", "Please mention the changes or select an issue tag.");
      return;
    }
    onSubmit(comments, selectedTags);
    setComments("");
    setSelectedTags([]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons name="chatbox-ellipses" size={20} color="#0B1F3A" />
                </View>
                <View style={styles.headerTextGroup}>
                  <Text style={styles.title}>Request Changes</Text>
                  <Text style={styles.subtitle}>
                    Mention corrections for your assigned Tax Executive.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color="#0B1F3A" />
                </TouchableOpacity>
              </View>

              {/* Quick Tags */}
              <Text style={styles.sectionLabel}>Select Common Issues</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      activeOpacity={0.7}
                      onPress={() => toggleTag(tag)}
                      style={[
                        styles.tagChip,
                        isSelected && styles.tagChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          isSelected && styles.tagTextSelected,
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Comments Text Area */}
              <Text style={styles.sectionLabel}>Detailed Remarks</Text>
              <View style={styles.textAreaWrapper}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe the discrepancy or required correction in detail..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  value={comments}
                  onChangeText={setComments}
                />
                <Text style={styles.charCounter}>{comments.length}/500</Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit to Tax Executive</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
