export default function ProfileScreen({ user, onUpdateUser, progress }) {
  function updateField(field, value) {
    onUpdateUser({ ...user, [field]: value });
  }

  return (
    <div className="space-y-4">
      <section className="p-4 rounded-xl bg-white border shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800">Profile</h2>
        <p className="text-sm text-neutral-700">Manage your information, goals, and preferences</p>
      </section>

      <div className="p-4 rounded-xl bg-white border shadow-sm space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm text-neutral-700">Name
            <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.name} onChange={(e) => updateField('name', e.target.value)} aria-label="Name" />
          </label>
          <label className="text-sm text-neutral-700">Age
            <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.age} onChange={(e) => updateField('age', Number(e.target.value))} aria-label="Age" />
          </label>
          <label className="text-sm text-neutral-700">Height (cm)
            <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.heightCm} onChange={(e) => updateField('heightCm', Number(e.target.value))} aria-label="Height in cm" />
          </label>
          <label className="text-sm text-neutral-700">Weight (kg)
            <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.weightKg} onChange={(e) => updateField('weightKg', Number(e.target.value))} aria-label="Weight in kg" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <label className="text-sm text-neutral-700">Fitness Level
            <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.fitnessLevel} onChange={(e) => updateField('fitnessLevel', e.target.value)} aria-label="Fitness level">
              {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="text-sm text-neutral-700">Calories Target
              <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.goals.caloriesTarget} onChange={(e) => onUpdateUser({ ...user, goals: { ...user.goals, caloriesTarget: Number(e.target.value) } })} aria-label="Calories target" />
            </label>
            <label className="text-sm text-neutral-700">Steps Target
              <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.goals.stepsTarget} onChange={(e) => onUpdateUser({ ...user, goals: { ...user.goals, stepsTarget: Number(e.target.value) } })} aria-label="Steps target" />
            </label>
            <label className="text-sm text-neutral-700">Workouts / Week
              <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.goals.workoutsPerWeek} onChange={(e) => onUpdateUser({ ...user, goals: { ...user.goals, workoutsPerWeek: Number(e.target.value) } })} aria-label="Workouts per week" />
            </label>
          </div>

          <label className="text-sm text-neutral-700">Dietary Preference
            <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" value={user.preferences.dietary} onChange={(e) => onUpdateUser({ ...user, preferences: { ...user.preferences, dietary: e.target.value } })} aria-label="Dietary preference">
              {['Balanced', 'High-Protein', 'Low-Carb', 'Plant-Based'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <section className="p-4 rounded-xl bg-white border shadow-sm">
        <h3 className="text-base font-semibold text-neutral-800">Integrations</h3>
        <p className="text-sm text-neutral-700">Connect your wearable devices</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="rounded-lg bg-neutral-100 text-neutral-800 text-sm py-2 font-medium">Apple Health</button>
          <button className="rounded-lg bg-neutral-100 text-neutral-800 text-sm py-2 font-medium">Google Fit</button>
        </div>
      </section>

      <section className="p-4 rounded-xl bg-white border shadow-sm">
        <h3 className="text-base font-semibold text-neutral-800">Progress History</h3>
        <p className="text-sm text-neutral-700">This week: {progress.workoutsThisWeek} workouts</p>
        <p className="text-sm text-neutral-700">Today: {progress.steps} steps, {progress.caloriesConsumed} kcal</p>
      </section>
    </div>
  );
}
