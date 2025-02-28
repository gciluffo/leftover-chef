import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";

import { Fab, FabLabel } from "@/components/ui/fab";
import { View } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import usePantry from "@/store/pantry";
import { NumberOfIngredientsInPantry } from "@/utils/pantry";
import { useEffect, useMemo, useRef, useState } from "react";
import useRecipes from "@/store/recipes";
import RecipeCard from "@/components/RecipeCard";
import { router } from "expo-router";
import RecipeService from "@/services/recipes-ai";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Recipe } from "@/models/recipes";
import { searchRecipeName } from "@/services/recipe-api";
import { Button, ButtonText } from "@/components/ui/button";
import Spacer from "@/components/ui/Spacer";

export default function Explore() {
  const [loading, setLoading] = useState(false);

  const { pantryItems } = usePantry();
  const { setRecipes, recipes, recipePreferences } = useRecipes();
  const isFirstRender = useRef(true);

  const enoughIngredients = useMemo(() => {
    const numItems = NumberOfIngredientsInPantry(pantryItems);
    return numItems >= 6;
  }, [pantryItems]);

  const generateRecipes = async () => {
    try {
      const ingredients = Object.values(pantryItems).flat();
      setLoading(true);
      const response = await RecipeService.generateRecipes(
        ingredients,
        recipePreferences
      );

      try {
        for (const r of response.recipes) {
          console.log("searching for", r.genericTitle);
          const externalRecipes = await searchRecipeName(r.genericTitle);

          // console.log("info", externalRecipes);
          if (externalRecipes?.recipes?.length > 0) {
            console.log("match!");
            r.externalRecipeInfo = externalRecipes.recipes;
          }
        }
      } catch (error) {
        console.error("error getting external recipes", error);
      }

      setRecipes(response.recipes);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (enoughIngredients) {
      // setRecipes([]);
      // generateRecipes();
    }
  }, [recipePreferences]);

  const onAddPress = async () => {
    router.push({
      pathname: "/recipe-configuration",
    });
  };

  const onRecipePress = (recipe: Recipe) => {
    router.push({
      pathname: "/(top-tabs)",
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
      {!enoughIngredients ? (
        <View style={styles.loadingContainer}>
          <Text size="xl" bold style={{ textAlign: "center" }}>
            Add some items to your pantry to see recipes here!
          </Text>
          <Spacer />
          <Button
            size="xl"
            onPress={() => router.push({ pathname: "/pantry" })}
          >
            <ButtonText>Go To Pantry</ButtonText>
            <FontAwesome name="long-arrow-right" size={20} />
          </Button>
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
          <FontAwesome name="cog" size={18} />
        </FabLabel>
      </Fab>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
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
