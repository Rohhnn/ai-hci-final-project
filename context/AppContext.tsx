"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserPreferences, MealPlan, GroceryList } from "@/types";

interface AppContextType {
  preferences: UserPreferences;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  mealPlan: MealPlan | null;
  setMealPlan: (plan: MealPlan) => void;
  groceryList: GroceryList | null;
  setGroceryList: (list: GroceryList) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  generationError: string | null;
  setGenerationError: (err: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  goals: [],
  restrictions: [],
  activityDays: [],
  pantryItems: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<UserPreferences>(defaultPreferences);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const setPreferences = (prefs: Partial<UserPreferences>) => {
    setPreferencesState((prev) => ({ ...prev, ...prefs }));
  };

  return (
    <AppContext.Provider
      value={{
        preferences,
        setPreferences,
        mealPlan,
        setMealPlan,
        groceryList,
        setGroceryList,
        isGenerating,
        setIsGenerating,
        generationError,
        setGenerationError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}