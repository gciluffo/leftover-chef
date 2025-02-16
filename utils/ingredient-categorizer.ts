import { Pantry } from "@/models/pantry";
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
import { levenshteinDistance } from "./fuzzy";

type PantryKey = keyof Pantry;

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
