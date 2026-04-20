"use client";

import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Settings, RefreshCw, User } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { preferences, setMealPlan, setGroceryList } = useApp();

  const handleReset = () => {
    setMealPlan(null as any);
    setGroceryList(null as any);
    router.push("/");
  };

  return (
    <div className="min-h-svh bg-bg">
      <div className="px-6 pt-14 pb-6">
        <h1 className="font-fraunces text-2xl font-semibold">Profile</h1>
      </div>

      <div className="px-6 space-y-4 pb-6">
        <div className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-surface-2 rounded-2xl flex items-center justify-center">
            <User size={28} className="text-muted" />
          </div>
          <div>
            <p className="font-fraunces text-lg font-semibold">MealSync User</p>
            <p className="text-muted text-sm">Managing your meals</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-sm mb-3">Goals</h3>
          {preferences.goals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preferences.goals.map((g) => (
                <span key={g} className="bg-accent-light text-accent text-xs px-3 py-1.5 rounded-full font-medium capitalize">
                  {g.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          ) : <p className="text-muted text-sm">No goals set</p>}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-sm mb-3">Dietary Restrictions</h3>
          {preferences.restrictions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preferences.restrictions.map((r) => (
                <span key={r} className="bg-surface-2 text-[var(--text)] text-xs px-3 py-1.5 rounded-full font-medium capitalize">
                  {r.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          ) : <p className="text-muted text-sm">None set</p>}
        </div>

        {preferences.activityDays.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-3">Active Days</h3>
            <div className="flex flex-wrap gap-2">
              {preferences.activityDays.map((d) => (
                <span key={d} className="bg-surface-2 text-[var(--text)] text-xs px-3 py-1.5 rounded-full font-medium">{d}</span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-5 py-4 border-b border-border text-left"
          >
            <Settings size={18} className="text-muted" />
            <span className="text-sm font-medium">Update Preferences</span>
          </button>
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-5 py-4 text-left text-accent"
          >
            <RefreshCw size={18} />
            <span className="text-sm font-medium">Reset and Start Over</span>
          </button>
        </div>
      </div>
    </div>
  );
}