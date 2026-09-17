import React from "react";
import { View, Text } from "react-native";
import { COMPARISON_TABLE_ROWS } from "../../../mock/revisedItrData";
import { styles } from "./ComputationComparisonTable.styles";

export const ComputationComparisonTable: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.particularCol]}>Particulars</Text>
        <Text style={[styles.headerCell, styles.valueCol]}>Original</Text>
        <Text style={[styles.headerCell, styles.valueCol]}>Revised</Text>
        <Text style={[styles.headerCell, styles.changeCol]}>Change</Text>
      </View>

      {/* Table Body */}
      {COMPARISON_TABLE_ROWS.map((row, idx) => {
        const isLast = idx === COMPARISON_TABLE_ROWS.length - 1;

        return (
          <View
            key={row.particular}
            style={[styles.row, !isLast && styles.rowBorder]}
          >
            <Text style={[styles.cell, styles.particularCol]} numberOfLines={2}>
              {row.particular}
            </Text>
            <Text style={[styles.cell, styles.valueCol]}>{row.original}</Text>
            <Text style={[styles.cell, styles.valueCol]}>{row.revised}</Text>
            <Text
              style={[
                styles.cell,
                styles.changeCol,
                row.isHighlight ? styles.highlightText : styles.neutralText,
              ]}
            >
              {row.change}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
