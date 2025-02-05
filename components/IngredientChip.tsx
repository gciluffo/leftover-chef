import React from "react";
import { View } from "./Themed";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Text } from "@/components/ui/text";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

interface Props {
  name: string;
  onPress?: () => void;
}

export function IngredientChip(props: Props) {
  const scheme = useColorScheme();
  const { name, onPress } = props;

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor:
          scheme === "dark" ? DarkTheme.colors.card : DefaultTheme.colors.card,
      }}
      onPress={onPress}
    >
      <Text size="xl">{props.name}</Text>
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
