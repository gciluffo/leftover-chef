import { levenshteinDistance } from "./fuzzy";

export function getMissingIngredients(
  pantryIngredients: string[],
  inputIngredients: string[]
): string[] {
  const scoreThreshold = 4;

  const missingIngredients = [];

  for (const ingredient of inputIngredients) {
    let topScore = Infinity;
    for (const pantryIngredient of pantryIngredients) {
      const score = levenshteinDistance(pantryIngredient, ingredient);
      if (score < topScore) {
        topScore = score;
      }
    }

    if (topScore >= scoreThreshold) {
      missingIngredients.push(ingredient);
    }
  }

  return missingIngredients;
}
