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
import { extractIngredientsFromImage } from "@/services/image-to-text";
import usePantry from "@/store/pantry";
import { IngredientCategory } from "@/components/IngredientCategory";
import { IngredientChip } from "@/components/IngredientChip";
import { Pantry } from "@/models/pantry";
import MergeIngredientsModal from "@/components/MergeIngredientsModal";
import { IngredientChipActionSheet } from "@/components/IngredientChipActionSheet";

export default function ScanResults() {
  const [showIngredientActionSheet, setShowIngredientActionSheet] =
    useState(false);
  const [activeIngredient, setActiveIngredient] = useState<{
    ingredient: string;
    category: string;
  } | null>(null);
  const handleClose = () => setShowIngredientActionSheet(false);
  const [loading, setLoading] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [proposedIngredients, setProposedIngredients] = useState<Pantry>();
  const { setPantryItems, mergePantryItems } = usePantry();
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
    if (proposedIngredients) {
      setMergeModalOpen(true);
    }
  };

  const onMergeIngredientsSelected = () => {
    if (proposedIngredients) mergePantryItems(proposedIngredients);

    router.replace({
      pathname: "/pantry",
    });
  };

  const onReplaceIngredientsSelected = () => {
    if (proposedIngredients) setPantryItems(proposedIngredients);

    router.replace({
      pathname: "/pantry",
    });
  };

  const onIngredientPressed = (ingredient: string, category: string) => {
    setActiveIngredient({ ingredient, category });
    setShowIngredientActionSheet(true);
  };

  const onIngredientDeleted = () => {
    if (activeIngredient) {
      // remove ingredient
      if (proposedIngredients) {
        proposedIngredients[activeIngredient.category as keyof Pantry] = (
          proposedIngredients[
            activeIngredient.category as keyof Pantry
          ] as string[]
        ).filter((i: string) => i !== activeIngredient.ingredient);
      }
    }
    handleClose();
  };

  const onCategoryChanged = (category: string) => {
    if (activeIngredient) {
      // remove
      if (
        proposedIngredients &&
        proposedIngredients[category as keyof Pantry]
      ) {
        (proposedIngredients[category as keyof Pantry] as string[]).filter(
          (i: string) => i !== activeIngredient.ingredient
        );
      }

      // add
      if (proposedIngredients) {
        proposedIngredients[category as keyof Pantry] = [
          ...(proposedIngredients[category as keyof Pantry] as string[]),
          activeIngredient.ingredient,
        ];
      }
    }

    handleClose();
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
                  <IngredientChip
                    key={ingredient}
                    name={ingredient}
                    onPress={() => onIngredientPressed(ingredient, category)}
                  />
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
      <MergeIngredientsModal
        showModal={mergeModalOpen}
        onMergeSelected={onMergeIngredientsSelected}
        onReplaceSelected={onReplaceIngredientsSelected}
      />
      <IngredientChipActionSheet
        onCategoryChange={(category) => onCategoryChanged(category)}
        onDelete={onIngredientDeleted}
        isOpen={showIngredientActionSheet}
        onClose={handleClose}
      />
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
