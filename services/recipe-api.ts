import { ExternalRecipe } from "@/models/recipes";

export interface Response {
  recipes: ExternalRecipe[];
}

export async function searchRecipeName(recipeName: string): Promise<Response> {
  try {
    const res = await fetch(
      `http://localhost:3000/recipes/search?q=${encodeURIComponent(recipeName)}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error searching for recipe by name:", error);
    throw new Error("Failed to search for recipe by name.");
  }
}
