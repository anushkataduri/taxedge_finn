import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,
  },
  label: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#0B1F3A",
    marginBottom: 6,
  },
  requiredStar: {
    color: "#DC2626",
    fontWeight: "700",
  },
  inputWrapper: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  inputFocused: {
    borderColor: "#F97316",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  currencyPrefixContainer: {
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B1F3A",
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    color: "#0B1F3A",
    fontWeight: "500",
    padding: 0,
  },
  errorText: {
    fontSize: 11,
    color: "#DC2626",
    marginTop: 4,
    fontWeight: "500",
  },
});
