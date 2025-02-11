import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { Recipe, RecipePreferences } from "@/models/recipes";

export interface RecipeStore {
  recipes: Recipe[];
  recipePreferences: RecipePreferences;
  favoriteRecipes: Recipe[];
  setRecipePreferences: (preferences: RecipePreferences) => void;
  setRecipes: (newRecipes: Recipe[]) => void;
  getById: (id: string) => Recipe | undefined;
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (recipe: Recipe) => void;
  setFavoriteRecipes: (recipes: Recipe[]) => void;
}

const useRecipes = create<RecipeStore, [["zustand/persist", unknown]]>(
  persist(
    (set, get) => ({
      recipes: [],
      favoriteRecipes: [],
      recipePreferences: {
        difficulty: "intermediate",
        dietaryPreferences: [],
        mealCategory: "any",
      },
      setRecipePreferences: (preferences: RecipePreferences) => {
        set({ recipePreferences: preferences });
      },
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
      setFavoriteRecipes: (recipes: Recipe[]) => {
        set({ favoriteRecipes: recipes });
      },
      addFavorite: (recipe: Recipe) => {
        const { favoriteRecipes } = get();
        if (!favoriteRecipes.some((r) => r.id === recipe.id)) {
          set({ favoriteRecipes: [...favoriteRecipes, recipe] });
        }
      },
      removeFavorite: (recipe: Recipe) => {
        set({
          favoriteRecipes: get().favoriteRecipes.filter(
            (r) => r.id !== recipe.id
          ),
        });
      },
    }),
    {
      name: "recipes", // Storage key
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);

export default useRecipes;
