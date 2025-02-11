import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { extractIngredientsFromImage } from "@/services/openai";
import usePantry from "@/store/pantry";
import { IngredientCategory } from "@/components/IngredientCategory";
import { IngredientChip } from "@/components/IngredientChip";
import { Pantry } from "@/models/pantry";

export default function ScanResults() {
  const [loading, setLoading] = useState(false);
  const [proposedIngredients, setProposedIngredients] = useState<Pantry>();
  const { setPantryItems } = usePantry();
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
      // TODO: Should add logic to display message. Do you want to override your current pantry or merge?
      setPantryItems(proposedIngredients);
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
      {proposedIngredients &&
        Object.keys(proposedIngredients).map((category) => (
          <View key={category}>
            <IngredientCategory title={category}>
              {(proposedIngredients as any)[category].map(
                (ingredient: string) => (
                  <IngredientChip key={ingredient} name={ingredient} />
                )
              )}
            </IngredientCategory>
          </View>
        ))}
      <View style={styles.buttonContainer}>
        <Button size="xl" onPress={importIngredients}>
          <ButtonText>Import Ingredients</ButtonText>
        </Button>
      </View>
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
    justifyContent: "center",
    alignContent: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "flex-end",
    margin: 40,
  },
});
