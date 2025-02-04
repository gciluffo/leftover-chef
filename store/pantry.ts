import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Pantry {
  freshProduce: string[];
  dairy: string[];
  meats: string[];
  baking: string[];
  spicesAndSeasonings: string[];
  condimentsAndSauces: string[];
  oilsAndFats: string[];
  grainsAndBread: string[];
}

export interface PantryStore {
  foodCategories: Pantry;
  setFoodCategories: (newCategories: Pantry) => void;
  clearFoodCategories: () => void;
}

const useFoodStore = create<PantryStore, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      foodCategories: {
        freshProduce: [],
        dairy: [],
        meats: [],
        baking: [],
        spicesAndSeasonings: [],
        condimentsAndSauces: [],
        oilsAndFats: [],
        grainsAndBread: [],
      },
      setFoodCategories: (newCategories: Pantry) =>
        set({ foodCategories: newCategories }),
      clearFoodCategories: () =>
        set({
          foodCategories: {
            freshProduce: [],
            dairy: [],
            meats: [],
            baking: [],
            spicesAndSeasonings: [],
            condimentsAndSauces: [],
            oilsAndFats: [],
            grainsAndBread: [],
          },
        }),
    }),
    {
      name: "food-storage", // Storage key
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
    }
  )
);

export default useFoodStore;
