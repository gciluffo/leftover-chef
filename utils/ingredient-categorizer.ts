import { Pantry } from "@/store/pantry";
import {
  BAKING_INGREDIENTS,
  DAIRY_INGREDIENTS,
  FRESH_PRODUCT_INGREDIENTS,
  GRAINS_AND_BREADS_INGREDIENTS,
  MEAT_AND_POULTRY_INGREDIENTS,
  OILS_AND_FATS_INGREDIENTS,
  SAUCES_AND_CONDIMENT_INGREDIENTS,
  SPICES_AND_SEASONINGS_INGREDIENTS,
} from "./ingredient-lists";

type PantryKey = keyof Pantry;

function levenshteinDistance(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

function findClosestMatch(input: string, list: string[], category?: PantryKey) {
  let closestMatch = null;
  let minDistance = Infinity;

  for (const item of list) {
    const distance = levenshteinDistance(
      input.toLowerCase(),
      item.toLowerCase()
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = item;
    }
  }

  return { match: closestMatch, score: minDistance, category };
}

export function categorizeIngredient(
  ingredient: string
): PantryKey | undefined {
  const freshProduceScore = findClosestMatch(
    ingredient,
    FRESH_PRODUCT_INGREDIENTS,
    "freshProduce"
  );
  const dairyScore = findClosestMatch(ingredient, DAIRY_INGREDIENTS, "dairy");
  const meatScore = findClosestMatch(
    ingredient,
    MEAT_AND_POULTRY_INGREDIENTS,
    "meatAndPoultry"
  );
  const bakingScore = findClosestMatch(
    ingredient,
    BAKING_INGREDIENTS,
    "baking"
  );
  const spicesAndSeasoningsScore = findClosestMatch(
    ingredient,
    SPICES_AND_SEASONINGS_INGREDIENTS,
    "spicesAndSeasonings"
  );
  const condimentsAndSaucesScore = findClosestMatch(
    ingredient,
    SAUCES_AND_CONDIMENT_INGREDIENTS,
    "condimentsAndSauces"
  );
  const oilsAndFatsScore = findClosestMatch(
    ingredient,
    OILS_AND_FATS_INGREDIENTS,
    "oilsAndFats"
  );
  const grainsAndBreadScore = findClosestMatch(
    ingredient,
    GRAINS_AND_BREADS_INGREDIENTS,
    "grainsAndBread"
  );

  const scores = [
    freshProduceScore,
    dairyScore,
    meatScore,
    bakingScore,
    spicesAndSeasoningsScore,
    condimentsAndSaucesScore,
    oilsAndFatsScore,
    grainsAndBreadScore,
  ];

  //   console.log({ scores });

  let currentScore = Infinity;

  for (const score of scores) {
    if (score.score < currentScore) {
      currentScore = score.score;
    }
  }

  return (
    scores.find((score) => score.score === currentScore)?.category || "unknown"
  );
}
