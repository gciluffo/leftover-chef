import { Pantry } from "@/store/pantry";

export const NumberOfIngredientsInPantry = (pantry: Pantry) => {
  return Object.values(pantry).reduce((acc, curr) => acc + curr.length, 0);
};
