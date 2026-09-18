import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  StyleProp,
  findNodeHandle,
  UIManager,
  type ScrollViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KeyboardAwareContextType {
  scrollRef: React.RefObject<ScrollView | null>;
  scrollToFocusedInput: (inputNodeHandle?: number | null) => void;
  keyboardHeight: number;
  isKeyboardVisible: boolean;
}

const KeyboardAwareContext = createContext<KeyboardAwareContextType>({
  scrollRef: { current: null },
  scrollToFocusedInput: () => {},
  keyboardHeight: 0,
  isKeyboardVisible: false,
});

export const useKeyboardAwareScroll = () => useContext(KeyboardAwareContext);

export interface KeyboardAwareFormLayoutProps extends ScrollViewProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  iosOffset?: number;
  extraScrollHeight?: number;
  dismissKeyboardOnTap?: boolean;
}

export const KeyboardAwareFormLayout: React.FC<KeyboardAwareFormLayoutProps> = ({
  children,
  containerStyle,
  contentStyle,
  iosOffset = 0,
  extraScrollHeight = 60,
  dismissKeyboardOnTap = true,
  ...scrollViewProps
}) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollToFocusedInput = useCallback(
    (inputNodeHandle?: number | null) => {
      if (!scrollRef.current) return;

      const currentlyFocusedField =
        inputNodeHandle || (TextInputState.currentlyFocusedInput ? findNodeHandle(TextInputState.currentlyFocusedInput()) : null);

      if (!currentlyFocusedField) return;

      UIManager.measureInWindow(currentlyFocusedField, (_x, y, _width, height) => {
        if (typeof y !== "number") return;
        // If the bottom of input extends into the keyboard region, scroll it up
        const keyboardTop = (Platform.OS === "web" ? window.innerHeight : 0) || (keyboardHeight > 0 ? keyboardHeight : 280);
        const inputBottom = y + height;

        if (inputBottom > keyboardTop - extraScrollHeight) {
          scrollRef.current?.scrollTo({
            y: Math.max(0, inputBottom - keyboardTop + extraScrollHeight),
            animated: true,
          });
        }
      });
    },
    [keyboardHeight, extraScrollHeight]
  );

  // Helper reference to TextInputState for RN compatibility
  const TextInputState = (Keyboard as any).TextInputState || {
    currentlyFocusedInput: () => null,
  };

  const content = (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.defaultContent,
        {
          paddingBottom: Math.max(insets.bottom, 20) + (isKeyboardVisible ? extraScrollHeight : 30),
        },
        contentStyle,
      ]}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );

  return (
    <KeyboardAwareContext.Provider
      value={{
        scrollRef,
        scrollToFocusedInput,
        keyboardHeight,
        isKeyboardVisible,
      }}
    >
      <KeyboardAvoidingView
        style={[styles.container, containerStyle]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? iosOffset : 0}
      >
        {dismissKeyboardOnTap ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {content}
          </TouchableWithoutFeedback>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </KeyboardAwareContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  defaultContent: {
    flexGrow: 1,
  },
});

export default KeyboardAwareFormLayout;
