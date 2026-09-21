import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./GstServiceBanner.styles";

export interface GstServiceBannerProps {
  iconName?: string;
  text: string;
}

export const GstServiceBanner: React.FC<GstServiceBannerProps> = ({
  iconName = "document-text",
  text,
}) => {
  return (
    <View style={styles.banner}>
      <View style={styles.iconBox}>
        <Ionicons name={iconName as any} size={18} color="#2563EB" />
      </View>
      <Text style={styles.bannerText}>{text}</Text>
    </View>
  );
};
