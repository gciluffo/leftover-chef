import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import useRecipes from "@/store/recipes";
import { Divider } from "@/components/ui/divider";
import React, { useEffect, useMemo } from "react";
import { Heading } from "@/components/ui/heading";
import Spacer from "@/components/ui/Spacer";
import { Recipe } from "@/models/recipes";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import usePantry from "@/store/pantry";
import { getMissingIngredients } from "@/utils/ingredient-compare";
import MissingIngredientsChip from "@/components/MissingIngredientChip";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const defaultImageUrl =
  "https://www.deadendbbq.com/wp-content/uploads/2022/06/blog-header.jpg";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function TabOneScreen() {
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const [favorite, setFavorite] = React.useState(false);
  const params = useLocalSearchParams();
  const recipeId = Array.isArray(params.recipeId)
    ? params.recipeId[0]
    : params.recipeId;
  const { getById, addFavorite, removeFavorite, favoriteRecipes } =
    useRecipes();
  const { pantryItems } = usePantry();

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

  const missingIngredients = useMemo(() => {
    if (!recipe) return [];

    const recipeIngredients = recipe.ingredients.map((ingredient) =>
      ingredient.name.toLowerCase()
    );
    const pantryIngredients = Object.values(pantryItems)
      .flat()
      .map((item) => item.toLowerCase());

    return getMissingIngredients(pantryIngredients, recipeIngredients);
  }, [pantryItems, recipe]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          </View>

          <Spacer />
          <Text size="md">{recipe.description}</Text>
          <Spacer />
          <Divider />
          <Spacer />
          <View>
            <Text size="lg">Cuisine: {recipe.cuisine}</Text>
            <Text size="lg">
              Difficulty: {recipe.difficulty}
              {recipe.estimated_cost}
            </Text>
            <Text size="lg">Prep Time: {recipe.prep_time_minutes} mins</Text>
            <Text size="lg">Servings: {recipe.servings}</Text>
            <Text size="lg">Cooking Method: {recipe.cooking_method}</Text>
            <Text size="lg">
              Required Equipment: {recipe.required_equipment?.join(", ")}
            </Text>
          </View>
          <Spacer />
          <Divider />
          <Spacer />
          {missingIngredients.length > 0 && (
            <>
              <Heading size="xl">Missing Ingredients</Heading>
              <View style={styles.missingIngredientChipContainer}>
                {missingIngredients.map((ingredient, index) => (
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
