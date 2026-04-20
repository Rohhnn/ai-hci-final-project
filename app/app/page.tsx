"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { buildGroceryList } from "@/lib/grocery";
import { Meal } from "@/types";
import Image from "next/image";
import { Sparkles, RefreshCw, Clock, Flame, DollarSign, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

function MealCard({ meal, type }: { meal: Meal | null; type: string }) {
  const router = useRouter();

  if (!meal) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-2 flex items-center justify-center h-24">
        <span className="text-xs text-muted">No meal</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push(`/app/recipe/${meal.id}`)}
      className="w-full text-left bg-surface rounded-xl border border-border overflow-hidden hover:border-primary hover:shadow-sm transition-all group"
    >
      <div className="relative h-24 w-full bg-surface-2">
        {meal.image && (
          <Image
            src={meal.image}
            alt={meal.title}
            fill
            sizes="(max-width: 1400px) 14vw, 200px"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-1.5 left-2 right-2">
          <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{meal.title}</p>
        </div>
      </div>
      <div className="px-2 py-1.5 flex items-center justify-between">
        <span className="text-xs text-muted flex items-center gap-1">
          <Flame size={10} className="text-accent" />
          {meal.calories} cal
        </span>
        <span className="text-xs text-muted flex items-center gap-1">
          <DollarSign size={10} className="text-primary" />
          ${(meal.pricePerServing / 100).toFixed(2)}
        </span>
        <ChevronRight size={12} className="text-muted group-hover:text-primary transition-colors" />
      </div>
    </button>
  );
}

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const;

export default function CalendarPage() {
  const router = useRouter();
  const {
    preferences, mealPlan, setMealPlan,
    setGroceryList, isGenerating, setIsGenerating,
    generationError, setGenerationError,
  } = useApp();

  const generatePlan = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });
      if (!res.ok) throw new Error("Generation failed");
      const plan = await res.json();
      setMealPlan(plan);
      setGroceryList(buildGroceryList(plan, preferences.pantryItems));
    } catch {
      setGenerationError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const totalCalories = mealPlan
    ? mealPlan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner]).reduce((s, m) => s + (m?.calories ?? 0), 0)
    : 0;

  const totalCost = mealPlan
    ? mealPlan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner]).reduce((s, m) => s + (m?.pricePerServing ?? 0) / 100, 0)
    : 0;

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-8 pt-10 pb-6 flex items-center justify-between border-b border-border">
        <div>
          <h1 className="font-fraunces text-3xl font-semibold mb-1">Weekly Meal Plan</h1>
          {mealPlan && (
          <>
          <p className="text-muted text-sm">
          ~{totalCalories.toLocaleString()} cal this week &nbsp;·&nbsp; Est. ${totalCost.toFixed(2)} &nbsp;·&nbsp;
          {mealPlan.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner]).filter(Boolean).length} meals planned
          </p>
          <p className="text-xs text-muted mt-0.5">
            Price estimates sourced from Spoonacular. Actual costs may vary.
          </p>
          </>
          )}
        </div>
        {mealPlan && (
          <button
            onClick={generatePlan}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-surface border border-border text-sm font-medium px-4 py-2.5 rounded-xl hover:border-primary transition-all"
          >
            <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
            Regenerate
          </button>
        )}
      </div>

      {!mealPlan && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-32 text-center px-8">
          <div className="w-20 h-20 bg-accent-light rounded-3xl flex items-center justify-center mb-6">
            <Sparkles size={36} className="text-accent" />
          </div>
          <h2 className="font-fraunces text-3xl font-semibold mb-3">Ready to plan your week?</h2>
          <p className="text-muted text-base mb-10 max-w-md leading-relaxed">
            MealSync generates a full 7-day meal plan based on your goals, restrictions, and pantry items.
          </p>
          <div className="flex gap-4">
            <button
              onClick={generatePlan}
              className="bg-primary text-white rounded-2xl px-10 py-4 font-semibold flex items-center gap-2 text-base hover:bg-primary-hover transition-colors"
            >
              <Sparkles size={18} />
              Generate My Meal Plan
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-surface border border-border rounded-2xl px-8 py-4 font-semibold text-base hover:border-primary transition-colors"
            >
              Update Preferences
            </button>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-14 h-14 rounded-full border-4 border-border border-t-primary animate-spin mb-6" />
          <h2 className="font-fraunces text-2xl font-semibold mb-2">Building your plan...</h2>
          <p className="text-muted">Groq is planning your meals and fetching recipes. Takes about 30 seconds.</p>
        </div>
      )}

      {generationError && (
        <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
          <p className="text-red-700">{generationError}</p>
          <button onClick={generatePlan} className="text-red-700 font-semibold underline text-sm">
            Try again
          </button>
        </div>
      )}

      {mealPlan && !isGenerating && (
        <div className="px-8 py-6 overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[900px]">
            {DAYS_ORDER.map((dayName) => {
              const dayData = mealPlan.days.find((d) => d.day === dayName);
              const isActive = preferences.activityDays.includes(dayName);
              return (
                <div key={dayName} className="flex flex-col gap-2">
                  <div className="text-center pb-2 border-b border-border">
                    <p className="font-semibold text-sm">{dayName.slice(0, 3)}</p>
                    {isActive && (
                      <span className="text-xs text-accent font-medium">Active</span>
                    )}
                  </div>
                  {MEAL_TYPES.map((type) => (
                    <div key={type}>
                      <p className="text-xs text-muted uppercase tracking-wide mb-1 font-medium">{type}</p>
                      <MealCard meal={dayData?.[type] ?? null} type={type} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}