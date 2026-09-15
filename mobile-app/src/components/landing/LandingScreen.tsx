import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { HeroSection } from "./HeroSection";
import { ServicePills } from "./ServicePills";
import { WhyChooseSection } from "./WhyChooseSection";
import { GetStartedButton } from "./GetStartedButton";

export function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNavigateToLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: "#F4FAFF" }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom + 8, 28),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.cardWrapper}>
          {/* Top Hero Banner - Edge to Edge Full Width */}
          <HeroSection />

          {/* Bottom Financial Services Content */}
          <View style={styles.contentPadding}>
            {/* Main Heading */}
            <View style={styles.headingSection}>
              <Text style={styles.headingPrimary}>Your Financial Services,</Text>
              <Text style={styles.headingAccent}>Simplified</Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>
              GST, ITR, loans and documentation —{"\n"}
              manage everything digitally with expert{"\n"}
              assistance from certified professionals.
            </Text>

            {/* Service Pills (No icons, text-only pills) */}
            <ServicePills />

            {/* Why Choose TaxEdge Section */}
            <WhyChooseSection />

            {/* Get Started Button */}
            <View style={styles.ctaSection}>
              <GetStartedButton onPress={handleNavigateToLogin} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  contentPadding: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  headingSection: {
    marginTop: 10,
    marginBottom: 4,
  },
  headingPrimary: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0C2340",
    letterSpacing: -0.4,
    lineHeight: 29,
  },
  headingAccent: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0052FF",
    letterSpacing: -0.4,
    lineHeight: 29,
  },
  description: {
    fontSize: 13.5,
    lineHeight: 18.5,
    color: "#5A6E85",
    letterSpacing: -0.2,
    marginBottom: 10,
  },
  ctaSection: {
    marginTop: 14,
    width: "100%",
  },
});
