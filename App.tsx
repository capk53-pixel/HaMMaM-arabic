import React, { useState, useCallback, useEffect } from 'react';
import { UserData, WorkoutPlan, NutritionPlan, WorkoutDay, LoggedExercise, WorkoutSession, LoggedSet, ExerciseDatabaseCategory, FoodAnalysisResult, AnalyzedFoodItem, CardioLogEntry, CardioExercise, FoodCategory } from './types';
import { generateWorkoutPlan, generateNutritionPlan, fetchExerciseDatabase, analyzeFoodImage, fetchCardioLibrary, fetchEgyptianFoodLibrary, searchFoodDatabase } from './services/geminiService';
import { cacheImages } from './services/cachingService';
import OnboardingForm from './components/OnboardingForm';
import WorkoutPlanDisplay from './components/WorkoutPlanDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import WorkoutTracker from './components/WorkoutTracker';
import WorkoutCustomizer from './components/WorkoutCustomizer';
import Login from './components/Login';
import { ImageModalProvider } from './contexts/ImageModalContext';


type AppState = 'onboarding' | 'loading' | 'displayingPlan' | 'trackingWorkout' | 'error' | 'customizingWorkout';
export type PreviousPerformance = Record<string, LoggedSet[]>;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [isNutritionLoading, setIsNutritionLoading] = useState<boolean>(false);
  const [nutritionError, setNutritionError] = useState<string | null>(null);

  // States for workout tracking
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<WorkoutDay | null>(null);
  const [previousPerformance, setPreviousPerformance] = useState<PreviousPerformance>({});
  
  // States for workout customizer
  const [exerciseDatabase, setExerciseDatabase] = useState<ExerciseDatabaseCategory[] | null>(null);
  const [isDbLoading, setIsDbLoading] = useState(false);
  
  // States for food analysis & tracking
  const [isAnalyzingFood, setIsAnalyzingFood] = useState<boolean>(false);
  const [foodAnalysisResult, setFoodAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [foodAnalysisError, setFoodAnalysisError] = useState<string | null>(null);
  const [dailyFoodLog, setDailyFoodLog] = useState<AnalyzedFoodItem[]>([]);

  // States for cardio library & tracking
  const [cardioLibrary, setCardioLibrary] = useState<CardioExercise[] | null>(null);
  const [isCardioLibraryLoading, setIsCardioLibraryLoading] = useState<boolean>(false);
  const [cardioLogs, setCardioLogs] = useState<CardioLogEntry[]>([]);
  const [dailySteps, setDailySteps] = useState(0);

  // State for Egyptian Food Library
  const [egyptianFoodLibrary, setEgyptianFoodLibrary] = useState<FoodCategory[] | null>(null);
  const [isFoodLibraryLoading, setIsFoodLibraryLoading] = useState<boolean>(false);
  const [isFoodSearchLoading, setIsFoodSearchLoading] = useState<boolean>(false);
  
  // User Authentication Effect
  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        setCurrentUser(loggedInUser);
    }
  }, []);

  // Load user-specific data from localStorage
  useEffect(() => {
    if (!currentUser) return;

    const loadData = (key: string) => {
        try {
            const savedData = localStorage.getItem(`${key}_${currentUser}`);
            return savedData ? JSON.parse(savedData) : null;
        } catch (err) {
            console.error(`Failed to load ${key} from localStorage`, err);
            return null;
        }
    };
    
    setWorkoutHistory(loadData('workoutHistory') || []);
    setCardioLogs(loadData('cardioLogs') || []);
    setDailySteps(loadData('dailySteps') || 0);

    const savedFoodLog = loadData('dailyFoodLog');
    if (savedFoodLog) {
        const { date, log } = savedFoodLog;
        const today = new Date().toISOString().split('T')[0];
        if (date === today) {
            setDailyFoodLog(log);
        } else {
            localStorage.removeItem(`dailyFoodLog_${currentUser}`);
        }
    }
  }, [currentUser]);

  // Save user-specific data to localStorage
  useEffect(() => {
    if (!currentUser) return;
    
    const saveData = (key: string, data: any) => {
        try {
            localStorage.setItem(`${key}_${currentUser}`, JSON.stringify(data));
        } catch (err) {
            console.error(`Failed to save ${key} to localStorage`, err);
        }
    };

    saveData('workoutHistory', workoutHistory);
    saveData('cardioLogs', cardioLogs);
    saveData('dailySteps', dailySteps);

    const today = new Date().toISOString().split('T')[0];
    saveData('dailyFoodLog', { date: today, log: dailyFoodLog });

  }, [workoutHistory, dailyFoodLog, cardioLogs, dailySteps, currentUser]);

  // Proactively load exercise DB when plan is displayed
  useEffect(() => {
    if (appState === 'displayingPlan' && !exerciseDatabase && !isDbLoading) {
      const loadDbInBackground = async () => {
        setIsDbLoading(true);
        try {
          const db = await fetchExerciseDatabase();
          setExerciseDatabase(db);
          cacheImages(db.flatMap(category => category.exercises));
        } catch (err) {
          console.error("Failed to preload exercise database:", err);
        } finally {
          setIsDbLoading(false);
        }
      };
      loadDbInBackground();
    }
  }, [appState, exerciseDatabase, isDbLoading]);

  const handleLogin = (username: string) => {
      setCurrentUser(username);
      localStorage.setItem('currentUser', username);
      localStorage.setItem('lastLoggedInUser', username);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      // Reset all state to default
      setAppState('onboarding');
      setWorkoutPlan(null);
      setError(null);
      setCurrentUserData(null);
      setNutritionPlan(null);
      setWorkoutHistory([]);
      setDailyFoodLog([]);
      setCardioLogs([]);
      setDailySteps(0);
  };

  const handleGeneratePlan = useCallback(async (userData: UserData) => {
    setAppState('loading');
    setError(null);
    setNutritionPlan(null);
    setNutritionError(null);
    setCurrentUserData(userData);
    try {
      const plan = await generateWorkoutPlan(userData);
      setWorkoutPlan(plan);
      cacheImages(plan.weeklySplit.flatMap(day => day.exercises));
      setAppState('displayingPlan');
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء إنشاء الخطة. يرجى المحاولة مرة أخرى.");
      setAppState('error');
    }
  }, []);
  
  const handleStartCustomization = useCallback(async () => {
    setAppState('customizingWorkout');
    if (!exerciseDatabase && !isDbLoading) {
        setIsDbLoading(true);
        try {
            const db = await fetchExerciseDatabase();
            setExerciseDatabase(db);
            cacheImages(db.flatMap(category => category.exercises));
        } catch (err) {
            console.error(err);
            setError("فشل تحميل قائمة التمارين. يرجى المحاولة مرة أخرى.");
            setAppState('error');
        } finally {
            setIsDbLoading(false);
        }
    }
  }, [exerciseDatabase, isDbLoading]);
  
  const handleSaveCustomPlan = (plan: WorkoutPlan) => {
    setWorkoutPlan(plan);
    setNutritionPlan(null);
    setCurrentUserData(null); 
    setAppState('displayingPlan');
  };

  const handleGenerateNutritionPlan = useCallback(async () => {
    if (!currentUserData || !workoutPlan) return;
    setIsNutritionLoading(true);
    setNutritionError(null);
    try {
        const plan = await generateNutritionPlan(currentUserData, workoutPlan);
        setNutritionPlan(plan);
    } catch (err) {
        console.error(err);
        setNutritionError("حدث خطأ أثناء إنشاء خطة التغذية. يرجى المحاولة مرة أخرى.");
    } finally {
        setIsNutritionLoading(false);
    }
  }, [currentUserData, workoutPlan]);
  
  const handleFetchCardioLibrary = useCallback(async () => {
    if (cardioLibrary) return;
    setIsCardioLibraryLoading(true);
    try {
        const library = await fetchCardioLibrary();
        setCardioLibrary(library);
    } catch (err) {
        console.error("Failed to fetch cardio library:", err);
    } finally {
        setIsCardioLibraryLoading(false);
    }
  }, [cardioLibrary]);
  
  const handleFetchEgyptianFoodLibrary = useCallback(async () => {
    if (egyptianFoodLibrary) return;
    setIsFoodLibraryLoading(true);
    try {
        const library = await fetchEgyptianFoodLibrary();
        setEgyptianFoodLibrary(library);
        cacheImages(library.flatMap(category => category.items));
    } catch (err) {
        console.error("Failed to fetch Egyptian food library:", err);
    } finally {
        setIsFoodLibraryLoading(false);
    }
  }, [egyptianFoodLibrary]);

  const handleSearchFood = useCallback(async (query: string) => {
      setIsFoodSearchLoading(true);
      try {
          const results = await searchFoodDatabase(query);
          if (results && results.length > 0) {
             setEgyptianFoodLibrary(prevLibrary => {
                 const newLibrary = [...(prevLibrary || [])];
                 results.forEach(result => {
                     const categoryIndex = newLibrary.findIndex(c => c.categoryName === result.categoryName);
                     if (categoryIndex >= 0) {
                         // Check if item already exists to avoid duplicates
                         if (!newLibrary[categoryIndex].items.some(i => i.name === result.item.name)) {
                             newLibrary[categoryIndex].items.push(result.item);
                         }
                     } else {
                         newLibrary.push({
                             categoryName: result.categoryName,
                             items: [result.item]
                         });
                     }
                 });
                 return newLibrary;
             });
             cacheImages(results.map(r => r.item));
          }
      } catch (err) {
          console.error("Failed to search food:", err);
      } finally {
          setIsFoodSearchLoading(false);
      }
  }, []);

  const handleAnalyzeFood = useCallback(async (base64Image: string) => {
    setIsAnalyzingFood(true);
    setFoodAnalysisResult(null);
    setFoodAnalysisError(null);
    try {
        const result = await analyzeFoodImage(base64Image);
        setFoodAnalysisResult(result);
    } catch (err) {
        console.error("Failed to analyze food:", err);
        setFoodAnalysisError("حدث خطأ أثناء التحليل. قد تكون الصورة غير واضحة أو حدث خطأ في الشبكة.");
    } finally {
        setIsAnalyzingFood(false);
    }
  }, []);

  const handleClearAnalysis = () => {
    setFoodAnalysisResult(null);
    setFoodAnalysisError(null);
  };
  
  const handleAddFoodToLog = (items: AnalyzedFoodItem[]) => {
    setDailyFoodLog(prevLog => [...prevLog, ...items]);
  };

  const handleLogCardio = (log: Omit<CardioLogEntry, 'id' | 'date'>) => {
    const newLog: CardioLogEntry = {
        ...log,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    setCardioLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateSteps = (steps: number) => {
    setDailySteps(steps);
  };

  const handleStartOver = () => {
    setWorkoutPlan(null);
    setNutritionPlan(null);
    setCurrentUserData(null);
    setActiveWorkoutDay(null);
    setAppState('onboarding');
    setError(null);
    setNutritionError(null);
  };

  const handleStartWorkout = (day: WorkoutDay) => {
    const prevPerformanceData: PreviousPerformance = {};
    day.exercises.forEach(exercise => {
      const reversedHistory = [...workoutHistory].reverse();
      const lastSession = reversedHistory.find(session => 
          session.exercises.some(e => e.name === exercise.name)
      );
      if(lastSession) {
          const loggedEx = lastSession.exercises.find(e => e.name === exercise.name);
          if (loggedEx) {
            prevPerformanceData[exercise.name] = loggedEx.sets;
          }
      }
    });
    setPreviousPerformance(prevPerformanceData);
    setActiveWorkoutDay(day);
    setAppState('trackingWorkout');
  };

  const handleFinishWorkout = (log: LoggedExercise[], duration: number) => {
    if (!activeWorkoutDay) return;
    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      dayName: activeWorkoutDay.day,
      exercises: log.filter(e => e.sets.some(s => s.reps > 0)),
      duration,
    };
    setWorkoutHistory(prev => [newSession, ...prev]);
    setActiveWorkoutDay(null);
    setAppState('displayingPlan');
  };

  const handleCancelWorkout = () => {
    setActiveWorkoutDay(null);
    setAppState('displayingPlan');
  };
  
  const renderContent = () => {
    if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    }
    
    switch (appState) {
      case 'onboarding':
        return <OnboardingForm onSubmit={handleGeneratePlan} onStartCustomization={handleStartCustomization} />;
      case 'loading':
        return <LoadingSpinner />;
      case 'customizingWorkout':
        if (isDbLoading || !exerciseDatabase) return <LoadingSpinner text="جاري تحميل مكتبة التمارين..." subtext="لحظات قليلة ونكون جاهزين لمساعدتك." />;
        return (
          <WorkoutCustomizer
            exerciseDatabase={exerciseDatabase}
            onSavePlan={handleSaveCustomPlan}
            onCancel={handleStartOver}
          />
        );
      case 'displayingPlan':
        return workoutPlan && (
            <WorkoutPlanDisplay 
                plan={workoutPlan} 
                onReset={handleStartOver}
                nutritionPlan={nutritionPlan}
                isNutritionLoading={isNutritionLoading}
                nutritionError={nutritionError}
                onGenerateNutrition={handleGenerateNutritionPlan}
                workoutHistory={workoutHistory}
                onStartWorkout={handleStartWorkout}
                canGenerateNutrition={!!currentUserData}
                exerciseDatabase={exerciseDatabase}
                isDbLoading={isDbLoading}
                onAnalyzeFood={handleAnalyzeFood}
                isAnalyzingFood={isAnalyzingFood}
                foodAnalysisResult={foodAnalysisResult}
                foodAnalysisError={foodAnalysisError}
                onClearAnalysis={handleClearAnalysis}
                dailyFoodLog={dailyFoodLog}
                onAddFoodToLog={handleAddFoodToLog}
                cardioLibrary={cardioLibrary}
                isCardioLibraryLoading={isCardioLibraryLoading}
                onFetchCardioLibrary={handleFetchCardioLibrary}
                cardioLogs={cardioLogs}
                onLogCardio={handleLogCardio}
                dailySteps={dailySteps}
                onUpdateSteps={handleUpdateSteps}
                egyptianFoodLibrary={egyptianFoodLibrary}
                isFoodLibraryLoading={isFoodLibraryLoading}
                onFetchEgyptianFoodLibrary={handleFetchEgyptianFoodLibrary}
                onSearchFood={handleSearchFood}
                isFoodSearchLoading={isFoodSearchLoading}
            />
        );
      case 'trackingWorkout':
        return activeWorkoutDay && (
            <WorkoutTracker
                day={activeWorkoutDay}
                previousPerformance={previousPerformance}
                onFinish={handleFinishWorkout}
                onCancel={handleCancelWorkout}
            />
        );
      case 'error':
        return (
          <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">خطأ في النظام</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={handleStartOver}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              البدء من جديد
            </button>
          </div>
        );
      default:
        return <OnboardingForm onSubmit={handleGeneratePlan} onStartCustomization={handleStartCustomization} />;
    }
  };

  const isFullScreen = appState === 'trackingWorkout' || appState === 'customizingWorkout';
  const showHeaderFooter = !isFullScreen && !!currentUser;

  return (
    <ImageModalProvider>
      <div className={`min-h-screen flex flex-col ${isFullScreen ? 'bg-slate-100' : 'bg-slate-50'}`}>
          {showHeaderFooter && <Header user={currentUser} onLogout={handleLogout} />}
          <main className={`flex-grow w-full ${!isFullScreen || !currentUser ? 'container mx-auto px-4 py-8 flex items-center justify-center' : ''}`}>
              {renderContent()}
          </main>
          {showHeaderFooter && <Footer />}
      </div>
    </ImageModalProvider>
  );
};

export default App;