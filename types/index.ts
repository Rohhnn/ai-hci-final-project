export interface UserPreferences {
    goals: string[];
    restrictions: string[];
    activityDays: string[];
    pantryItems: string[];
  }
  
  export interface NutrientData {
    name: string;
    amount: number;
    unit: string;
    percentOfDailyNeeds: number;
  }
  
  export interface RecipeIngredient {
    id: number;
    name: string;
    amount: number;
    unit: string;
    aisle: string;
  }
  
  export interface Meal {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    servings: number;
    pricePerServing: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: RecipeIngredient[];
    nutrients: NutrientData[];
    mealType: "breakfast" | "lunch" | "dinner";
    sourceUrl?: string;
  }
  
  export interface DayPlan {
    day: string;
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
  }
  
  export interface MealPlan {
    days: DayPlan[];
  }
  
  export interface GroceryItem {
    name: string;
    amount: number;
    unit: string;
    aisle: string;
    usedInMeals: string[];
    inPantry: boolean;
    estimatedCost?: number;
  }
  
  export type GroceryList = Record<string, GroceryItem[]>;