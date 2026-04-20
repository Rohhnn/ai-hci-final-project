import Groq from "groq-sdk";
import { UserPreferences } from "@/types";

interface MealEntry {
  name: string;
  searchQuery: string;
}

interface DayPlan {
  day: string;
  breakfast: MealEntry;
  lunch: MealEntry;
  dinner: MealEntry;
}

export interface GeminiMealPlan {
  days: DayPlan[];
}

export async function generateMealPlanFromGemini(
  preferences: UserPreferences
): Promise<GeminiMealPlan> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const { goals, restrictions, activityDays, pantryItems } = preferences;

  const prompt = `You are a nutrition expert. Generate a complete 7-day meal plan.

User preferences:
- Health goals: ${goals.length ? goals.join(", ") : "balanced eating"}
- Dietary restrictions: ${restrictions.length ? restrictions.join(", ") : "none"}
- Active/workout days: ${activityDays.length ? activityDays.join(", ") : "none"} (suggest lighter breakfasts on these days only)
- Pantry items available: ${pantryItems.length ? pantryItems.join(", ") : "none"}

CRITICAL RULES:
- You MUST include ALL 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- Every single day MUST have breakfast, lunch, AND dinner. No exceptions.
- Keep searchQuery to 2-3 simple English words that Spoonacular can find easily
- Use common, well-known dishes for searchQuery (e.g. "chicken stir fry", "oatmeal berries", "pasta tomato")
- No meal should repeat across the week
${restrictions.includes("vegetarian") ? "- ALL meals must be vegetarian, absolutely no meat or fish" : ""}
${restrictions.includes("vegan") ? "- ALL meals must be vegan, no animal products whatsoever" : ""}
${restrictions.includes("gluten-free") ? "- ALL meals must be completely gluten-free" : ""}

Return ONLY a raw JSON object. No markdown, no backticks, no explanation before or after.

{
  "days": [
    {
      "day": "Monday",
      "breakfast": { "name": "Berry Oatmeal Bowl", "searchQuery": "oatmeal berries" },
      "lunch": { "name": "Grilled Chicken Salad", "searchQuery": "chicken salad" },
      "dinner": { "name": "Pasta Primavera", "searchQuery": "pasta primavera" }
    },
    {
      "day": "Tuesday",
      "breakfast": { "name": "Scrambled Eggs Toast", "searchQuery": "scrambled eggs toast" },
      "lunch": { "name": "Lentil Soup", "searchQuery": "lentil soup" },
      "dinner": { "name": "Baked Salmon", "searchQuery": "baked salmon" }
    }
  ]
}`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2500,
  });

  const text = completion.choices[0]?.message?.content?.trim() ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Groq returned no valid JSON");

  const parsed = JSON.parse(jsonMatch[0]) as GeminiMealPlan;

  // Guarantee all 7 days are present even if model skips some
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const presentDays = new Set(parsed.days.map((d) => d.day));
  const fallbackMeals = {
    breakfast: { name: "Oatmeal with Fruit", searchQuery: "oatmeal fruit" },
    lunch: { name: "Vegetable Soup", searchQuery: "vegetable soup" },
    dinner: { name: "Grilled Chicken Rice", searchQuery: "chicken rice" },
  };

  for (const day of allDays) {
    if (!presentDays.has(day)) {
      parsed.days.push({ day, ...fallbackMeals });
    }
  }

  parsed.days.sort((a, b) => allDays.indexOf(a.day) - allDays.indexOf(b.day));
  return parsed;
}