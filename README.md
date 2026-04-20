# MealSync

AI-powered meal planning, nutrition tracking, and meal prep assistant built with Next.js, Groq, and Spoonacular.

## What It Does

MealSync generates a personalized 7-day meal plan based on your dietary goals, restrictions, active days, and pantry inventory. It pulls real recipes and nutrition data from Spoonacular and uses Groq's Llama 3.3 model to plan meals intelligently. The app tracks estimated macro and micronutrient intake across your plan, auto-generates a smart grocery list grouped by store aisle, and lets you manage a pantry inventory that feeds back into meal suggestions.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **AI / Meal Planning**: Groq API (Llama 3.3 70B)
- **Recipe & Nutrition Data**: Spoonacular API
- **Fonts**: Fraunces, DM Sans (Google Fonts)

## Prerequisites

- Node.js 18 or later
- A free Groq API key from [console.groq.com](https://console.groq.com)
- A free Spoonacular API key from [spoonacular.com/food-api](https://spoonacular.com/food-api)

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/Rohhnn/ai-hci-final-project.git
cd ai-hci-final-project
```

**2. Install dependencies**

```bash
npm install
```

**3. Create your environment file**

Create a file named `.env.local` in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
```

**4. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. On first load you will see the onboarding screen. Select your dietary goals, any restrictions, and which days you work out.
2. On step two, select ingredients you already have at home from the categorized pantry list, or type and add custom items.
3. Hit **Finish Setup** to reach the calendar. Click **Generate My Meal Plan** to generate your week.
4. Generation takes approximately 30 to 60 seconds. The app sends your preferences to Groq, receives a structured 7-day plan, then fetches matching recipes from Spoonacular one at a time.
5. Click any meal card to see the full ingredient list, nutrition breakdown, and a link to the original recipe.
6. Navigate to **Grocery** to see your auto-generated shopping list grouped by aisle.
7. Navigate to **Dashboard** to see estimated daily calorie and nutrient averages across your plan.
8. Navigate to **Pantry** to update your ingredient inventory at any time.

## API Usage Notes

- Spoonacular's free tier allows **150 requests per day**. One meal plan generation uses 21 requests. Keep this in mind if you regenerate frequently.
- Price estimates shown in the app are sourced from Spoonacular's database and reflect average US grocery prices. Actual costs may vary.
- Groq's free tier has per-minute rate limits. If generation fails, wait a moment and try again.

## Project Structure

```
app/
  page.tsx                  # Onboarding step 1
  layout.tsx                # Root layout with font loading and context provider
  globals.css               # Design system and Tailwind theme
  onboarding/
    step2/page.tsx          # Pantry setup
  app/
    layout.tsx              # App shell with sidebar navigation
    page.tsx                # Weekly meal calendar (main screen)
    dashboard/page.tsx      # Nutrition dashboard
    grocery/page.tsx        # Smart grocery list
    pantry/page.tsx         # Pantry management
    profile/page.tsx        # Profile and preferences summary
    recipe/[id]/page.tsx    # Recipe detail page
  api/
    generate-meal-plan/route.ts   # Groq + Spoonacular pipeline
    recipe/[id]/route.ts          # Single recipe fetch

components/
  ui/BottomNav.tsx          # Sidebar navigation

context/
  AppContext.tsx            # Global state (preferences, meal plan, grocery list)

lib/
  gemini.ts                 # Groq API integration (meal plan generation)
  spoonacular.ts            # Spoonacular API integration
  grocery.ts                # Grocery list aggregation logic

types/
  index.ts                  # Shared TypeScript types
```

## Figma Prototype

The static prototype is available at:
[https://mix-slice-80262422.figma.site](https://mix-slice-80262422.figma.site)

## Course Context

Built for AI for Human-Computer Interaction graduate course at Northeastern University.
The mid-semester report, literature review, survey analysis, and design interview notes are
included in the `docs/` folder of this repository.