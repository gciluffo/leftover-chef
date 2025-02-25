import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Recipe } from "@/models/recipes";
import usePantry from "@/store/pantry";
import { getMissingIngredients } from "@/utils/ingredient-compare";
import { useMemo } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { green, purple, red } from "tailwindcss/colors";
import MissingIngredientsChip from "./MissingIngredientChip";
import { Image } from "expo-image";
import Spacer from "./ui/Spacer";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
const defaultImageUrl =
  "https://www.deadendbbq.com/wp-content/uploads/2022/06/blog-header.jpg";

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

function ExternalRecipeChip() {
  return (
    <View style={styles.externalRecipeChip}>
      <Text style={styles.externalRecipeChipText}>Verified Recipes</Text>
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

  const hasExternalRecipes = useMemo(() => {
    return recipe.externalRecipeInfo !== undefined;
  }, [recipe]);

  const imageUrl = useMemo(() => {
    if (!recipe) {
      return defaultImageUrl;
    }

    const externalRecipe = recipe.externalRecipeInfo[0];

    if (!externalRecipe) {
      return defaultImageUrl;
    }

    return externalRecipe.image;
  }, [recipe]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <Image
          style={styles.image}
          source={imageUrl}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Spacer />
        <Heading size="xl">{recipe.title}</Heading>
        <Text>{recipe.description}</Text>
        <Text>Prep time: {recipe.prep_time_minutes} minutes</Text>
        <View style={styles.chipContainer}>
          {recipe.dietary_info.length > 0 &&
            recipe.dietary_info.map((d) => (
              <DietaryInfoChip dietaryInfo={d} key={d} />
            ))}
          {hasMissingIngredients && <MissingIngredientsChip />}
          {hasExternalRecipes && <ExternalRecipeChip />}
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
  externalRecipeChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: purple[700],
    padding: 3,
  },
  externalRecipeChipText: {
    color: purple[500],
  },
  image: {
    flex: 1,
    width: "100%",
    height: 200,
    borderRadius: 5,
    backgroundColor: "#0553",
  },
});

export default RecipeCard;
