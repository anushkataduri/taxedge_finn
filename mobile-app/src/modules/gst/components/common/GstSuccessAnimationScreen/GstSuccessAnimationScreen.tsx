import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  styles,
  getRippleAnimatedStyle,
  getMainIconAnimatedStyle,
  getContentAnimatedStyle,
  getBtnAnimatedStyle,
} from "./GstSuccessAnimationScreen.styles";

export interface GstSuccessAnimationScreenProps {
  title: string;
  subtitle: string;
  iconType?: "checkmark" | "certificate" | "reprint";
  onBackPress?: () => void;
}

export const GstSuccessAnimationScreen: React.FC<GstSuccessAnimationScreenProps> = ({
  title,
  subtitle,
  iconType = "checkmark",
  onBackPress,
}) => {
  const router = useRouter();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0.8)).current;
  const rippleOpacity = useRef(new Animated.Value(0.4)).current;
  const contentAnim = useRef(new Animated.Value(20)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.parallel([
          Animated.timing(rippleAnim, {
            toValue: 1.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handlePress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.replace("/service/gst");
    }
  };

  const onPressIn = () => {
    Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        {/* Animated Icon Circle with Concentric Blue Ripples */}
        <View style={styles.iconContainer}>
          {/* Ripple Ring 1 */}
          <Animated.View
            style={[
              styles.rippleRing,
              styles.rippleOuter,
              getRippleAnimatedStyle(rippleAnim, rippleOpacity),
            ]}
          />
          {/* Ripple Ring 2 */}
          <View style={[styles.rippleRing, styles.rippleMiddle]} />
          {/* Ripple Ring 3 */}
          <View style={[styles.rippleRing, styles.rippleInner]} />

          {/* Main Visual Circle */}
          <Animated.View
            style={[
              styles.mainIconCircle,
              getMainIconAnimatedStyle(scaleAnim, opacityAnim),
            ]}
          >
            {iconType === "certificate" ? (
              <View style={styles.certIconContainer}>
                <Ionicons name="document-text" size={48} color="#2563EB" />
                <View style={styles.certBadge}>
                  <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
                </View>
              </View>
            ) : iconType === "reprint" ? (
              <View style={styles.reprintContainer}>
                <Ionicons name="checkmark-circle" size={56} color="#2563EB" />
                <View style={styles.planeIcon}>
                  <Ionicons name="paper-plane" size={20} color="#3B82F6" />
                </View>
              </View>
            ) : (
              <Ionicons name="checkmark" size={46} color="#2563EB" />
            )}
          </Animated.View>
        </View>

        {/* Text Content */}
        <Animated.View
          style={[
            styles.textCol,
            getContentAnimatedStyle(contentAnim, opacityAnim),
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>
      </View>

      {/* Single-Line Centered Orange CTA Button */}
      <Animated.View style={[styles.btnWrapper, getBtnAnimatedStyle(btnScale)]}>
        <TouchableOpacity
          style={styles.orangeBtn}
          activeOpacity={0.9}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={handlePress}
        >
          <Text style={styles.btnText}>Back to GST Services</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
