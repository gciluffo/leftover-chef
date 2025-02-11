import { ScrollView, StyleSheet } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { View } from "@/components/Themed";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { IngredientChip } from "@/components/IngredientChip";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText } from "@/components/ui/button";
import usePantry from "@/store/pantry";
import { useLocalSearchParams, router } from "expo-router";
import { camelToTitleCase } from "@/utils/formatting";
import { Pantry } from "@/models/pantry";

export default function AddCategoryIngredients() {
  const [input, setInput] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const params = useLocalSearchParams();
  const { category } = params;
  const { addIngredient } = usePantry();

  const addProposedIngredient = () => {
    setIngredients((prev) => [...prev, input]);
    setInput("");
  };

  const save = () => {
    addIngredient(category as keyof Pantry, ingredients);

    router.replace({
      pathname: "/pantry",
    });
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text size="3xl">Add Ingredients</Text>
        <Divider style={{ width: "40%" }} />
        <Text size="3xl">
          {camelToTitleCase(Array.isArray(category) ? category[0] : category)}
        </Text>
        <Text size="sm" style={{ marginTop: 10, width: "95%" }}>
          Type in your ingredients. The more accurate the description of the
          ingredient the better recipe results you will get.
        </Text>

        <Input
          style={{ width: "95%", marginTop: 20 }}
          variant="outline"
          size="xl"
        >
          <InputField
            placeholder="Type an ingredient. Tap return to add"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => addProposedIngredient()}
            blurOnSubmit={false}
          />
        </Input>

        <View style={styles.ingredientCategories}>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredients}>
              <IngredientChip key={index} name={ingredient} />
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button size="xl" onPress={save}>
          <ButtonText>
            Add to{" "}
            {camelToTitleCase(Array.isArray(category) ? category[0] : category)}
          </ButtonText>
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
