import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { View } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import usePantry from "@/store/pantry";
import { NumberOfIngredientsInPantry } from "@/utils/pantry";
import { useEffect, useState } from "react";
import { generateRecipes } from "@/services/openai";
import useRecipes from "@/store/recipes";
import RecipeCard from "@/components/RecipeCard";
import { router } from "expo-router";
import RecipeService from "@/services/recipes";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Recipe } from "@/models/recipes";

export default function ImportFood() {
  const [loading, setLoading] = useState(false);

  const { pantryItems } = usePantry();
  const { setRecipes, recipes, recipePreferences } = useRecipes();
  const numItems = NumberOfIngredientsInPantry(pantryItems);

  const generateRecipes = async () => {
    try {
      const ingredients = Object.values(pantryItems).flat();
      setLoading(true);
      const response = await RecipeService.generateRecipes(
        ingredients,
        recipePreferences
      );
      setRecipes(response.recipes);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const init = async () => {
  //     await generateRecipes();
  //   };

  //   if (numItems > 2) {
  //     init();
  //   }
  // }, []);

  const onAddPress = async () => {
    // await generateRecipes();
    router.push({
      pathname: "/recipe-configuration",
    });
  };

  const onRecipePress = (recipe: Recipe) => {
    router.push({
      pathname: "/recipe-details",
      params: {
        recipeId: recipe.id,
      },
    });
  };

  if (loading && recipes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      {numItems < 3 ? (
        <View style={styles.loadingContainer}>
          <Text size="xl" bold>
            Add some items to your pantry to see recipes here!
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={recipes}
          refreshing={loading}
          onRefresh={generateRecipes}
          ItemSeparatorComponent={() => (
            <View
              style={{ marginVertical: 10 }}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
          )}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={() => onRecipePress(item)} />
          )}
        />
      )}
      <Fab
        placement="bottom right"
        onPress={onAddPress}
        size="lg"
        style={styles.fab}
      >
        <FabLabel>
          <FontAwesome name="cog" size={15} />
        </FabLabel>
      </Fab>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    padding: 10,
  },
  loadingContainer: {
    margin: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
