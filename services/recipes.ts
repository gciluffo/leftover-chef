import { Recipe, RecipePreferences } from "@/models/recipes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenAI } from "openai";

const SYSTEM_PROMPT = `
You are a helpful AI that generates high-quality recipe suggestions based on provided ingredients and user preferences. 

## **Requirements**
- Generate a list of AT LEAST 3 recipes that match the provided ingredients and user preferences.
- If a dietary restriction applies, **strictly exclude** any restricted ingredients. 
  - **Only suggest substitutions** when they are commonly used in that type of recipe.
- Ensure that each recipe matches the **requested difficulty level**:
  - "Simple" = minimal steps, easy techniques.
  - "Intermediate" = moderate steps, basic cooking techniques.
  - "Advanced" = detailed preparation, possibly requiring advanced skills or specialized equipment.
- Ensure the recipes fit the **requested meal category** (e.g., "breakfast" recipes should be suitable for breakfast).

## **Strict Rules**
- Provide at least **3 recipes** that match the user's preferences.
- **ONLY** use the ingredients that have been provided. Do not add additional ingredients.
- If a required ingredient is missing for a traditional recipe, **adapt the recipe** using only the available ingredients.
- **DO NOT** suggest recipes that conflict with dietary restrictions.
- **DO NOT** suggest recipes that require ingredients not provided. Unless the preferences allow for recipes with missing ingredients.
- **Do not** invent substitutions unless they are commonly used and fit dietary restrictions.
- If a recipe is impossible with the given ingredients, **combine them creatively** to form a complete dish.

## **Response Format**
The JSON output **must strictly follow** this format:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "description": "A short description of the dish.",
      "cuisine": "Italian",
      "dietary_info": ["Vegetarian", "Gluten-Free"],
      "ingredients": [
        { "name": "Ingredient 1", "quantity": "1 cup" },
        { "name": "Ingredient 2", "quantity": "2 tbsp" }
      ],
      "instructions": [
        "Step 1: Do this.",
        "Step 2: Do that."
      ],
      "prep_time_minutes": 30,
      "servings": 2,
      "cooking_method": "Baked",
      "required_equipment": ["Oven", "Mixing Bowl"],
      "difficulty": "Intermediate",
      "nutrition": {
        "calories": 350,
        "protein": "15g",
        "fat": "10g",
        "carbs": "50g"
      },
      "meal_category": "Dinner"
    }
  ]
}
`;

const CACHE_KEY_PREFIX = "recipes_";

class RecipeService {
  private static client = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  });

  private static getCacheKey(ingredients: string[]): string {
    return CACHE_KEY_PREFIX + ingredients.sort().join(",");
  }

  static async getCachedRecipes(ingredients: string[]): Promise<any | null> {
    const key = this.getCacheKey(ingredients);
    const cachedData = await AsyncStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  static async cacheRecipes(ingredients: string[], data: any): Promise<void> {
    const key = this.getCacheKey(ingredients);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }

  static async generateRecipes(
    ingredients: string[],
    recipePreferences: RecipePreferences
  ): Promise<{ recipes: Recipe[] }> {
    if (!ingredients || ingredients.length === 0) {
      throw new Error("No ingredients provided.");
    }

    // const cachedRecipes = await this.getCachedRecipes(ingredients);
    // if (cachedRecipes) return cachedRecipes;

    try {
      console.log("making api request to open ai");
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              ingredients: ingredients,
              preferences: recipePreferences,
            }),
          },
        ],
      });

      if (!response.choices[0]?.message?.content) {
        console.log(response);
        throw new Error("Failed to generate recipes.");
      }

      console.log("response", response.choices[0]?.message?.content);
      const content = response.choices[0]?.message?.content;
      const jsonString = content.replace(/```json\n|```/g, "");
      console.log(jsonString);
      const parsedData = JSON.parse(jsonString);

      // await this.cacheRecipes(ingredients, parsedData);
      return parsedData;
    } catch (error) {
      console.error("Error generating recipes:", error);
      throw new Error("Failed to generate recipes.");
    }
  }
}

export default RecipeService;
