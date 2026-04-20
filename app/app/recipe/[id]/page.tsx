"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Meal, NutrientData, RecipeIngredient } from "@/types";
import Image from "next/image";
import { ArrowLeft, Clock, Users, Flame, ChevronRight } from "lucide-react";

const KEY_NUTRIENTS = ["Protein", "Carbohydrates", "Fat", "Fiber", "Sugar", "Sodium"];

function RecipeLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full bg-primary text-white rounded-2xl px-5 py-3.5 font-semibold text-sm hover:bg-primary-hover transition-colors"
    >
      <span>View Full Recipe</span>
      <ChevronRight size={16} />
    </a>
  );
}

function NutrientCard({ nutrient }: { nutrient: NutrientData }) {
  const amount = Math.round(nutrient.amount);
  const pct = Math.round(nutrient.percentOfDailyNeeds);
  const hasPct = pct > 0;
  return (
    <div className="bg-surface-2 rounded-xl p-3">
      <p className="text-xs text-muted mb-0.5">{nutrient.name}</p>
      <p className="font-semibold text-sm">{amount}{nutrient.unit}</p>
      {hasPct ? (
        <p className="text-xs text-muted">{pct}% DV</p>
      ) : null}
    </div>
  );
}

function IngredientRow({
  ingredient,
  index,
}: {
  ingredient: RecipeIngredient;
  index: number;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-sm capitalize">{ingredient.name}</span>
      <span className="text-xs text-muted">
        {ingredient.amount} {ingredient.unit}
      </span>
    </div>
  );
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  const rawId = params.id;
  const recipeId = Array.isArray(rawId) ? rawId[0] : rawId;

  useEffect(() => {
    if (!recipeId) return;
    fetch("/api/recipe/" + recipeId)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        setMeal(data as Meal);
        setLoading(false);
      })
      .catch(function() {
        setLoading(false);
      });
  }, [recipeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-border border-t-primary animate-spin" />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4">
        <p className="text-muted">Recipe not found.</p>
        <button
          onClick={() => router.back()}
          className="text-primary font-semibold underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  const displayNutrients = meal.nutrients.filter(
    function(n) { return KEY_NUTRIENTS.includes(n.name); }
  );

  const hasNutrients = displayNutrients.length > 0;
  const hasIngredients = meal.ingredients.length > 0;
  const sourceUrl = meal.sourceUrl ? meal.sourceUrl : "";
  const hasSource = sourceUrl !== "";

  return (
    <div className="min-h-screen bg-bg">
      <div className="px-8 pt-8 pb-4 flex items-center gap-4 border-b border-border">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="grid grid-cols-2 gap-10">

          <div>
            <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-surface-2 mb-6">
              {meal.image ? (
                <Image
                  src={meal.image}
                  alt={meal.title}
                  fill
                  sizes="(max-width: 1400px) 40vw, 600px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-surface border border-border rounded-2xl p-4 text-center">
                <Clock size={18} className="text-muted mx-auto mb-1" />
                <p className="font-semibold text-sm">{meal.readyInMinutes} min</p>
                <p className="text-xs text-muted">Cook time</p>
              </div>
              <div className="flex-1 bg-surface border border-border rounded-2xl p-4 text-center">
                <Users size={18} className="text-muted mx-auto mb-1" />
                <p className="font-semibold text-sm">{meal.servings}</p>
                <p className="text-xs text-muted">Servings</p>
              </div>
              <div className="flex-1 bg-surface border border-border rounded-2xl p-4 text-center">
                <Flame size={18} className="text-accent mx-auto mb-1" />
                <p className="font-semibold text-sm">{meal.calories}</p>
                <p className="text-xs text-muted">Calories</p>
              </div>
            </div>

            {hasSource ? (
              <RecipeLink url={sourceUrl} />
            ) : null}
          </div>

          <div>
            <h1 className="font-fraunces text-2xl font-semibold mb-6">
              {meal.title}
            </h1>

            {hasNutrients ? (
              <div className="bg-surface border border-border rounded-2xl p-5 mb-5">
                <h2 className="font-semibold text-sm mb-4">Nutrition per serving</h2>
                <div className="grid grid-cols-2 gap-3">
                  {displayNutrients.map(function(n) {
                    return <NutrientCard key={n.name} nutrient={n} />;
                  })}
                </div>
              </div>
            ) : null}

            {hasIngredients ? (
              <div className="bg-surface border border-border rounded-2xl p-5">
                <h2 className="font-semibold text-sm mb-4">Ingredients</h2>
                <div className="space-y-2">
                {meal.ingredients.map(function(ing, idx) {
                           return <IngredientRow key={`${ing.id}-${idx}`} ingredient={ing} index={idx} />;
                })}
                </div>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}