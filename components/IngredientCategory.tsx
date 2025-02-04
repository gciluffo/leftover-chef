import React from "react";
import { Text, View } from "./Themed";
import { StyleSheet } from "react-native";

interface Props {
  title: string;
  children: React.ReactNode;
}

export function IngredientCategory(props: Props) {
  const formatTitle = (title: string) => {
    return title
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formatTitle(props.title)}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
