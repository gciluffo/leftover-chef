import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pantry } from "@/models/pantry";

export interface PantryStore {
  pantryItems: Pantry;
  setPantryItems: (newItems: Pantry) => void;
  mergePantryItems: (newItems: Pantry) => void;
  clearPantry: () => void;
  removeIngredient: (category: keyof Pantry, ingredient: string) => void;
  addIngredient: (category: keyof Pantry, ingredient: string[]) => void;
  clearCategory: (category: keyof Pantry) => void;
}

const usePantry = create<PantryStore, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      pantryItems: {
        freshProduce: [],
        dairy: [],
        meatAndPoultry: [],
        baking: [],
        spicesAndSeasonings: ["salt", "pepper"],
        condimentsAndSauces: [],
        oilsAndFats: [],
        grainsAndBread: [],
        leftovers: [],
        unknown: [],
      },
      mergePantryItems: (newItems: Pantry) =>
        set((state) => {
          const mergedItems = { ...state.pantryItems };
          Object.keys(newItems).forEach((category) => {
            mergedItems[category as keyof Pantry] = [
              ...new Set([
                ...mergedItems[category as keyof Pantry],
                ...newItems[category as keyof Pantry],
              ]),
            ];
          });
          return { pantryItems: mergedItems };
        }),
      setPantryItems: (pantryItems: Pantry) => set({ pantryItems }),
      clearPantry: () =>
        set({
          pantryItems: {
            freshProduce: [],
            dairy: [],
            meatAndPoultry: [],
            baking: [],
            spicesAndSeasonings: [],
            condimentsAndSauces: [],
            oilsAndFats: [],
            grainsAndBread: [],
            leftovers: [],
            unknown: [],
          },
        }),
      removeIngredient: (category: keyof Pantry, ingredient: string) =>
        set((state) => {
          const newItems = { ...state.pantryItems };
          newItems[category] = state.pantryItems[category].filter(
            (item) => item !== ingredient
          );
          return { pantryItems: newItems };
        }),
      addIngredient: (category: keyof Pantry, ingredient: string[]) =>
        set((state) => {
          const newItems = { ...state.pantryItems };
          newItems[category] = [...state.pantryItems[category], ...ingredient];
          newItems[category] = [...new Set(newItems[category])];
          return { pantryItems: newItems };
        }),
      clearCategory: (category: keyof Pantry) =>
        set((state) => {
          const newItems = { ...state.pantryItems };
          newItems[category] = [];
          return { pantryItems: newItems };
        }),
    }),
    {
      name: "pantry", // Storage key
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);

export default usePantry;
