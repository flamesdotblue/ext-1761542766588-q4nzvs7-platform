import { useState } from 'react';
import TabNavigation from './components/TabNavigation';
import HomeScreen from './components/HomeScreen';
import ExercisesScreen from './components/ExercisesScreen';
import NutritionScreen from './components/NutritionScreen';
import AICoachScreen from './components/AICoachScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [user, setUser] = useState({
    name: 'Alex',
    age: 29,
    gender: 'Non-binary',
    heightCm: 172,
    weightKg: 72,
    goals: {
      caloriesTarget: 2200,
      stepsTarget: 8000,
      workoutsPerWeek: 4,
    },
    preferences: {
      dietary: 'Balanced',
      allergies: [],
    },
    fitnessLevel: 'Intermediate',
  });

  const [progress, setProgress] = useState({
    caloriesConsumed: 1450,
    steps: 5200,
    workoutsCompletedToday: 1,
    workoutsThisWeek: 2,
  });

  const [nutritionLog, setNutritionLog] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);

  const tabs = [
    { key: 'Home', label: 'Home' },
    { key: 'Exercises', label: 'Exercises' },
    { key: 'Nutrition', label: 'Nutrition' },
    { key: 'AI Coach', label: 'AI Coach' },
    { key: 'Profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        <header className="px-4 pt-6 pb-3 bg-white/80 backdrop-blur sticky top-0 z-10 border-b">
          <h1 className="text-xl font-semibold tracking-tight text-teal-700">FitFuel</h1>
          <p className="text-sm text-neutral-600">Your mobile-first fitness & nutrition coach</p>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {activeTab === 'Home' && (
            <HomeScreen user={user} progress={progress} />
          )}
          {activeTab === 'Exercises' && (
            <ExercisesScreen
              user={user}
              workoutLog={workoutLog}
              setWorkoutLog={setWorkoutLog}
              progress={progress}
              setProgress={setProgress}
            />
          )}
          {activeTab === 'Nutrition' && (
            <NutritionScreen
              user={user}
              nutritionLog={nutritionLog}
              setNutritionLog={setNutritionLog}
              progress={progress}
              setProgress={setProgress}
            />
          )}
          {activeTab === 'AI Coach' && (
            <AICoachScreen
              user={user}
              progress={progress}
              nutritionLog={nutritionLog}
              workoutLog={workoutLog}
              onUpdateUser={setUser}
            />
          )}
          {activeTab === 'Profile' && (
            <ProfileScreen user={user} onUpdateUser={setUser} progress={progress} />
          )}
        </main>

        <TabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}
