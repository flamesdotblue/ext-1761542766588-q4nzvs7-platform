import { useMemo, useState } from "react";

const EXERCISES = [
  { id: 1, name: "Push-up", muscle: "Chest", difficulty: "Beginner", video: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
  { id: 2, name: "Squat", muscle: "Legs", difficulty: "Beginner", video: "https://www.youtube.com/watch?v=aclHkVaku9U" },
  { id: 3, name: "Deadlift", muscle: "Back", difficulty: "Advanced", video: "https://www.youtube.com/watch?v=op9kVnSso6Q" },
  { id: 4, name: "Plank", muscle: "Core", difficulty: "Beginner", video: "https://www.youtube.com/watch?v=pSHjTRCQxIw" },
  { id: 5, name: "Overhead Press", muscle: "Shoulders", difficulty: "Intermediate", video: "https://www.youtube.com/watch?v=qEwKCR5JCog" },
  { id: 6, name: "Bent-over Row", muscle: "Back", difficulty: "Intermediate", video: "https://www.youtube.com/watch?v=vT2GjY_Umpw" },
];

export default function TrainingScreen({ theme, onWorkoutComplete, profile }) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("All");
  const [level, setLevel] = useState("All");
  const [routine, setRoutine] = useState([]);

  const muscles = ["All", "Chest", "Back", "Legs", "Shoulders", "Core"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = useMemo(() => {
    return EXERCISES.filter((e) =>
      (muscle === "All" || e.muscle === muscle) &&
      (level === "All" || e.difficulty === level) &&
      e.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, muscle, level]);

  const suggestRoutine = () => {
    const base = EXERCISES.filter(e => profile.level === "Beginner" ? e.difficulty !== "Advanced" : true);
    const uniqueByMuscle = Object.values(base.reduce((acc, ex) => {
      if (!acc[ex.muscle]) acc[ex.muscle] = ex;
      return acc;
    }, {}));
    setRoutine(uniqueByMuscle.slice(0, 5).map((e) => ({ ...e, sets: 3, reps: profile.goal === "Build muscle" ? 10 : 15, done: false })));
  };

  const toggleDone = (id) => setRoutine(r => r.map(it => it.id === id ? { ...it, done: !it.done } : it));

  const allDone = routine.length > 0 && routine.every(r => r.done);

  return (
    <section aria-label="Exercise library and workouts" className="space-y-4">
      <div className="rounded-2xl shadow-sm border border-neutral-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Exercises</h2>
          <button onClick={suggestRoutine} className="px-3 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: theme.primary }}>Ask GPT-5-NANO</button>
        </div>
        <div className="flex gap-2">
          <input
            aria-label="Search exercises"
            className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none"
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <select className="rounded-xl border px-2 py-2" value={muscle} onChange={(e) => setMuscle(e.target.value)}>
            {muscles.map(m => <option key={m}>{m}</option>)}
          </select>
          <select className="rounded-xl border px-2 py-2 col-span-2" value={level} onChange={(e) => setLevel(e.target.value)}>
            {levels.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <ul className="divide-y">
          {filtered.map((e) => (
            <li key={e.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{e.name}</p>
                <p className="text-xs text-neutral-500">{e.muscle} • {e.difficulty}</p>
              </div>
              <a
                href={e.video}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium px-3 py-1.5 rounded-full border"
                style={{ borderColor: theme.primary, color: theme.primary }}
              >
                Watch
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl shadow-sm border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Personalized routine</h3>
          {allDone && (
            <button onClick={onWorkoutComplete} className="px-3 py-1.5 rounded-full text-white text-xs font-medium" style={{ backgroundColor: theme.secondary }}>
              Mark workout complete
            </button>
          )}
        </div>
        {routine.length === 0 ? (
          <p className="text-sm text-neutral-600">Tap "Ask GPT-5-NANO" to generate a routine tailored to your level and goal.</p>
        ) : (
          <ul className="divide-y">
            {routine.map((item) => (
              <li key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-neutral-500">{item.sets} sets × {item.reps} reps</p>
                </div>
                <button
                  aria-pressed={item.done}
                  onClick={() => toggleDone(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${item.done ? "text-white" : ""}`}
                  style={{ borderColor: item.done ? theme.primary : theme.primary, backgroundColor: item.done ? theme.primary : "transparent", color: item.done ? "white" : theme.primary }}
                >
                  {item.done ? "Done" : "Mark done"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
