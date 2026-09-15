import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  useColorScheme,
} from "react-native";
import { PrimaryButton } from "../../../../shared/components/Button/PrimaryButton";
import { styles, getThemedStyles } from "./ResetPasscodeSection.styles";

interface ResetPasscodeSectionProps {
  passcode: string;
  confirmPasscode: string;
  onChangePasscode: (p: string) => void;
  onChangeConfirmPasscode: (cp: string) => void;
  onSubmit: () => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  submitButtonTitle?: string;
  loading: boolean;
  error?: string | null;
  mobileNumber?: string;
}

export function ResetPasscodeSection({
  passcode,
  confirmPasscode,
  onChangePasscode,
  onChangeConfirmPasscode,
  onSubmit,
  loading,
  error,
}: ResetPasscodeSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themed = getThemedStyles(isDark);

  const newPasscodeRef = useRef<TextInput>(null);
  const confirmPasscodeRef = useRef<TextInput>(null);
  const [activeSection, setActiveSection] = useState<"new" | "confirm">("new");

  useEffect(() => {
    const t = setTimeout(() => {
      newPasscodeRef.current?.focus();
    }, 150);
    return () => clearTimeout(t);
  }, []);

  const handleNewPasscodeChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    onChangePasscode(clean);
    if (clean.length === 6) {
      setTimeout(() => {
        confirmPasscodeRef.current?.focus();
        setActiveSection("confirm");
      }, 50);
    }
  };

  const handleConfirmPasscodeChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    onChangeConfirmPasscode(clean);
    if (clean.length === 6 && passcode === clean) {
      Keyboard.dismiss();
    }
  };

  const isPasscodeComplete = passcode.length === 6;
  const isConfirmComplete = confirmPasscode.length === 6;
  const doPasscodesMatch = passcode === confirmPasscode;

  const isFormValid = isPasscodeComplete && isConfirmComplete && doPasscodesMatch;
  const showMismatchError = isConfirmComplete && !doPasscodesMatch;

  const renderBoxes = (
    value: string,
    isActive: boolean,
    hasError: boolean,
    onPress: () => void
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.otpTouchable}
      >
        <View style={styles.otpGrid}>
          {Array.from({ length: 6 }).map((_, i) => {
            const isFilled = i < value.length;
            const isCurrent = isActive && i === value.length;
            const boxTheme = themed.getBoxStyle(isCurrent, isFilled, hasError);

            return (
              <View
                key={i}
                style={[
                  styles.otpBox,
                  boxTheme,
                ]}
              >
                {isFilled ? (
                  <View
                    style={[
                      styles.secureDot,
                      themed.secureDot,
                    ]}
                  />
                ) : null}
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. New Passcode Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themed.title]}>
          New Passcode
        </Text>
        {renderBoxes(passcode, activeSection === "new", false, () => {
          newPasscodeRef.current?.focus();
          setActiveSection("new");
        })}
      </View>

      {/* 2. Confirm Passcode Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, themed.title]}>
          Confirm Passcode
        </Text>
        {renderBoxes(
          confirmPasscode,
          activeSection === "confirm",
          showMismatchError,
          () => {
            confirmPasscodeRef.current?.focus();
            setActiveSection("confirm");
          }
        )}
      </View>

      {/* Hidden Inputs for keyboard management */}
      <TextInput
        ref={newPasscodeRef}
        value={passcode}
        onChangeText={handleNewPasscodeChange}
        onFocus={() => setActiveSection("new")}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
        style={styles.hiddenInput}
      />

      <TextInput
        ref={confirmPasscodeRef}
        value={confirmPasscode}
        onChangeText={handleConfirmPasscodeChange}
        onFocus={() => setActiveSection("confirm")}
        keyboardType="number-pad"
        maxLength={6}
        secureTextEntry
        style={styles.hiddenInput}
      />

      {/* Inline Validation Error Message */}
      {showMismatchError ? (
        <Text style={styles.inlineErrorText}>Passcodes do not match.</Text>
      ) : null}
      {error && !showMismatchError ? (
        <Text style={styles.inlineErrorText}>{error}</Text>
      ) : null}

      {/* Reset Passcode Button */}
      <PrimaryButton
        title="Reset Passcode"
        onPress={onSubmit}
        loading={loading}
        disabled={!isFormValid || loading}
        colorType="orange"
        style={styles.submitBtn}
      />
    </View>
  );
}

export default ResetPasscodeSection;
