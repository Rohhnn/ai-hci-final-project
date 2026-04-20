import { Meal, RecipeIngredient, NutrientData } from "@/types";

const BASE = "https://api.spoonacular.com";

function getDietParam(restrictions: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  const dietMap: Record<string, string> = {
    vegetarian: "vegetarian",
    vegan: "vegan",
    paleo: "paleo",
    keto: "ketogenic",
  };
  const intoleranceMap: Record<string, string> = {
    "gluten-free": "gluten",
    "dairy-free": "dairy",
    "nut-free": "tree nut",
  };
  const diets = restrictions.filter((r) => dietMap[r]).map((r) => dietMap[r]);
  const intolerances = restrictions.filter((r) => intoleranceMap[r]).map((r) => intoleranceMap[r]);
  if (diets.length) params.diet = diets[0];
  if (intolerances.length) params.intolerances = intolerances.join(",");
  return params;
}

function getNutrientValue(nutrients: NutrientData[], name: string): number {
  return nutrients.find((n) => n.name.toLowerCase() === name.toLowerCase())?.amount ?? 0;
}

function parseMeal(result: any, mealType: "breakfast" | "lunch" | "dinner"): Meal {
  const nutrients: NutrientData[] = result.nutrition?.nutrients ?? [];
  const ingredients: RecipeIngredient[] = (result.extendedIngredients ?? []).map((ing: any) => ({
    id: ing.id,
    name: ing.name,
    amount: Number((ing.amount ?? 0).toFixed(2)),
    unit: ing.unit ?? "",
    aisle: ing.aisle ?? "Other",
  }));

  return {
    id: result.id,
    title: result.title,
    image: result.image ?? "",
    readyInMinutes: result.readyInMinutes ?? 30,
    servings: result.servings ?? 2,
    pricePerServing: result.pricePerServing ?? 0,
    calories: Math.round(getNutrientValue(nutrients, "Calories")),
    protein: Math.round(getNutrientValue(nutrients, "Protein")),
    carbs: Math.round(getNutrientValue(nutrients, "Carbohydrates")),
    fat: Math.round(getNutrientValue(nutrients, "Fat")),
    ingredients,
    nutrients,
    mealType,
    sourceUrl: result.sourceUrl,
  };
}

async function searchByQuery(
  query: string,
  restrictions: string[],
  mealType: "breakfast" | "lunch" | "dinner"
): Promise<Meal | null> {
  const dietParams = getDietParam(restrictions);
  const params = new URLSearchParams({
    apiKey: process.env.SPOONACULAR_API_KEY!,
    query,
    number: "1",
    addRecipeNutrition: "true",
    addRecipeInformation: "true",
    fillIngredients: "true",
    ...dietParams,
  });

  try {
    const res = await fetch(`${BASE}/recipes/complexSearch?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results?.length) return null;
    return parseMeal(data.results[0], mealType);
  } catch {
    return null;
  }
}

const FALLBACKS: Record<"breakfast" | "lunch" | "dinner", string> = {
  breakfast: "healthy breakfast eggs",
  lunch: "healthy chicken salad",
  dinner: "healthy pasta dinner",
};

export async function searchRecipe(
  query: string,
  restrictions: string[],
  mealType: "breakfast" | "lunch" | "dinner"
): Promise<Meal | null> {
  const result = await searchByQuery(query, restrictions, mealType);
  if (result) return result;
  return searchByQuery(FALLBACKS[mealType], restrictions, mealType);
}

export async function getRecipeById(id: number): Promise<Meal | null> {
  try {
    const params = new URLSearchParams({
      apiKey: process.env.SPOONACULAR_API_KEY!,
      includeNutrition: "true",
    });
    const res = await fetch(`${BASE}/recipes/${id}/information?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    return parseMeal(data, "dinner");
  } catch {
    return null;
  }
}