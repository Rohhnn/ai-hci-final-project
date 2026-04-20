import { NextRequest, NextResponse } from "next/server";
import { generateMealPlanFromGemini } from "@/lib/gemini";
import { searchRecipe } from "@/lib/spoonacular";
import { MealPlan, DayPlan } from "@/types";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const preferences = await req.json();
    const geminiPlan = await generateMealPlanFromGemini(preferences);

    const days: DayPlan[] = [];

    for (const day of geminiPlan.days) {
      const breakfast = await searchRecipe(
        day.breakfast.searchQuery,
        preferences.restrictions,
        "breakfast"
      );
      await sleep(300);

      const lunch = await searchRecipe(
        day.lunch.searchQuery,
        preferences.restrictions,
        "lunch"
      );
      await sleep(300);

      const dinner = await searchRecipe(
        day.dinner.searchQuery,
        preferences.restrictions,
        "dinner"
      );
      await sleep(300);

      days.push({
        day: day.day,
        breakfast: breakfast ?? null,
        lunch: lunch ?? null,
        dinner: dinner ?? null,
      });
    }

    const mealPlan: MealPlan = { days };
    return NextResponse.json(mealPlan);
  } catch (err) {
    console.error("Meal plan generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}