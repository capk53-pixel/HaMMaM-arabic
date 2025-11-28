export interface UserData {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  experience: 'beginner' | 'intermediate' | 'advanced';
  goal: 'muscle_gain' | 'fat_loss' | 'strength_gain' | 'general_fitness' | 'body_recomposition';
  daysPerWeek: 3 | 4 | 5;
  secondaryGoals?: ('endurance' | 'flexibility' | 'posture')[];

  // New detailed fields for deeper personalization
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph';
  problemAreas?: string[];
  injuries?: string[];
  injuryDetails?: string;
  activityLevel?: 'sedentary' | 'lightly_active' | 'active';
  equipment?: 'full_gym' | 'home_gym' | 'bodyweight';
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
  imageUrl?: string;
}

export interface WorkoutDay {
  day: string;
  muscleGroups: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  planName: string;
  weeklySplit: WorkoutDay[];
}

// New types for Nutrition Plan
export interface Meal {
  name: string; // e.g., 'Breakfast', 'Lunch', 'Dinner', 'Snack 1'
  description: string; // e.g., 'Oats with protein powder and berries'
  calories: string; // e.g., '~450 kcal'
}

export interface NutritionPlan {
  planTitle: string; // e.g., 'خطة تغذية لزيادة الكتلة العضلية'
  dailyCalories: string; // e.g., '2800-3000 kcal'
  dailyMacros: {
    protein: string; // e.g., '180g'
    carbs: string; // e.g., '300g'
    fats: string; // e.g., '80g'
  };
  sampleDay: Meal[];
  recommendations: string[]; // Array of tips
}

// New types for Workout History
export interface LoggedSet {
    reps: number;
    weight: number;
}

export interface LoggedExercise {
    name: string;
    sets: LoggedSet[];
}

export interface WorkoutSession {
    id: string; // e.g., timestamp
    date: string;
    dayName: string;
    exercises: LoggedExercise[];
    duration: number; // in seconds
    notes?: string;
}

// New types for Exercise Database
export interface ExerciseInfo {
    name: string;
    imageUrl?: string;
    youtubeUrl?: string;
}

export interface ExerciseDatabaseCategory {
    muscleGroup: string;
    exercises: ExerciseInfo[];
    imageUrl?: string;
}

// New types for Food Image Analysis
export interface AnalyzedFoodItem {
    name: string; // "Grilled Chicken Breast"
    calories: number; // 220
    weightGrams: number; // 150
    protein: number; // 40
    carbs: number; // 5
    fats: number; // 8
}

export interface FoodAnalysisResult {
    totalCalories: number;
    totalMacros: {
        protein: number;
        carbs: number;
        fats: number;
    };
    items: AnalyzedFoodItem[];
    summary: string; // "This is a balanced meal, high in protein..."
}

// New types for Cardio & Daily Activity
export interface CardioExercise {
    name: string; // e.g., 'Treadmill Running'
    description: string; // 'A great exercise for cardiovascular health.'
    imageUrl?: string;
    // Defines what metrics are primary for this activity
    primaryMetrics: ('duration' | 'distance' | 'calories')[]; 
}

export interface CardioLogEntry {
    id: string; // timestamp
    date: string;
    exerciseName: string;
    durationMinutes: number;
    distanceKm?: number;
    calories?: number;
}

// Fix: Add missing types for EgyptianFoodLibrary.tsx
export interface FoodItem {
    name: string;
    servingSize: string;
    calories: string;
    protein?: string;
    carbs?: string;
    fats?: string;
    imageUrl?: string;
}

export interface FoodCategory {
    categoryName: string;
    items: FoodItem[];
}
