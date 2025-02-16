import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { View } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import usePantry from "@/store/pantry";
import { NumberOfIngredientsInPantry } from "@/utils/pantry";
import { useEffect, useState } from "react";
import { generateRecipes } from "@/services/image-to-text";
import useRecipes from "@/store/recipes";
import RecipeCard from "@/components/RecipeCard";
import { router } from "expo-router";
import RecipeService from "@/services/recipes";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Recipe } from "@/models/recipes";

export default function Favorites() {
  const { favoriteRecipes, setFavoriteRecipes } = useRecipes();

  // setFavoriteRecipes([]);

  const onRecipePress = (recipe: Recipe) => {
    router.push({
      pathname: "/recipe-details",
      params: {
        recipeId: recipe.id,
      },
    });
  };

  return (
    <>
      {!favoriteRecipes.length ? (
        <View style={styles.loadingContainer}>
          <Text size="xl" bold>
            Browse some recipes and add them to your favorites!
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={favoriteRecipes}
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
