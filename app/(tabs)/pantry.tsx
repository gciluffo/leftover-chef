import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import usePantry from "@/store/pantry";
import { IngredientCategory } from "@/components/IngredientCategory";
import { IngredientChip } from "@/components/IngredientChip";
import { ScrollView } from "react-native";
import { Fab, FabLabel } from "@/components/ui/fab";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { IngredientChipActionSheet } from "@/components/IngredientChipActionSheet";
import { Pantry as PantryType } from "@/models/pantry";

export default function Pantry() {
  const [showIngredientActionSheet, setShowIngredientActionSheet] =
    useState(false);
  const [activeIngredient, setActiveIngredient] = useState<{
    ingredient: string;
    category: string;
  } | null>(null);
  const handleClose = () => setShowIngredientActionSheet(false);
  const { pantryItems, removeIngredient, addIngredient, clearCategory } =
    usePantry();

  const onAddPress = () => {
    router.push({
      pathname: "/add-pantry-ingredients",
    });
  };

  const onIngredientPressed = (ingredient: string, category: string) => {
    setActiveIngredient({ ingredient, category });
    setShowIngredientActionSheet(true);
  };

  const onIngredientDeleted = () => {
    if (activeIngredient) {
      removeIngredient(
        activeIngredient.category as keyof PantryType,
        activeIngredient.ingredient
      );
    }
    handleClose();
  };

  const onCategoryChanged = (category: string) => {
    if (activeIngredient) {
      removeIngredient(
        activeIngredient.category as keyof PantryType,
        activeIngredient.ingredient
      );

      addIngredient(category as keyof PantryType, [
        activeIngredient.ingredient,
      ]);
    }

    handleClose();
  };

  const onCategoryAddIngredients = (category: string) => {
    router.push({
      pathname: "/add-category-ingredients",
      params: {
        category,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={styles.ingredientsContainer}>
          {pantryItems &&
            Object.keys(pantryItems).map((category) => (
              <View key={category}>
                <IngredientCategory
                  title={category}
                  showActions={true}
                  onClearCategory={() =>
                    clearCategory(category as keyof PantryType)
                  }
                  onAddIngredients={() => onCategoryAddIngredients(category)}
                >
                  <View style={styles.ingredients}>
                    {(pantryItems as any)[category].map(
                      (ingredient: string) => (
                        <IngredientChip
                          key={ingredient}
                          name={ingredient}
                          onPress={() =>
                            onIngredientPressed(ingredient, category)
                          }
                        />
                      )
                    )}
                  </View>
                </IngredientCategory>
              </View>
            ))}
        </View>
      </ScrollView>

      <Fab
        placement="bottom right"
        onPress={onAddPress}
        size="lg"
        style={styles.fab}
      >
        <FabLabel>
          <FontAwesome name="plus" size={15} />
        </FabLabel>
      </Fab>

      <IngredientChipActionSheet
        onCategoryChange={(category) => onCategoryChanged(category)}
        onDelete={onIngredientDeleted}
        isOpen={showIngredientActionSheet}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ingredientsContainer: {
    margin: 8,
    marginBottom: 50,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  ingredients: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
