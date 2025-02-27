import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { ExternalPathString, Link, useLocalSearchParams } from "expo-router";
import useRecipes from "@/store/recipes";
import { Divider } from "@/components/ui/divider";
import React, { useEffect, useMemo } from "react";
import { Heading } from "@/components/ui/heading";
import Spacer from "@/components/ui/Spacer";
import { ExternalRecipe } from "@/models/recipes";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MissingIngredientsChip from "@/components/MissingIngredientChip";

export default function VerifiedRecipeDetails() {
  const [recipe, setRecipe] = React.useState<ExternalRecipe | null>(null);
  const params = useLocalSearchParams();
  const recipeId = Array.isArray(params.externalRecipeId)
    ? params.externalRecipeId[0]
    : params.externalRecipeId;
  const { getExternalRecipeById } = useRecipes();

  useEffect(() => {
    if (recipeId && !recipe) {
      const r = getExternalRecipeById(recipeId);

      if (r) setRecipe(r);
    }
  }, [recipeId]);

  const ingredients = useMemo(() => {
    return recipe?.ingredients.map((ingredient) => ingredient.items).flat();
  }, [recipe]);

  const missingIngredients = [] as any;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipe && (
        <View>
          <View style={styles.titleContainer}>
            <Heading size="2xl">{recipe.name}</Heading>
          </View>
          <Link href={recipe.source as ExternalPathString}>
            <Text size="lg">View Recipe </Text>
            <FontAwesome name="external-link" size={20} />
          </Link>
          <Spacer />

          <Spacer />
          <Text size="md">{recipe.description}</Text>
          <Spacer />
          <Divider />
          <Spacer />
          <View>
            <Text size="lg">Cuisine: {recipe.cuisine}</Text>
            <Text size="lg">
              Total time {recipe.totalTime.slice(2, 4)} minutes
            </Text>
            <Text size="lg">Servings: {recipe.servings}</Text>
          </View>
          <Spacer />
          <Divider />
          <Spacer />
          {missingIngredients.length > 0 && (
            <>
              <Heading size="xl">Missing Ingredients</Heading>
              <View style={styles.missingIngredientChipContainer}>
                {missingIngredients.map((ingredient: string, index: number) => (
                  <MissingIngredientsChip key={index} title={ingredient} />
                ))}
              </View>
              <Spacer />
              <Divider />
              <Spacer />
            </>
          )}
          <Heading size="xl">Ingredients</Heading>
          <Spacer />
          {ingredients?.map((ingredient, index) => (
            <Text key={index} size="lg">
              - {ingredient}
            </Text>
          ))}
          <Spacer />
          <Divider />
          <Spacer />
          <Heading size="xl">Nutrition</Heading>
          <Text size="lg">Calories: {recipe.nutrition.calories}</Text>
          <Text size="lg">Protein: {recipe.nutrition.protein}</Text>
          <Text size="lg">Fat: {recipe.nutrition.fat}</Text>
          <Text size="lg">Carbs: {recipe.nutrition.carbohydrates}</Text>
          <Spacer />
          <Divider />
          <Spacer />
          <Heading size="xl">Instructions</Heading>
          {recipe.instructions.map((step, index) => (
            <Text key={index} size="xl">
              {index + 1}. {step}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    margin: 10,
    paddingBottom: 100,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  missingIngredientChipContainer: {
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 200,
    borderRadius: 5,
    backgroundColor: "#0553",
  },
});
