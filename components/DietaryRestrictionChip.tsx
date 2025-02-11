import React from "react";
import { View } from "./Themed";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Text } from "@/components/ui/text";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import colors from "tailwindcss/colors";

interface Props {
  name: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export function DietaryRestrictionChip(props: Props) {
  const scheme = useColorScheme();
  const { name, onPress, isSelected = false } = props;

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor:
          isSelected && scheme === "dark" ? colors.gray[800] : colors.gray[200],
      }}
      onPress={onPress}
    >
      <Text
        size="xl"
        style={{
          color: isSelected && scheme === "dark" ? colors.white : colors.black,
        }}
      >
        {props.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
});
