import { useMemo, useState } from 'react';

function mockGPT5NanoResponse({ user, progress, message }) {
  const tips = [];
  if (progress.steps < user.goals.stepsTarget) tips.push(`You\'re ${user.goals.stepsTarget - progress.steps} steps away from today\'s goal. Consider a brisk 15-min walk.`);
  if (progress.caloriesConsumed < user.goals.caloriesTarget) tips.push(`You\'re below your calorie target. Add a balanced snack: yogurt + nuts.`);
  if (progress.workoutsCompletedToday < 1) tips.push('Schedule a short full-body routine: 3x10 squats, 3x10 push-ups, 60s plank.');
  const reply = `Based on your current data: ${tips.join(' ')} ` +
    (message.toLowerCase().includes('protein') ? 'Aim for 1.2-1.6g/kg protein for your goals.' : '') +
    (message.toLowerCase().includes('motivate') ? 'Remember: consistency beats intensity. You\'ve got this! 💪' : '');
  return reply.trim();
}

export default function AICoachScreen({ user, progress, nutritionLog, workoutLog, onUpdateUser }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi ${user.name}! I\'m your AI Coach. Ask me anything about your training and nutrition.` },
  ]);
  const [input, setInput] = useState('How many calories should I aim for today?');

  const context = useMemo(() => ({ user, progress, nutritionLog, workoutLog }), [user, progress, nutritionLog, workoutLog]);

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    const assistantMsg = { role: 'assistant', content: mockGPT5NanoResponse({ ...context, message: input.trim() }) };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput('');
  }

  function updatePlan(preference) {
    onUpdateUser({ ...user, preferences: { ...user.preferences, dietary: preference } });
    setMessages((m) => [...m, { role: 'assistant', content: `Updated your dietary preference to ${preference}. I\'ll tailor future plans accordingly.` }]);
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-white border shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800">AI Coach</h2>
        <p className="text-sm text-neutral-700">Personalized advice, progress monitoring, and motivation</p>
      </div>

      <div className="p-4 rounded-xl bg-white border shadow-sm max-h-64 overflow-y-auto" aria-label="Chat history">
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-3 ${m.role === 'user' ? 'text-neutral-900' : 'text-teal-800'}`}>
            <span className="text-xs font-semibold mr-2">{m.role === 'user' ? 'You' : 'Coach'}</span>
            <span className="text-sm">{m.content}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
          aria-label="Type your question"
        />
        <button onClick={sendMessage} className="rounded-lg bg-teal-600 text-white text-sm px-4 font-medium">Send</button>
      </div>

      <section className="p-4 rounded-xl bg-orange-50 border">
        <h3 className="text-base font-semibold text-neutral-800">Coaching Plan</h3>
        <p className="text-sm text-neutral-700">Customize your coaching style:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {['Balanced', 'High-Protein', 'Low-Carb', 'Plant-Based'].map((p) => (
            <button key={p} onClick={() => updatePlan(p)} className="rounded-lg bg-teal-600 text-white text-xs px-3 py-1 font-medium">
              {p}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
