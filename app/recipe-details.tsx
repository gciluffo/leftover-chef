import { Image, ScrollView, StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { useLocalSearchParams } from "expo-router";
import useRecipes from "@/store/recipes";
import { Divider } from "@/components/ui/divider";
import React, { useEffect } from "react";
import { Recipe } from "@/store/recipes";
import { Heading } from "@/components/ui/heading";
import Spacer from "@/components/Spacer";

export default function RecipeDetails() {
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const params = useLocalSearchParams();
  const recipeId = Array.isArray(params.recipeId)
    ? params.recipeId[0]
    : params.recipeId;
  const { getById } = useRecipes();

  useEffect(() => {
    if (recipeId) {
      const r = getById(recipeId);

      if (r) setRecipe(r);
    }
  }, [recipeId]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      // headerImage={
      //   <Image
      //     source={require("@/assets/images/recipe.jpg")}
      //     style={styles.reactLogo}
      //   />
      // }
    >
      {recipe && (
        <View>
          <View style={styles.titleContainer}>
            <Heading size="2xl">{recipe.title}</Heading>
          </View>

          <Text size="md">{recipe.description}</Text>
          <Spacer />
          <Divider />
          <Spacer />
          <View>
            <Text size="lg">Cuisine: {recipe.cuisine}</Text>
            <Text size="lg">
              Difficulty: {recipe.difficulty} | Estimated Cost:{" "}
              {recipe.estimated_cost}
            </Text>
            <Text size="lg">
              Prep Time: {recipe.prep_time_minutes} mins | Servings:{" "}
              {recipe.servings}
            </Text>
            <Text size="lg">Cooking Method: {recipe.cooking_method}</Text>
            <Text size="lg">
              Required Equipment: {recipe.required_equipment?.join(", ")}
            </Text>
          </View>
          <Spacer />
          <Divider />
          <Spacer />
          <Heading size="xl">Ingredients</Heading>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} size="lg">
              - {ingredient.name} {ingredient.quantity.replace(",", "")}
            </Text>
          ))}
          <Spacer />
          <Divider />
          <Spacer />
          <Heading size="xl">Nutrition</Heading>
          <Text size="lg">Calories: {recipe.nutrition.calories}</Text>
          <Text size="lg">Protein: {recipe.nutrition.protein}</Text>
          <Text size="lg">Fat: {recipe.nutrition.fat}</Text>
          <Text size="lg">Carbs: {recipe.nutrition.carbs}</Text>
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
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
});
