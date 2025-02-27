import { ScrollView, StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import Spacer from "@/components/ui/Spacer";
import { HStack } from "@/components/ui/hstack";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/components/ui/radio";
import { CircleIcon } from "@/components/ui/icon";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import colors from "tailwindcss/colors";
import React from "react";
import { DietaryPreference, Difficulty, MealCategory } from "@/models/recipes";
import { DietaryRestrictionChip } from "@/components/DietaryRestrictionChip";
import useRecipes from "@/store/recipes";

export default function RecipeConfiguration() {
  const [difficulty, setDifficulty] =
    React.useState<Difficulty>("intermediate");
  const [mealCategory, setMealCategory] = React.useState<MealCategory>("any");
  const [dietaryPreferences, setDietaryPreferences] = React.useState<
    {
      preference: DietaryPreference;
      isSelected: boolean;
    }[]
  >([
    { preference: "gluten-free", isSelected: false },
    { preference: "dairy-free", isSelected: false },
    { preference: "vegan", isSelected: false },
    { preference: "vegetarian", isSelected: false },
    { preference: "seafood-free", isSelected: false },
    { preference: "ketogenic", isSelected: false },
    { preference: "whole30", isSelected: false },
    { preference: "peanut-free", isSelected: false },
    { preference: "soy-free", isSelected: false },
    { preference: "paleo", isSelected: false },
    { preference: "sulfite-free", isSelected: false },
    { preference: "low-fodmap", isSelected: false },
    { preference: "high-protein", isSelected: false },
  ]);

  const { recipePreferences, setRecipePreferences } = useRecipes();

  React.useEffect(() => {
    setDifficulty(recipePreferences.difficulty);
    setMealCategory(recipePreferences.mealCategory);
    setDietaryPreferences((prev) =>
      prev.map((pref) => ({
        ...pref,
        isSelected: recipePreferences.dietaryPreferences.includes(
          pref.preference
        ),
      }))
    );
  }, []);

  const onDietaryPreferencePressed = (preference: DietaryPreference) => {
    setDietaryPreferences((prev) =>
      prev.map((pref) =>
        pref.preference === preference
          ? { ...pref, isSelected: !pref.isSelected }
          : pref
      )
    );
  };

  const updateRecipeSettings = () => {
    const selectedDietaryPreferences = dietaryPreferences
      .filter((preference) => preference.isSelected)
      .map((preference) => preference.preference);

    setRecipePreferences({
      difficulty,
      mealCategory,
      dietaryPreferences: selectedDietaryPreferences,
    });

    router.back();
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text size="3xl">Configure</Text>
        <Divider style={{ width: "40%" }} />
        <Text size="3xl">Recipe Settings</Text>
        <Text size="sm" style={{ marginTop: 10, width: "95%" }}>
          Configure how your recipes are generated. Keep in mind that these are
          global settings and will affect all recipes.
        </Text>
        <Spacer />
        <Spacer />
        <Text size="lg" bold style={{ width: "85%", marginBottom: 5 }}>
          Recipe Difficulty Level
        </Text>
        <RadioGroup
          value={difficulty}
          onChange={setDifficulty}
          style={{
            width: "85%",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <HStack space="2xl">
            <Radio value="simple" size="lg">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>Simple</RadioLabel>
            </Radio>
            <Radio value="intermediate" size="lg">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>Intermediate</RadioLabel>
            </Radio>
            <Radio value="advanced" size="lg">
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>Advanced</RadioLabel>
            </Radio>
          </HStack>
        </RadioGroup>
        <Spacer />
        <Spacer />
        <Text size="lg" bold style={{ width: "85%" }}>
          Meal Category
        </Text>
        <Select
          defaultValue="any"
          onValueChange={(value) => setMealCategory(value as MealCategory)}
          style={{ width: "85%" }}
          selectedValue={mealCategory}
        >
          <Spacer />
          <SelectTrigger variant="outline" size="lg">
            <SelectInput placeholder="Meal Category ... lunch, dinner, snack, etc." />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Any" value="any" />
              <SelectItem label="Snack" value="snack" />
              <SelectItem label="Breakfast" value="breakfast" />
              <SelectItem label="Lunch" value="lunch" />
              <SelectItem label="Dinner" value="dinner" />
              <SelectItem label="Dessert" value="dessert" />
              <SelectItem label="Appetizer" value="appetizer" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <Spacer />
        <View style={styles.switchContainer}>
          <Text size="lg" bold style={{ width: "85%" }}>
            Include Recipes with missing ingredients
          </Text>
          <Switch
            size="md"
            isDisabled={true}
            trackColor={{
              false: colors.neutral[300],
              true: colors.neutral[600],
            }}
            thumbColor={colors.neutral[50]}
            ios_backgroundColor={colors.neutral[300]}
          ></Switch>
        </View>
        <Spacer />
        <Text size="lg" bold style={{ width: "85%" }}>
          Dietary Preferences
        </Text>
        <Spacer />
        <View style={styles.dietaryPreferences}>
          {dietaryPreferences.map((preference, index) => (
            <DietaryRestrictionChip
              key={index}
              name={preference.preference}
              isSelected={preference.isSelected}
              onPress={() => onDietaryPreferencePressed(preference.preference)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button size="xl" onPress={updateRecipeSettings}>
          <ButtonText>Update Settings</ButtonText>
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "85%",
  },
  dietaryPreferences: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "86%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
  },
});
