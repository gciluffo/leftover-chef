import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenAI } from "openai";

const SYSTEM_PROMPT = `
"You are a helpful AI that generates recipe suggestions based on available ingredients.
Given a list of ingredients, return a structured JSON response containing a list of popular recipes (at least 5) that can be made using those ingredients.
Each recipe should include the title, description, list of ingredients with their required quantities, step-by-step instructions, estimated preparation time, and the number of servings.
You must use ingredients that are typical or traditional for each recipe. Do not replace or swap out core ingredients with alternatives unless they are commonly accepted substitutions in a recipe.

The JSON output must strictly follow this format:
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
      "meal_category": "Dinner",
    }
  ]
}

Ensure that only well-known and popular recipes are suggested, and ingredients should make sense in the context of the dish.
Do not invent random or overly complex dishes. 
Prioritize recipes that use most of the given ingredients while requiring minimal extra ingredients.
Make sure to include precise cooking instructions. 
Make sure to maximize flavor and variety in the suggested recipes. 
Keep the response concise, relevant, and properly formatted as valid JSON."
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

  static async generateRecipes(ingredients: string[]): Promise<any> {
    if (!ingredients || ingredients.length === 0) {
      throw new Error("No ingredients provided.");
    }

    const cachedRecipes = await this.getCachedRecipes(ingredients);
    if (cachedRecipes) return cachedRecipes;

    try {
      console.log("making api request");
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [{ type: "text", text: ingredients.join(", ") }],
          },
        ],
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error("Failed to generate recipes.");
      }

      const content = response.choices[0]?.message?.content;
      const jsonString = content.replace(/```json\n|```/g, "");
      const parsedData = JSON.parse(jsonString);

      await this.cacheRecipes(ingredients, parsedData);
      return parsedData;
    } catch (error) {
      console.error("Error generating recipes:", error);
      throw new Error("Failed to generate recipes.");
    }
  }
}

export default RecipeService;
