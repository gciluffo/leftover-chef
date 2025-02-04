import React from "react";
import { Text, View } from "./Themed";
import { StyleSheet } from "react-native";

interface Props {
  name: string;
}

export function FoodChip(props: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    margin: 4,
    // backgroundColor: "#f0f0f0",
    width: "auto",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
