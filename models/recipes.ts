export type DietaryPreference =
  | "gluten-free"
  | "dairy-free"
  | "vegetarian"
  | "vegan"
  | "peanut-free"
  | "soy-free"
  | "ketogenic"
  | "paleo"
  | "whole30"
  | "seafood-free"
  | "sulfite-free"
  | "low-fodmap"
  | "high-protein";

export type MealCategory =
  | "any"
  | "snack"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "appetizer";

export type Cuisine =
  | "American"
  | "Chinese"
  | "Indian"
  | "Italian"
  | "Japanese"
  | "Mexican"
  | "Thai"
  | "BBQ";

export type Equipment =
  | "Oven"
  | "Stove"
  | "Blender"
  | "Food Processor"
  | "Grill"
  | "Air Fryer";

export type Difficulty = "simple" | "intermediate" | "advanced";

export interface RecipePreferences {
  difficulty: Difficulty;
  dietaryPreferences: DietaryPreference[];
  mealCategory: MealCategory;
  cuisine?: Cuisine;
  includeRecipesWithMissingIngredients?: boolean;
  prepTime?: number;
  equipment?: Equipment;
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
  difficulty: Difficulty;
  estimated_cost: string; // e.g., "$10"
  nutrition: Nutrition;
  ratings: number; // e.g., 4.5
  meal_category: MealCategory;
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
