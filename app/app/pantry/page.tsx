"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Check, ChevronDown, ChevronUp, Mic, Search, Plus } from "lucide-react";
import { clsx } from "clsx";

const PANTRY_CATEGORIES = [
  {
    id: "vegetables", label: "Vegetables", emoji: "🥦",
    items: ["Spinach", "Broccoli", "Carrots", "Bell peppers", "Onion", "Garlic", "Tomatoes", "Zucchini", "Mushrooms", "Sweet potato", "Kale", "Cucumber", "Potatoes", "Corn", "Celery", "Asparagus", "Eggplant", "Cauliflower"],
  },
  {
    id: "fruits", label: "Fruits", emoji: "🍎",
    items: ["Bananas", "Apples", "Berries", "Lemon", "Oranges", "Avocado", "Mango", "Grapes", "Pears", "Peaches", "Pineapple", "Watermelon", "Strawberries", "Blueberries"],
  },
  {
    id: "meats", label: "Meats & Fish", emoji: "🍗",
    items: ["Chicken breast", "Ground beef", "Salmon", "Tuna", "Shrimp", "Turkey", "Pork loin", "Bacon", "Lamb", "Sausage", "Tilapia", "Cod"],
  },
  {
    id: "dairy", label: "Dairy & Eggs", emoji: "🧀",
    items: ["Eggs", "Milk", "Greek yogurt", "Cheddar cheese", "Mozzarella", "Butter", "Cream cheese", "Parmesan", "Sour cream", "Heavy cream", "Cottage cheese"],
  },
  {
    id: "grains", label: "Grains & Breads", emoji: "🌾",
    items: ["Rice", "Pasta", "Oats", "Bread", "Quinoa", "Tortillas", "Flour", "Couscous", "Barley", "Bagels", "Pita bread", "Brown rice"],
  },
  {
    id: "staples", label: "Pantry Staples", emoji: "🫙",
    items: ["Olive oil", "Canned tomatoes", "Chickpeas", "Black beans", "Lentils", "Soy sauce", "Honey", "Vegetable broth", "Coconut milk", "Peanut butter", "Vinegar", "Salt", "Pepper", "Cumin", "Paprika", "Oregano"],
  },
];

export default function PantryPage() {
  const { preferences, setPreferences } = useApp();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedItems = preferences.pantryItems;

  const toggleItem = (item: string) => {
    setPreferences({
      pantryItems: selectedItems.includes(item)
        ? selectedItems.filter((i) => i !== item)
        : [...selectedItems, item],
    });
  };

  const addCustomItem = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    if (!selectedItems.includes(formatted)) {
      setPreferences({ pantryItems: [...selectedItems, formatted] });
    }
    setSearchQuery("");
  };

  const filteredCategories = PANTRY_CATEGORIES.map((cat) => ({
    ...cat,
    items: searchQuery
      ? cat.items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
      : cat.items,
  }));

  const hasAnyResults = filteredCategories.some((cat) => cat.items.length > 0);
  const visibleCategories = filteredCategories.filter((cat) => !searchQuery || cat.items.length > 0);

  return (
    <div className="min-h-svh bg-bg">
      <div className="px-6 pt-14 pb-4">
        <h1 className="font-fraunces text-2xl font-semibold mb-1">My Pantry</h1>
        <p className="text-muted text-sm">
          {selectedItems.length > 0
            ? `${selectedItems.length} items tracked`
            : "Add items to get ingredient-aware suggestions"}
        </p>
      </div>

      <div className="px-6 mb-4">
        <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3">
          <Search size={16} className="text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search or add any ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          {searchQuery ? (
            <button
              onClick={addCustomItem}
              className="flex items-center gap-1 text-xs font-semibold text-primary bg-accent-light px-2.5 py-1 rounded-full flex-shrink-0"
            >
              <Plus size={12} /> Add
            </button>
          ) : (
            <Mic size={16} className="text-muted flex-shrink-0" />
          )}
        </div>
        {searchQuery && !hasAnyResults && (
          <p className="text-xs text-muted mt-2 px-1">
            No suggestions found. Press <span className="font-semibold text-primary">Add</span> or hit Enter to add "{searchQuery}" directly.
          </p>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="px-6 mb-4 flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              className="flex items-center gap-1.5 bg-primary text-white text-xs px-3 py-1.5 rounded-full font-medium"
            >
              {item}
              <span className="opacity-70 text-sm leading-none">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="px-6 pb-6 space-y-2">
        {visibleCategories.map((category) => {
          const isExpanded = expandedCategory === category.id || !!searchQuery;
          const selectedInCategory = category.items.filter((item) => selectedItems.includes(item)).length;

          return (
            <div key={category.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded && !searchQuery ? null : category.id)}
                className="w-full flex items-center justify-between px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.emoji}</span>
                  <span className="font-semibold text-sm">{category.label}</span>
                  {selectedInCategory > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{selectedInCategory}</span>
                  )}
                </div>
                {!searchQuery && (isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />)}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  {category.items.map((item) => {
                    const selected = selectedItems.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleItem(item)}
                        className={clsx(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          selected ? "bg-primary text-white border-primary" : "bg-surface-2 border-border text-[var(--text)]"
                        )}
                      >
                        {selected && <Check size={10} />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}