import { Colors } from "../constants/theme";
import { useThemeStore } from "../../design-system/theme/themeStore";

export function useTheme() {
  const scheme = useThemeStore((state) => state.theme);
  const colors = Colors[scheme];

  return {
    colors,
    isDark: scheme === "dark",
    scheme,
  };
}

export default useTheme;

