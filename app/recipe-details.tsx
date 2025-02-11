import {
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import useRecipes from "@/store/recipes";
import { Divider } from "@/components/ui/divider";
import React, { useEffect } from "react";
import { Heading } from "@/components/ui/heading";
import Spacer from "@/components/ui/Spacer";
import { Recipe } from "@/models/recipes";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function RecipeDetails() {
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const [favorite, setFavorite] = React.useState(false);
  const params = useLocalSearchParams();
  const recipeId = Array.isArray(params.recipeId)
    ? params.recipeId[0]
    : params.recipeId;
  const { getById, addFavorite, removeFavorite, favoriteRecipes } =
    useRecipes();

  useEffect(() => {
    if (recipeId) {
      const r = getById(recipeId);

      if (r) setRecipe(r);
    }
  }, [recipeId]);

  useEffect(() => {
    if (recipe) {
      setFavorite(favoriteRecipes.some((r) => r.id === recipe.id));
    }
  }, [recipe]);

  useEffect(() => {
    if (favorite && recipe) {
      addFavorite(recipe);
    }

    if (!favorite && recipe) {
      removeFavorite(recipe);
    }
  }, [favorite]);

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
          <Spacer />
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setFavorite(!favorite)}>
              <FontAwesome
                name="heart"
                size={30}
                color={favorite ? "red" : "white"}
              />
            </TouchableOpacity>

            {/* <TouchableOpacity>
              <FontAwesome name="share" size={30} color="white" />
            </TouchableOpacity> */}
          </View>

          <Spacer />
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
    // justifyContent: "flex-end",
  },
});
