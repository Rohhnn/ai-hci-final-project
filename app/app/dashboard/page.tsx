"use client";

import { useApp } from "@/context/AppContext";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted">{Math.round(value)}g</span>
      </div>
      <div className="h-2.5 bg-surface-2 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { mealPlan } = useApp();

  if (!mealPlan) {
    return (
      <div className="min-h-svh bg-bg flex flex-col items-center justify-center px-8 text-center">
        <Sparkles size={40} className="text-muted mb-4" />
        <h2 className="font-fraunces text-xl font-semibold mb-2">No plan yet</h2>
        <p className="text-muted text-sm mb-6">Generate a meal plan first to see your nutrition data.</p>
        <button onClick={() => router.push("/app")} className="bg-primary text-white rounded-2xl px-6 py-3 font-semibold text-sm">
          Go to Calendar
        </button>
      </div>
    );
  }

  const allMeals = mealPlan.days
    .flatMap((d) => [d.breakfast, d.lunch, d.dinner])
    .filter(Boolean);

  const avg = (key: "calories" | "protein" | "carbs" | "fat") =>
    Math.round(allMeals.reduce((s, m) => s + (m?.[key] ?? 0), 0) / 7);

  const avgCalories = avg("calories");
  const calorieGoal = 2000;
  const caloriesPct = Math.min((avgCalories / calorieGoal) * 100, 100);
  const circumference = 2 * Math.PI * 54;

  const microMap: Record<string, { total: number; unit: string; pct: number }> = {};
  for (const meal of allMeals) {
    if (!meal) continue;
    for (const n of meal.nutrients) {
      if (!microMap[n.name]) microMap[n.name] = { total: 0, unit: n.unit, pct: 0 };
      microMap[n.name].total += n.amount;
      microMap[n.name].pct += n.percentOfDailyNeeds;
    }
  }

  const microEntries = Object.entries(microMap)
    .filter(([name]) => !["Calories", "Protein", "Carbohydrates", "Fat"].includes(name))
    .map(([name, d]) => ({ name, amount: Math.round(d.total / 7), unit: d.unit, pct: Math.round(d.pct / 7) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 8);

  const lowNutrients = microEntries.filter((n) => n.pct < 70);

  return (
    <div className="min-h-svh bg-bg">
      <div className="px-8 pt-10 pb-6 border-b border-border">
        <h1 className="font-fraunces text-2xl font-semibold mb-1">Nutrition</h1>
        <p className="text-muted text-sm">Daily averages across your meal plan</p>
      </div>

      <div className="px-8 max-w-3xl space-y-4 pb-8">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Daily Calories</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--surface-2)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke="var(--primary)" strokeWidth="10"
                  strokeDasharray={`${(caloriesPct / 100) * circumference} ${circumference}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-fraunces text-2xl font-semibold">{avgCalories}</span>
                <span className="text-xs text-muted">/ {calorieGoal}</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <MacroBar label="Protein" value={avg("protein")} max={150} color="var(--primary)" />
              <MacroBar label="Carbs" value={avg("carbs")} max={250} color="var(--accent)" />
              <MacroBar label="Fat" value={avg("fat")} max={80} color="#e8a030" />
            </div>
          </div>
        </div>

        {microEntries.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-4">Micronutrients</h2>
            <div className="space-y-3">
              {microEntries.map((n) => (
                <div key={n.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{n.name}</span>
                    <span className={n.pct < 70 ? "text-accent font-semibold" : "text-muted"}>
                      {n.pct}% DV
                    </span>
                  </div>
                  <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(n.pct, 100)}%`,
                        backgroundColor: n.pct < 70 ? "var(--accent)" : "var(--success)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lowNutrients.length > 0 && (
          <div className="bg-accent-light border border-orange-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-accent mb-1">Nutrition note</p>
            <p className="text-sm text-[var(--text)] leading-relaxed">
              Your plan is lower in {lowNutrients.slice(0, 2).map((n) => n.name).join(" and ")}.
              Adding leafy greens, legumes, or fortified foods could help balance your intake.
            </p>
            <p className="text-xs text-muted mt-2">Nutrient data sourced from Spoonacular</p>
          </div>
        )}
      </div>
    </div>
  );
}