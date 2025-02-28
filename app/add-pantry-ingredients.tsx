import { ScrollView, StyleSheet } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { View } from "@/components/Themed";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { IngredientChip } from "@/components/IngredientChip";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText } from "@/components/ui/button";
import usePantry from "@/store/pantry";
import { categorizeIngredient } from "@/utils/ingredient-categorizer";
import { IngredientCategory } from "@/components/IngredientCategory";
import { router } from "expo-router";
import { Pantry } from "@/models/pantry";
import Spacer from "@/components/ui/Spacer";

export default function AddPantryIngredients() {
  const [input, setInput] = useState<string>("");
  const [ingredients, setIngredients] = useState<Partial<Pantry>>({});
  const { mergePantryItems } = usePantry();

  const handleAddIngredient = () => {
    if (input.trim()) {
      const pantryKey = categorizeIngredient(input.trim());

      if (pantryKey) {
        setIngredients((prev) => {
          const newPantry = { ...prev };

          if (newPantry[pantryKey]) {
            newPantry[pantryKey].push(input.trim());
          } else {
            newPantry[pantryKey] = [input.trim()];
          }

          return newPantry;
        });
      }
      setInput("");
    }
  };

  const addIngredients = () => {
    mergePantryItems(ingredients as Pantry);
    router.back();
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text size="3xl">Whats In</Text>
        <Divider style={{ width: "40%" }} />
        <Text size="3xl">Your Pantry</Text>
        <Spacer />
        <Text size="sm">
          Type in your ingredients. We will try to categorize your ingredients
          as best we can. The more specific the ingredient the better recipe
          results you will get.
        </Text>

        <Spacer />
        <Input variant="outline" size="xl">
          <InputField
            placeholder="Type an ingredient. Tap return to add"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAddIngredient}
            blurOnSubmit={false}
          />
        </Input>

        <View style={styles.ingredientCategories}>
          {Object.keys(ingredients).map((category) => (
            <IngredientCategory key={category} title={category}>
              <View style={styles.ingredients}>
                {(ingredients as any)[category]?.map((ingredient: string) => (
                  <IngredientChip key={ingredient} name={ingredient} />
                ))}
              </View>
            </IngredientCategory>
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button size="xl" onPress={addIngredients}>
          <ButtonText>Add Ingredients</ButtonText>
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    margin: 8,
    alignItems: "center",
  },
  ingredientCategories: {
    marginTop: 20,
    flexDirection: "column",
    flexWrap: "wrap",
    width: "95%",
  },
  ingredients: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "flex-end",
    margin: 40,
  },
});
