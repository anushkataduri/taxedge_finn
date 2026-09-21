import { Colors, type ThemeColors } from "../constants/theme";
import { useThemeStore } from "../design-system/theme/themeStore";

export function useTheme(): ThemeColors {
  const theme = useThemeStore((state) => state.theme);
  return Colors[theme];
}

export default useTheme;
