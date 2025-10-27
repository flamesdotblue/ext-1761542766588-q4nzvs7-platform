import { useMemo, useRef, useState } from 'react';

const FOODS = [
  { id: 1, name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 2, name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { id: 3, name: 'Greek Yogurt (200g)', calories: 146, protein: 17, carbs: 8, fat: 4 },
  { id: 4, name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { id: 5, name: 'Mixed Salad (2 cups)', calories: 80, protein: 3, carbs: 12, fat: 2 },
];

function FoodCard({ food, onAdd }) {
  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-neutral-800">{food.name}</h4>
        <span className="text-xs rounded-full px-2 py-1 bg-orange-100 text-orange-700">{food.calories} kcal</span>
      </div>
      <p className="text-xs text-neutral-600 mt-1">P {food.protein}g • C {food.carbs}g • F {food.fat}g</p>
      <button onClick={() => onAdd(food)} className="mt-3 w-full rounded-lg bg-teal-600 text-white text-sm py-2 font-medium">Add to log</button>
    </div>
  );
}

function MealPlan({ user, onApply }) {
  const plan = useMemo(() => {
    const target = user.goals.caloriesTarget;
    // Simple mock using GPT-5-NANO logic
    const meals = [
      { title: 'Breakfast', items: ['Greek Yogurt', 'Banana', 'Mixed Salad'], calories: 330 },
      { title: 'Lunch', items: ['Chicken Breast', 'Brown Rice', 'Side Salad'], calories: 520 },
      { title: 'Dinner', items: ['Chicken Breast', 'Brown Rice'], calories: 380 },
      { title: 'Snack', items: ['Greek Yogurt'], calories: 146 },
    ];
    const total = meals.reduce((s, m) => s + m.calories, 0);
    const adjust = Math.round(target - total);
    return { meals, total, note: adjust > 0 ? `Add ~${adjust} kcal via healthy fats.` : adjust < 0 ? `Reduce ~${Math.abs(adjust)} kcal from carbs.` : 'Perfect match.' };
  }, [user]);

  return (
    <div className="p-4 rounded-xl bg-orange-50 border">
      <h3 className="text-base font-semibold text-neutral-800">Personalized Meal Plan</h3>
      <p className="text-sm text-neutral-700">GPT-5-NANO suggests:</p>
      <ul className="mt-2 space-y-2">
        {plan.meals.map((m, idx) => (
          <li key={idx} className="text-sm text-neutral-700">• {m.title}: {m.items.join(', ')} <span className="text-xs text-neutral-500">({m.calories} kcal)</span></li>
        ))}
      </ul>
      <p className="text-sm mt-2 text-neutral-700">Total: <span className="font-medium">{plan.total} kcal</span></p>
      <p className="text-xs text-neutral-600">Note: {plan.note}</p>
      <button onClick={() => onApply(plan)} className="mt-3 w-full rounded-lg bg-teal-600 text-white text-sm py-2 font-medium">Apply Plan</button>
    </div>
  );
}

export default function NutritionScreen({ user, nutritionLog, setNutritionLog, progress, setProgress }) {
  const [query, setQuery] = useState('');
  const [calorie, setCalorie] = useState('All');
  const fileRef = useRef(null);

  const filtered = FOODS.filter((f) => {
    const matchesQuery = f.name.toLowerCase().includes(query.toLowerCase());
    const matchesCal = calorie === 'All' || (calorie === '<200' ? f.calories < 200 : f.calories >= 200);
    return matchesQuery && matchesCal;
  });

  function handleAdd(food) {
    const entry = { id: Date.now(), name: food.name, calories: food.calories, timestamp: new Date().toISOString() };
    setNutritionLog([entry, ...nutritionLog]);
    setProgress({ ...progress, caloriesConsumed: progress.caloriesConsumed + food.calories });
  }

  function handleApplyPlan(plan) {
    const entries = plan.meals.map((m) => ({ id: Date.now() + Math.random(), name: `${m.title}`, calories: m.calories, timestamp: new Date().toISOString(), plan: true }));
    setNutritionLog([...entries, ...nutritionLog]);
    setProgress({ ...progress, caloriesConsumed: progress.caloriesConsumed + plan.total });
  }

  function handleBarcodeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Mock barcode processing: auto-add a banana
    const food = FOODS.find((f) => f.name.startsWith('Banana'));
    if (food) handleAdd(food);
    e.target.value = '';
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-white border shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800">Food Database</h2>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            aria-label="Search foods"
          />
          <div className="grid grid-cols-2 gap-2">
            <select value={calorie} onChange={(e) => setCalorie(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" aria-label="Filter by calories">
              {['All', '<200', '≥200'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg bg-orange-400 text-white text-sm py-2 font-medium"
              aria-label="Scan barcode"
            >
              Scan Barcode
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleBarcodeUpload} aria-label="Barcode image upload" />
          </div>
        </div>
      </div>

      <MealPlan user={user} onApply={handleApplyPlan} />

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((f) => (
          <FoodCard key={f.id} food={f} onAdd={handleAdd} />
        ))}
      </div>

      <section className="p-4 rounded-xl bg-white border shadow-sm">
        <h3 className="text-base font-semibold text-neutral-800">Today\'s Calorie Tracker</h3>
        <p className="text-sm text-neutral-700">Consumed: <span className="font-medium">{progress.caloriesConsumed} kcal</span> / Target: {user.goals.caloriesTarget} kcal</p>
        <ul className="mt-2 space-y-1">
          {nutritionLog.slice(0, 8).map((l) => (
            <li key={l.id} className="text-sm text-neutral-700">• {l.name} <span className="text-xs text-neutral-500">{l.calories} kcal</span></li>
          ))}
          {nutritionLog.length === 0 && <li className="text-sm text-neutral-600">No foods logged yet.</li>}
        </ul>
      </section>
    </div>
  );
}
