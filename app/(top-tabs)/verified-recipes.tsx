import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { ExternalRecipe, Recipe } from "@/models/recipes";
import useRecipes from "@/store/recipes";
import React, { useEffect, useMemo } from "react";
import VerifiedRecipeCard from "@/components/VerifiedRecipeCard";
import { useNavigation } from "@react-navigation/native";

export default function VerifiedRecipesScreen() {
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);

  const p = useNavigation();
  const recipeId = p?.getState()?.routes[0].params?.recipeId;
  const { getById } = useRecipes();

  useEffect(() => {
    if (!recipe && recipeId) {
      const r = getById(recipeId);

      if (r) setRecipe(r);
    }
  }, [recipeId]);

  const externalRecipes = useMemo(() => {
    if (!recipe) {
      return [];
    }

    return recipe.externalRecipeInfo;
  }, [recipe]);

  if (!externalRecipes.length) {
    return (
      <View style={styles.container}>
        <Text size="lg">No verified recipes for this recipe</Text>
      </View>
    );
  }

  const onPress = (r: ExternalRecipe) => {
    // router.push({
    //   pathname: "/(top-tabs)",
    //   params: {
    //     recipeId: recipe.id,
    //   },
    // });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {externalRecipes.length > 0 &&
        externalRecipes.map((r) => (
          <VerifiedRecipeCard
            key={r.image}
            recipe={r}
            onPress={() => onPress(r)}
          />
        ))}
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
