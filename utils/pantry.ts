import { Pantry } from "@/models/pantry";

export const NumberOfIngredientsInPantry = (pantry: Pantry): number => {
  return Object.values(pantry).reduce((acc, curr) => acc + curr.length, 0);
};
