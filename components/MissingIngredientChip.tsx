import { Text } from "@/components/ui/text";
import { View, StyleSheet } from "react-native";
import { red } from "tailwindcss/colors";

interface Props {
  title?: string;
}

export default function MissingIngredientsChip(props: Props) {
  const { title = "Missing Ingredients" } = props;
  return (
    <View style={styles.missingIngredientChip}>
      <Text style={styles.missingIngredientsChip}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  missingIngredientChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: red[700],
    padding: 3,
  },
  missingIngredientsChip: {
    color: red[500],
  },
});
