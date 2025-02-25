import { Image } from "expo-image";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import useRecipes from "@/store/recipes";
import { Divider } from "@/components/ui/divider";
import React, { useEffect, useMemo } from "react";
import { Heading } from "@/components/ui/heading";
import Spacer from "@/components/ui/Spacer";
import { Recipe } from "@/models/recipes";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import usePantry from "@/store/pantry";
import { getMissingIngredients } from "@/utils/ingredient-compare";
import MissingIngredientsChip from "@/components/MissingIngredientChip";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {
  MaterialTopTabBarProps,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs>
      <MaterialTopTabs.Screen
        name="index"
        options={{ title: "AI Generated Recipe" }}
      />
      <MaterialTopTabs.Screen
        name="verified-recipes"
        options={{ title: "Related Verified Recipes" }}
      />
    </MaterialTopTabs>
  );
}
