import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Recipe } from "@/models/recipes";
import usePantry from "@/store/pantry";
import { levenshteinDistance } from "@/utils/fuzzy";
import { getMissingIngredients } from "@/utils/ingredient-compare";
import { useMemo } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { green, red } from "tailwindcss/colors";
import MissingIngredientsChip from "./MissingIngredientChip";

interface Props {
  recipe: Recipe;
  onPress: () => void;
}

function DietaryInfoChip({ dietaryInfo }: { dietaryInfo: string }) {
  return (
    <View style={styles.dietaryInfoChip}>
      <Text style={styles.dietaryInfoChipText}>{dietaryInfo}</Text>
    </View>
  );
}

function RecipeCard({ recipe, onPress }: Props) {
  const { pantryItems } = usePantry();

  const hasMissingIngredients = useMemo((): boolean => {
    const recipeIngredients = recipe.ingredients.map((ingredient) =>
      ingredient.name.toLowerCase()
    );
    const pantryIngredients = Object.values(pantryItems)
      .flat()
      .map((item) => item.toLowerCase());

    const missingIngredients = getMissingIngredients(
      pantryIngredients,
      recipeIngredients
    );

    return missingIngredients.length > 0;
  }, [pantryItems]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <Heading size="xl">{recipe.title}</Heading>
        <Text>{recipe.description}</Text>
        <Text>Prep time: {recipe.prep_time_minutes} minutes</Text>
        <View style={styles.chipContainer}>
          {recipe.dietary_info.length > 0 &&
            recipe.dietary_info.map((d) => (
              <DietaryInfoChip dietaryInfo={d} key={d} />
            ))}
          {hasMissingIngredients && <MissingIngredientsChip />}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dietaryInfoChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: green[700],
    padding: 3,
  },
  dietaryInfoChipText: {
    color: green[500],
  },
  missingIngredientChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: red[700],
    padding: 3,
  },
  missingIngredientsChip: {
    color: red[500],
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 5,
  },
});

export default RecipeCard;
