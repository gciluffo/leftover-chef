import { Recipe, RecipePreferences } from "@/models/recipes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OpenAI } from "openai";

const SYSTEM_PROMPT = `You are a professional recipe assistant that provides high-quality, well-known recipes based on available ingredients. Suggest recipes that you might find on a **popular recipe website** (e.g., AllRecipes, Food Network, Serious Eats).

If key ingredients are missing, suggest a **common variation** or the closest recognizable recipe.
Prioritize **recipes that are widely known and commonly prepared** in home kitchens. 

Each recipe must also include a **genericTitle**, which is a simplified version of the title.  
For example, if the title is "Spicy Sriracha Deviled Eggs," the genericTitle should be "Deviled Eggs."  
This helps when searching for general recipes in external APIs.`;

// Construct user prompt dynamically
const userPromptV2 = (
  ingredients: string[],
  recipePreferences: RecipePreferences
) => {
  return {
    ingredients: ingredients,
    preferences: recipePreferences,
    instructions: `Generate **realistic, well-known recipes** using the given ingredients and preferences. 
  
  - The recipes **must be dishes commonly found on popular recipe websites**.
  - If key ingredients are missing, suggest a **close, recognizable dish** rather than forcing an unusual creation.
  - Follow common culinary conventions and ingredient pairings.
  - Ensure all recipes align with the user's dietary restrictions, difficulty level, and available equipment.
  - Include a **genericTitle** field that represents a simplified, common name of the recipe. 
    - Example: "Spicy Sriracha Deviled Eggs" → "Deviled Eggs"
    - Example: "Garlic Butter Salmon with Lemon" → "Salmon with Lemon"
    - Example: "Classic Margherita Pizza" → "Margherita Pizza"
  - Generate as many recipe combinations as possible
  - The response must be a valid JSON object following this format:
  
  {
    "recipes": [
      {
        "title": "Recipe Name",
        "description": "A short description of the dish.",
        "cuisine": "Italian",
        "dietary_info": ["Vegetarian", "Gluten-Free", "Vegan", ...],
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
        "genericTitle": "A Generic Title",
        "nutrition": {
          "calories": 350,
          "protein": "15g",
          "fat": "10g",
          "carbs": "50g"
        },
        "meal_category": "Dinner"
      }
    ]
  }`,
  };
};

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
    // console.log(ingredients);
    // console.log(recipePreferences);
    const userContent = JSON.stringify(
      userPromptV2(ingredients, recipePreferences)
    );
    // console.log(userContent);

    try {
      console.log("making api request to open ai");
      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        // model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: userContent,
          },
        ],
      });

      if (!response.choices[0]?.message?.content) {
        console.log(response);
        throw new Error("Failed to generate recipes.");
      }

      const content = response.choices[0]?.message?.content;
      const jsonString = content.replace(/```json\n|```/g, "");
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
