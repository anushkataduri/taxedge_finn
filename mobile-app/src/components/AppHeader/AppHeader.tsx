import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import { useNotificationStore } from "@/store/notificationStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FocusAwareStatusBar } from "@/shared/components/FocusAwareStatusBar";
import { styles } from "./AppHeader.styles";

export interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  onBack?: () => void;
}

export function AppHeader({
  title,
  showBack = false,
  showNotification = true,
  onBack,
}: AppHeaderProps) {
  const colors = useTheme();
  const router = useRouter();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerWrapper, { backgroundColor: colors.primaryDark, paddingTop: insets.top }]}>
      <FocusAwareStatusBar barStyle="light-content" />
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: colors.primaryDark },
        ]}
      >
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => (onBack ? onBack() : router.back())}
              style={styles.iconButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.miniLogo}
              resizeMode="contain"
            />
          )}
        </View>

        <Text style={styles.titleText}>{title}</Text>

        <View style={styles.rightContainer}>
          {showNotification && (
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              style={styles.iconButton}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
              {unreadCount > 0 && (
                <View
                  style={[styles.badge, { backgroundColor: colors.orange }]}
                >
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
