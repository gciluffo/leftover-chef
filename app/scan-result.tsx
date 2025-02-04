import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { extractIngredientsFromImage } from "@/services/openai";
import useFoodStore, { Pantry } from "@/store/pantry";
import { IngredientCategory } from "@/components/IngredientCategory";
import { FoodChip } from "@/components/IngredientChip";

export default function ScanResults() {
  const [loading, setLoading] = useState(false);
  const [proposedIngredients, setProposedIngredients] = useState<Pantry>();
  const { setFoodCategories, foodCategories } = useFoodStore();
  const params = useLocalSearchParams();
  const { photoUri } = params;

  useEffect(() => {
    const init = async () => {
      if (photoUri && !Array.isArray(photoUri)) {
        try {
          setLoading(true);
          console.log("making call");
          const response = await extractIngredientsFromImage(photoUri);
          setProposedIngredients(response);
        } catch (error) {
          console.log({ error });
        } finally {
          setLoading(false);
        }
      }
    };

    init();
  }, []);

  const importIngredients = () => {
    console.log("importing ingredients");
    if (proposedIngredients) {
      setFoodCategories(proposedIngredients);
    }

    router.replace({
      pathname: "/pantry",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Text>Scan Results</Text>
      {proposedIngredients &&
        Object.keys(proposedIngredients).map((category) => (
          <View key={category}>
            <IngredientCategory title={category}>
              {(foodCategories as any)[category].map((ingredient: string) => (
                <FoodChip key={ingredient} name={ingredient} />
              ))}
            </IngredientCategory>
          </View>
        ))}
      <Button title="Import Ingredients" onPress={importIngredients} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    // flex: 1,
    // justifyContent: "center",
  },
});
