import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export interface RecipeGenerationParameters {
  numOfIngredients: number;
  dietaryRestrictions: "gluten-free" | "vegetarian" | "vegan" | "none";
  mealCategory: "snack" | "breakfast" | "lunch" | "dinner";
  cuisine:
    | "American"
    | "Chinese"
    | "Indian"
    | "Italian"
    | "Japanese"
    | "Mexican"
    | "Thai"
    | "BBQ";
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  dietary_info: string[]; // e.g., ["Vegetarian", "Gluten-Free"]
  ingredients: Ingredient[];
  instructions: string[];
  prep_time_minutes: number;
  servings: number;
  cooking_method: string; // e.g., "Baked", "Fried"
  required_equipment: string[]; // e.g., ["Oven", "Mixing Bowl"]
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimated_cost: string; // e.g., "$10"
  nutrition: Nutrition;
  ratings: number; // e.g., 4.5
  meal_category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  image_url: string;
}

export interface Ingredient {
  name: string;
  quantity: string; // e.g., "1 cup", "200g"
}

export interface Nutrition {
  calories: number;
  protein: string; // e.g., "15g"
  fat: string; // e.g., "10g"
  carbs: string; // e.g., "50g"
}

export interface PantryStore {
  recipes: Recipe[];
  setRecipes: (newRecipes: Recipe[]) => void;
  getById: (id: string) => Recipe | undefined;
}

const useRecipes = create<PantryStore, [["zustand/persist", unknown]]>(
  persist(
    (set, get) => ({
      recipes: [],
      setRecipes: (recipes: Recipe[]) => {
        const recipesWithId = recipes.map((recipe) => ({
          ...recipe,
          id: uuid.v4(),
        }));
        set({ recipes: recipesWithId });
      },
      getById: (id: string) => {
        const { recipes } = get();
        return recipes.find((recipe) => recipe.id === id);
      },
    }),
    {
      name: "recipes", // Storage key
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);

export default useRecipes;
