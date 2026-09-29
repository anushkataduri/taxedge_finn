import { StyleSheet } from "react-native";
import {
  FLOATING_TAB_HEIGHT,
  FLOATING_TAB_GAP,
} from "./FloatingTabBar/FloatingTabBar";

/** Horizontal padding every screen's content should use. */
export const SCREEN_PADDING = 16;

/**
 * Bottom padding for a screen's scroll content: clears the floating bar plus
 * a little breathing room, so a card or button is never trapped underneath it.
 * Screens use this instead of their own insets math, so all tabs end alike.
 */
export const SCREEN_BOTTOM_PADDING = FLOATING_TAB_HEIGHT + FLOATING_TAB_GAP + 24;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
