import { MealPlan, GroceryItem, GroceryList } from "@/types";

export function buildGroceryList(
  mealPlan: MealPlan,
  pantryItems: string[]
): GroceryList {
  const pantrySet = new Set(pantryItems.map((p) => p.toLowerCase()));
  const itemMap = new Map<string, GroceryItem>();

  for (const day of mealPlan.days) {
    const meals = [
      { meal: day.breakfast, label: `${day.day} Breakfast` },
      { meal: day.lunch, label: `${day.day} Lunch` },
      { meal: day.dinner, label: `${day.day} Dinner` },
    ];

    for (const { meal, label } of meals) {
      if (!meal) continue;
      for (const ing of meal.ingredients) {
        const key = ing.name.toLowerCase();
        if (itemMap.has(key)) {
          const existing = itemMap.get(key)!;
          existing.amount += ing.amount;
          existing.usedInMeals.push(label);
        } else {
          itemMap.set(key, {
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            aisle: ing.aisle ?? "Other",
            usedInMeals: [label],
            inPantry: pantrySet.has(key),
          });
        }
      }
    }
  }

  const grouped: GroceryList = {};
  for (const item of itemMap.values()) {
    const aisle = item.aisle;
    if (!grouped[aisle]) grouped[aisle] = [];
    grouped[aisle].push(item);
  }

  return grouped;
}