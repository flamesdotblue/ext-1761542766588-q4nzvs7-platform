function ProgressBar({ label, value, max, color = 'bg-teal-600' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="p-4 rounded-xl border shadow-sm bg-white" role="group" aria-label={`${label} progress`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm text-neutral-600">{value} / {max}</span>
      </div>
      <div className="w-full h-3 bg-neutral-100 rounded-full">
        <div
          className={`h-3 ${color} rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function MiniChart({ data = [], color = '#008080' }) {
  const width = 320;
  const height = 60;
  const max = Math.max(...data, 1);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - (d / max) * height;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} className="w-full" aria-label="Weekly progress chart">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HomeScreen({ user, progress }) {
  const weeklySteps = [5200, 7600, 8100, 4000, 9800, 12000, 7300];
  return (
    <div className="space-y-4">
      <section className="p-4 rounded-xl bg-gradient-to-r from-teal-100 to-orange-100 border">
        <h2 className="text-lg font-semibold text-teal-800">Welcome back, {user.name}</h2>
        <p className="text-sm text-neutral-700">Daily overview and progress</p>
      </section>

      <div className="grid grid-cols-1 gap-3">
        <ProgressBar label="Calories" value={progress.caloriesConsumed} max={user.goals.caloriesTarget} color="bg-orange-400" />
        <ProgressBar label="Steps" value={progress.steps} max={user.goals.stepsTarget} color="bg-teal-600" />
        <ProgressBar label="Workout" value={progress.workoutsCompletedToday} max={1} color="bg-teal-700" />
      </div>

      <section className="p-4 rounded-xl border shadow-sm bg-white">
        <h3 className="text-base font-semibold text-neutral-800">Weekly Steps</h3>
        <MiniChart data={weeklySteps} />
        <p className="text-xs text-neutral-600 mt-1">Keep it up! Aim for {user.goals.stepsTarget} steps daily.</p>
      </section>
    </div>
  );
}
