import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../hooks/use-theme";
import { CATEGORIES } from "../../data/services";
import type { ServiceCategory, ServiceCategoryId } from "../../types/domain";
import {
  SUB_SERVICES_MAP,
  SUBTITLE_TEXT_MAP,
  WINDOW_WIDTH,
  styles,
} from "./ServiceCarousel.styles";

export { CARD_WIDTH } from "./ServiceCarousel.styles";

export interface ServiceCarouselProps {
  onExplore: (categoryId: ServiceCategoryId) => void;
}

export function ServiceCarousel({ onExplore }: ServiceCarouselProps) {
  const colors = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<ServiceCategory>>(null);

  const getSubServices = (catId: ServiceCategoryId): string[] =>
    SUB_SERVICES_MAP[catId] ?? [];

  const getSubTitleText = (catId: ServiceCategoryId): string =>
    SUBTITLE_TEXT_MAP[catId] ?? "";

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / (WINDOW_WIDTH - 24));
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={CATEGORIES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Dark Blue Header Section of Carousel Card */}
            <View
              style={[styles.cardHeader, { backgroundColor: colors.primary }]}
            >
              <View style={styles.iconBg}>
                <Ionicons name={item.icon} size={28} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>{item.id}</Text>
              <Text style={styles.cardSubTitle}>
                {getSubTitleText(item.id)}
              </Text>
            </View>

            {/* Body Checklist Section */}
            <View style={styles.body}>
              {getSubServices(item.id).map((service, idx) => (
                <View key={idx} style={styles.checkRow}>
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                  <Text style={[styles.bulletItem, { color: colors.text }]}>
                    {service}
                  </Text>
                </View>
              ))}
            </View>

            {/* Explore Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onExplore(item.id)}
              style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.exploreText}>Explore</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        {CATEGORIES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              {
                backgroundColor:
                  activeIndex === index ? colors.orange : colors.border,
                width: activeIndex === index ? 16 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}
