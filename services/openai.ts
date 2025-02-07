import { Pantry } from "@/store/pantry";
import * as FileSystem from "expo-file-system";
import { OpenAI } from "openai";

const IMAGE_PROMPT = `
*"Analyze the provided image of a refrigerator or pantry or a grocery receipt and extract a list of recognizable food ingredients.
Classify each item into the following categories: freshProduce, dairy, meats, baking, spicesAndSeasonings, condimentsAndSauces, oilsAndFats, and grainsAndBread.
If a brand name is clearly identifiable in pantry or fridge, include it (e.g., 'Sriracha' instead of 'hot sauce'). 
If the image is of a grocery receipt and items are in a different language then automatically translate them to English.
Return the response in the exact JSON format below, ensuring each detected item is correctly categorized:

{
  "freshProduce": [],
  "dairy": [],
  "meatAndPoultry": [],
  "baking": [],
  "spicesAndSeasonings": [],
  "condimentsAndSauces": [],
  "oilsAndFats": [],
  "grainsAndBread": []
}

Only list food items, omitting non-food objects. Maintain accuracy and consistency in categorization."*`;

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export const extractIngredientsFromImage = async (
  imageUri: string
): Promise<Pantry> => {
  if (!imageUri) {
    throw new Error("No image provided.");
  }

  if (process.env.EXPO_PUBLIC_MOCK_OPENAI) {
    return {
      freshProduce: ["apple", "banana"],
      dairy: ["milk", "cheese"],
      meatAndPoultry: ["chicken", "beef"],
      baking: ["flour", "sugar"],
      spicesAndSeasonings: ["salt", "pepper"],
      condimentsAndSauces: ["ketchup", "mustard"],
      oilsAndFats: ["olive oil", "butter"],
      grainsAndBread: ["bread", "rice"],
      unknown: [],
    };
  }

  try {
    // Convert image to Base64 using expo-file-system
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Send to OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: IMAGE_PROMPT,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error("Failed to analyze image.");
    }

    const content = response.choices[0]?.message?.content;
    const jsonString = content.replace(/```json\n|```/g, "");
    console.log(jsonString);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image.");
  }
};

const RECIPE_PROMT = (ingredients: string[]) => `
"You are a helpful AI that generates recipe suggestions based on available ingredients. Given a list of these ingredients ${ingredients.join(
  ","
)}, return a structured JSON response containing a list of popular recipes that can be made using those ingredients. Each recipe should include the title, description, list of ingredients with their required quantities, step-by-step instructions, estimated preparation time, and the number of servings. You must use ingredients that are typical or traditional for each recipe. Do not replace or swap out core ingredients with alternatives unless they are commonly accepted substitutions in a recipe.

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

Ensure that only well-known and popular recipes are suggested, and ingredients should make sense in the context of the dish. Do not invent random or overly complex dishes. Prioritize recipes that use most of the given ingredients while requiring minimal extra ingredients. Keep the response concise, relevant, and properly formatted as valid JSON."
`;

export const generateRecipes = async (ingredients: string[]): Promise<any> => {
  if (!ingredients || ingredients.length === 0) {
    throw new Error("No ingredients provided.");
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: RECIPE_PROMT(ingredients),
            },
          ],
        },
      ],
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error("Failed to generate recipes.");
    }

    const content = response.choices[0]?.message?.content;
    const jsonString = content.replace(/```json\n|```/g, "");
    console.log(jsonString);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes.");
  }
};
