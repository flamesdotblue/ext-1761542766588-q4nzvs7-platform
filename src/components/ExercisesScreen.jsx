import { useMemo, useState } from 'react';

const EXERCISES = [
  { id: 1, name: 'Bodyweight Squat', level: 'Beginner', muscles: ['Legs'], video: 'https://www.youtube.com/watch?v=aclHkVaku9U' },
  { id: 2, name: 'Push-up', level: 'Beginner', muscles: ['Chest', 'Arms'], video: 'https://www.youtube.com/watch?v=_l3ySVKYVJ8' },
  { id: 3, name: 'Plank', level: 'Beginner', muscles: ['Core'], video: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
  { id: 4, name: 'Dumbbell Row', level: 'Intermediate', muscles: ['Back', 'Arms'], video: 'https://www.youtube.com/watch?v=pYcpY20QaE8' },
  { id: 5, name: 'Lunges', level: 'Intermediate', muscles: ['Legs', 'Glutes'], video: 'https://www.youtube.com/watch?v=COKYKgQ8KR0' },
  { id: 6, name: 'Deadlift', level: 'Advanced', muscles: ['Back', 'Legs'], video: 'https://www.youtube.com/watch?v=op9kVnSso6Q' },
];

function ExerciseCard({ exercise, onLog }) {
  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-neutral-800">{exercise.name}</h4>
        <span className="text-xs rounded-full px-2 py-1 bg-neutral-100 text-neutral-700">{exercise.level}</span>
      </div>
      <p className="text-xs text-neutral-600 mt-1">Muscles: {exercise.muscles.join(', ')}</p>
      <a
        className="text-sm text-teal-700 underline mt-2 inline-block"
        href={exercise.video}
        target="_blank"
        rel="noreferrer"
        aria-label={`Watch video for ${exercise.name}`}
      >
        Watch video demo
      </a>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onLog(exercise)}
          className="flex-1 rounded-lg bg-teal-600 text-white text-sm py-2 font-medium"
        >
          Log Set
        </button>
      </div>
    </div>
  );
}

function RoutineSuggestion({ user, onAddRoutine }) {
  const routine = useMemo(() => {
    const level = user.fitnessLevel;
    const goals = user.goals;
    const selections = EXERCISES.filter((e) =>
      level === 'Beginner' ? e.level === 'Beginner' : level === 'Intermediate' ? e.level !== 'Advanced' : true
    ).slice(0, 5);
    return {
      name: `${level} Full-Body (${goals.workoutsPerWeek}x/week)`,
      exercises: selections,
    };
  }, [user]);

  return (
    <div className="p-4 rounded-xl bg-orange-50 border">
      <h3 className="text-base font-semibold text-neutral-800">Personalized Routine</h3>
      <p className="text-sm text-neutral-700">GPT-5-NANO suggests:</p>
      <ul className="mt-2 space-y-1">
        {routine.exercises.map((e) => (
          <li key={e.id} className="text-sm text-neutral-700">• {e.name}</li>
        ))}
      </ul>
      <button
        onClick={() => onAddRoutine(routine)}
        className="mt-3 w-full rounded-lg bg-teal-600 text-white text-sm py-2 font-medium"
      >
        Add to Plan
      </button>
    </div>
  );
}

export default function ExercisesScreen({ user, workoutLog, setWorkoutLog, progress, setProgress }) {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState('All');
  const [level, setLevel] = useState('All');

  const filtered = EXERCISES.filter((e) => {
    const matchesQuery = e.name.toLowerCase().includes(query.toLowerCase());
    const matchesMuscle = muscle === 'All' || e.muscles.includes(muscle);
    const matchesLevel = level === 'All' || e.level === level;
    return matchesQuery && matchesMuscle && matchesLevel;
  });

  function handleLog(exercise) {
    const logEntry = { id: Date.now(), name: exercise.name, timestamp: new Date().toISOString() };
    setWorkoutLog([logEntry, ...workoutLog]);
    setProgress({ ...progress, workoutsCompletedToday: Math.min(1, progress.workoutsCompletedToday + 1), workoutsThisWeek: progress.workoutsThisWeek + 1 });
  }

  function handleAddRoutine(routine) {
    const entries = routine.exercises.map((e) => ({ id: Date.now() + Math.random(), name: e.name, timestamp: new Date().toISOString(), routine: routine.name }));
    setWorkoutLog([...entries, ...workoutLog]);
  }

  const muscles = ['All', 'Legs', 'Chest', 'Arms', 'Back', 'Core', 'Glutes'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-white border shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800">Exercise Library</h2>
        <div className="mt-3 grid grid-cols-1 gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            aria-label="Search exercises"
          />
          <div className="grid grid-cols-2 gap-2">
            <select value={muscle} onChange={(e) => setMuscle(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" aria-label="Filter by muscle group">
              {muscles.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-lg border px-3 py-2 text-sm" aria-label="Filter by difficulty level">
              {levels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <RoutineSuggestion user={user} onAddRoutine={handleAddRoutine} />

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((e) => (
          <ExerciseCard key={e.id} exercise={e} onLog={handleLog} />
        ))}
      </div>

      <section className="p-4 rounded-xl bg-white border shadow-sm">
        <h3 className="text-base font-semibold text-neutral-800">Recent Workout Logs</h3>
        <ul className="mt-2 space-y-1">
          {workoutLog.slice(0, 6).map((l) => (
            <li key={l.id} className="text-sm text-neutral-700">• {l.name} <span className="text-xs text-neutral-500">{new Date(l.timestamp).toLocaleString()}</span></li>
          ))}
          {workoutLog.length === 0 && <li className="text-sm text-neutral-600">No logs yet. Start a workout!</li>}
        </ul>
      </section>
    </div>
  );
}
