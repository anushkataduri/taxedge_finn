/**
 * Screen: Create Profile Styles
 * Modular monolithic styles composition.
 * Preserves all styling keys with zero functional regression.
 */

import { StyleSheet } from "react-native";
import { formStyles } from "./create-profile.form.styles";
import { modalStyles } from "./create-profile.modals.styles";

export * from "./create-profile.form.styles";
export * from "./create-profile.modals.styles";

export const styles = StyleSheet.create({
  ...formStyles,
  ...modalStyles,
});

export default styles;
