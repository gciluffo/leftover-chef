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
