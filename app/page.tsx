"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ChevronRight, Leaf } from "lucide-react";
import { clsx } from "clsx";

const GOALS = [
  { id: "balanced", label: "Eat Balanced", emoji: "🥗" },
  { id: "lose-weight", label: "Lose Weight", emoji: "⚖️" },
  { id: "build-muscle", label: "Build Muscle", emoji: "💪" },
  { id: "save-money", label: "Save Money", emoji: "💰" },
  { id: "reduce-waste", label: "Reduce Waste", emoji: "♻️" },
  { id: "more-variety", label: "More Variety", emoji: "🌈" },
];

const RESTRICTIONS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "halal", label: "Halal" },
  { id: "nut-free", label: "Nut-Free" },
];

const DAYS = [
  { id: "Monday", label: "Mon" },
  { id: "Tuesday", label: "Tue" },
  { id: "Wednesday", label: "Wed" },
  { id: "Thursday", label: "Thu" },
  { id: "Friday", label: "Fri" },
  { id: "Saturday", label: "Sat" },
  { id: "Sunday", label: "Sun" },
];

export default function OnboardingStep1() {
  const router = useRouter();
  const { setPreferences } = useApp();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggle = (id: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const handleNext = () => {
    setPreferences({ goals: selectedGoals, restrictions: selectedRestrictions, activityDays: selectedDays });
    router.push("/onboarding/step2");
  };

  return (
    <div className="min-h-svh bg-bg flex flex-col">
      <div className="pt-14 pb-8 px-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-fraunces text-xl font-semibold">MealSync</span>
        </div>
        <div className="flex gap-2 mb-6">
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-border" />
        </div>
        <h1 className="font-fraunces text-3xl font-semibold leading-tight">
          Let's set up your<br />meal preferences
        </h1>
        <p className="text-muted text-sm mt-2">Step 1 of 2 — takes about 30 seconds</p>
      </div>

      <div className="flex-1 px-6 pb-6 space-y-8 overflow-y-auto">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Your goals</h2>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(({ id, label, emoji }) => {
              const selected = selectedGoals.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id, selectedGoals, setSelectedGoals)}
                  className={clsx(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    selected ? "bg-primary text-white border-primary" : "bg-surface border-border text-[var(--text)]"
                  )}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Dietary restrictions</h2>
          <div className="flex flex-wrap gap-2">
            {RESTRICTIONS.map(({ id, label }) => {
              const selected = selectedRestrictions.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id, selectedRestrictions, setSelectedRestrictions)}
                  className={clsx(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    selected ? "bg-accent text-white border-accent" : "bg-surface border-border text-[var(--text)]"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Active days</h2>
          <p className="text-xs text-muted mb-3">We'll suggest lighter meals on these days</p>
          <div className="flex gap-1.5">
            {DAYS.map(({ id, label }) => {
              const selected = selectedDays.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle(id, selectedDays, setSelectedDays)}
                  className={clsx(
                    "flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all",
                    selected ? "bg-primary text-white border-primary" : "bg-surface border-border text-muted"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="px-6 pb-10 pt-4 space-y-3 border-t border-border bg-bg">
        <button
          onClick={handleNext}
          className="w-full bg-primary text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 text-base"
        >
          Next <ChevronRight size={18} />
        </button>
        <button onClick={() => router.push("/app")} className="w-full text-muted text-sm py-2">
          Skip for now
        </button>
      </div>
    </div>
  );
}