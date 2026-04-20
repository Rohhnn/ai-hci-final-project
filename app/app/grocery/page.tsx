"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

export default function GroceryPage() {
  const router = useRouter();
  const { groceryList, mealPlan } = useApp();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  if (!groceryList || !mealPlan) {
    return (
      <div className="min-h-svh bg-bg flex flex-col items-center justify-center px-8 text-center">
        <ShoppingCart size={40} className="text-muted mb-4" />
        <h2 className="font-fraunces text-xl font-semibold mb-2">No grocery list yet</h2>
        <p className="text-muted text-sm mb-6">Generate a meal plan to get your smart grocery list.</p>
        <button onClick={() => router.push("/app")} className="bg-primary text-white rounded-2xl px-6 py-3 font-semibold text-sm">
          Go to Calendar
        </button>
      </div>
    );
  }

  const toggle = (key: string) =>
    setChecked((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const allItems = Object.values(groceryList).flat();
  const sharedItems = allItems.filter((i) => i.usedInMeals.length > 1);
  const pantryItems = allItems.filter((i) => i.inPantry);

  return (
    <div className="min-h-svh bg-bg">
      <div className="px-8 pt-10 pb-4 border-b border-border">
        <h1 className="font-fraunces text-2xl font-semibold mb-1">Grocery List</h1>
        <p className="text-muted text-sm">Auto-generated from your weekly plan</p>
      </div>

      <div className="px-8 max-w-3xl space-y-4 pb-8">
        <div className="bg-primary text-white rounded-2xl p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs opacity-70 mb-0.5">Total items</p>
              <p className="font-fraunces text-2xl font-semibold">{allItems.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70 mb-0.5">Shared ingredients</p>
              <p className="font-fraunces text-2xl font-semibold">{sharedItems.length}</p>
            </div>
          </div>
          {pantryItems.length > 0 && (
            <p className="text-xs opacity-70 mb-2">
              {pantryItems.length} item{pantryItems.length !== 1 ? "s" : ""} already in your pantry
            </p>
          )}
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(checked.size / allItems.length) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1.5 opacity-60">{checked.size} of {allItems.length} checked off</p>
          <p className="text-xs mt-2 opacity-60">
            Price estimates sourced from Spoonacular. Actual costs may vary.
          </p>
        </div>

        {Object.entries(groceryList).map(([aisle, items]) => (
          <div key={aisle} className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm">{aisle}</h3>
            </div>
            <div className="divide-y divide-border">
              {items.map((item) => {
                const key = item.name.toLowerCase();
                const isChecked = checked.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    className={clsx(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-all",
                      isChecked && "opacity-50",
                      item.inPantry && "bg-surface-2"
                    )}
                  >
                    <div className={clsx(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                      isChecked ? "bg-primary border-primary" : "border-border"
                    )}>
                      {isChecked && <Check size={10} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={clsx("text-sm font-medium", isChecked && "line-through")}>{item.name}</p>
                      <p className="text-xs text-muted">
                        {item.amount.toFixed(1)} {item.unit}
                        {item.usedInMeals.length > 1 && (
                          <span className="ml-2 text-primary font-medium">shared across {item.usedInMeals.length} meals</span>
                        )}
                        {item.inPantry && <span className="ml-2 text-[var(--success)] font-medium">in pantry</span>}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}