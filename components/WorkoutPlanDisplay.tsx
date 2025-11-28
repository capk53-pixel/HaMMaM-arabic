import React, { useState, useEffect } from 'react';
import { WorkoutPlan, WorkoutDay, Exercise, NutritionPlan, WorkoutSession, ExerciseDatabaseCategory, FoodAnalysisResult, AnalyzedFoodItem, CardioExercise, CardioLogEntry, FoodCategory } from '../types';
import ExerciseCard from './ExerciseCard';
import NutritionPlanDisplay from './NutritionPlanDisplay';
import LoadingSpinner from './LoadingSpinner';
import WorkoutHistory from './WorkoutHistory';
import ExerciseLibrary from './ExerciseLibrary';
import EgyptianFoodLibrary from './EgyptianFoodLibrary';
import { CameraIcon } from './Icons';
import FoodCamera from './FoodCamera';
import FoodAnalysisModal from './FoodAnalysisModal';
import NutritionTracker from './NutritionTracker';
import DailyActivityLog from './DailyActivityLog';

interface WorkoutPlanDisplayProps {
  plan: WorkoutPlan;
  onReset: () => void;
  nutritionPlan: NutritionPlan | null;
  isNutritionLoading: boolean;
  nutritionError: string | null;
  onGenerateNutrition: () => void;
  workoutHistory: WorkoutSession[];
  onStartWorkout: (day: WorkoutDay) => void;
  canGenerateNutrition: boolean;
  exerciseDatabase: ExerciseDatabaseCategory[] | null;
  isDbLoading: boolean;
  onAnalyzeFood: (base64Image: string) => void;
  isAnalyzingFood: boolean;
  foodAnalysisResult: FoodAnalysisResult | null;
  foodAnalysisError: string | null;
  onClearAnalysis: () => void;
  dailyFoodLog: AnalyzedFoodItem[];
  onAddFoodToLog: (items: AnalyzedFoodItem[]) => void;
  cardioLibrary: CardioExercise[] | null;
  isCardioLibraryLoading: boolean;
  onFetchCardioLibrary: () => void;
  cardioLogs: CardioLogEntry[];
  onLogCardio: (log: Omit<CardioLogEntry, 'id' | 'date'>) => void;
  dailySteps: number;
  onUpdateSteps: (steps: number) => void;
  egyptianFoodLibrary: FoodCategory[] | null;
  isFoodLibraryLoading: boolean;
  onFetchEgyptianFoodLibrary: () => void;
  onSearchFood: (query: string) => void;
  isFoodSearchLoading: boolean;
}

type Tab = 'workout' | 'nutrition' | 'activity' | 'library' | 'history';
type LibraryTab = 'exercises' | 'food';

const WorkoutPlanDisplay: React.FC<WorkoutPlanDisplayProps> = (props) => {
  const {
    plan, onReset, nutritionPlan, isNutritionLoading, nutritionError, onGenerateNutrition,
    workoutHistory, onStartWorkout, canGenerateNutrition, exerciseDatabase, isDbLoading,
    onAnalyzeFood, isAnalyzingFood, foodAnalysisResult, foodAnalysisError, onClearAnalysis,
    dailyFoodLog, onAddFoodToLog, cardioLibrary, isCardioLibraryLoading, onFetchCardioLibrary,
    cardioLogs, onLogCardio, dailySteps, onUpdateSteps,
    egyptianFoodLibrary, isFoodLibraryLoading, onFetchEgyptianFoodLibrary,
    onSearchFood, isFoodSearchLoading
  } = props;
    
  const [activeTab, setActiveTab] = useState<Tab>('workout');
  const [activeLibraryTab, setActiveLibraryTab] = useState<LibraryTab>('exercises');
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>(plan.weeklySplit[0]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  useEffect(() => {
    // If the plan changes, reset the selected day
    setSelectedDay(plan.weeklySplit[0]);
  }, [plan]);
  
  useEffect(() => {
      if(activeTab === 'library' && activeLibraryTab === 'food' && !egyptianFoodLibrary) {
          onFetchEgyptianFoodLibrary();
      }
  }, [activeTab, activeLibraryTab, egyptianFoodLibrary, onFetchEgyptianFoodLibrary]);

  const handleCaptureAndAnalyze = (base64Image: string) => {
    onAnalyzeFood(base64Image);
  };
  
  const handleAddToLogAndClose = (items: AnalyzedFoodItem[]) => {
    onAddFoodToLog(items);
    onClearAnalysis();
  };
  
  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{plan.planName}</h2>
        <p className="text-slate-500 mt-2">خطتك المتكاملة للصحة واللياقة البدنية</p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-8 p-2 bg-white border border-slate-200 rounded-lg">
        <TabButton tabName="workout" label="التمرين" />
        <TabButton tabName="nutrition" label="التغذية" />
        <TabButton tabName="activity" label="النشاط اليومي" />
        <TabButton tabName="library" label="المكتبة" />
        <TabButton tabName="history" label="سجلاتي" />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-200/80">
        {activeTab === 'workout' && (
          <div>
            <div className="flex justify-center flex-wrap gap-2 mb-6">
              {plan.weeklySplit.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 font-semibold rounded-lg transition-all border-2 ${
                    selectedDay.day === day.day
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500'
                  }`}
                >
                  {day.day}: {day.muscleGroups}
                </button>
              ))}
            </div>
            <div className="text-center mb-6">
                 <button onClick={() => onStartWorkout(selectedDay)} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105">
                     ابدأ التمرين
                 </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedDay.exercises.map((exercise) => (
                <ExerciseCard key={exercise.name} exercise={exercise} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir="rtl">
                <div>
                     {isNutritionLoading ? (
                        <LoadingSpinner text="جاري إنشاء خطة التغذية..." subtext="يقوم خبير التغذية الافتراضي بتحليل بياناتك." />
                    ) : nutritionError ? (
                        <div className="text-center p-8 bg-red-50 rounded-lg">
                            <h3 className="text-xl font-bold text-red-600">حدث خطأ</h3>
                            <p className="text-slate-600 my-4">{nutritionError}</p>
                            <button onClick={onGenerateNutrition} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">حاول مرة أخرى</button>
                        </div>
                    ) : nutritionPlan ? (
                        <NutritionPlanDisplay plan={nutritionPlan} />
                    ) : (
                        <div className="text-center p-8 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center h-full">
                            <h3 className="text-2xl font-bold text-blue-800">هل أنت مستعد لإكمال خطتك؟</h3>
                             {canGenerateNutrition ? (
                                <>
                                    <p className="text-slate-600 my-4">احصل على خطة تغذية مخصصة تم تصميمها لتتوافق تمامًا مع تمارينك وتساعدك على تحقيق أهدافك بشكل أسرع.</p>
                                    <button onClick={onGenerateNutrition} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md">أنشئ خطة التغذية الخاصة بي</button>
                                </>
                             ) : (
                                <p className="text-slate-600 my-4">لا يمكن إنشاء خطة تغذية تلقائية لخطط التمرين المخصصة. يرجى إنشاء خطة ذكية أولاً للحصول على توصيات التغذية.</p>
                             )}
                        </div>
                    )}
                </div>
                 <div className="space-y-6">
                    <div className="p-4 bg-white border-s-4 border-blue-500 rounded-e-lg">
                        <h3 className="font-bold text-blue-800">لست متأكداً من سعرات وجبتك؟</h3>
                        <p className="text-sm text-blue-700 mt-1">استخدم كاميرا هاتفك لتحليل أي وجبة فورياً. سيقوم مدربك الذكي بتحديد المكونات وتقدير السعرات الحرارية والماكروز بدقة.</p>
                        <button onClick={() => setIsCameraOpen(true)} className="mt-3 flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                            <CameraIcon className="h-5 w-5" />
                            حلل وجبتك بالكاميرا
                        </button>
                    </div>
                     <NutritionTracker log={dailyFoodLog} plan={nutritionPlan} />
                 </div>
           </div>
        )}
        
        {activeTab === 'activity' && (
            <DailyActivityLog
                logs={cardioLogs}
                cardioLibrary={cardioLibrary}
                isLibraryLoading={isCardioLibraryLoading}
                onLogCardio={onLogCardio}
                onFetchCardioLibrary={onFetchCardioLibrary}
                dailySteps={dailySteps}
                onUpdateSteps={onUpdateSteps}
            />
        )}

        {activeTab === 'library' && (
          <div>
            <div className="flex justify-center gap-4 mb-6 border-b pb-4">
              <button
                onClick={() => setActiveLibraryTab('exercises')}
                className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                  activeLibraryTab === 'exercises'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                مكتبة التمارين
              </button>
              <button
                onClick={() => setActiveLibraryTab('food')}
                className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                  activeLibraryTab === 'food'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                موسوعة الطعام المصري
              </button>
            </div>

            {activeLibraryTab === 'exercises' && (
              isDbLoading && !exerciseDatabase ? (
                <LoadingSpinner text="جاري تحميل مكتبة التمارين..." />
              ) : exerciseDatabase ? (
                <ExerciseLibrary database={exerciseDatabase} />
              ) : (
                <p className="text-center text-slate-500">
                  حدث خطأ أثناء تحميل قائمة التمارين. يرجى المحاولة مرة أخرى.
                </p>
              )
            )}
            
            {activeLibraryTab === 'food' && (
                isFoodLibraryLoading ? (
                    <LoadingSpinner text="جاري تحميل موسوعة الطعام..." subtext="لحظات قليلة وتكون كل الأكلات الشهية أمامك."/>
                ) : egyptianFoodLibrary ? (
                    <EgyptianFoodLibrary 
                        library={egyptianFoodLibrary} 
                        onSearchFood={onSearchFood}
                        isSearchLoading={isFoodSearchLoading}
                        onAddFoodToLog={(item) => onAddFoodToLog([item])}
                    />
                ) : (
                    <p className="text-center text-slate-500">
                      حدث خطأ أثناء تحميل موسوعة الطعام. يرجى المحاولة مرة أخرى.
                    </p>
                )
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <WorkoutHistory sessions={workoutHistory} />
        )}
      </div>

      <div className="text-center mt-8">
        <button onClick={onReset} className="text-slate-500 hover:text-red-600 font-semibold transition-colors">
          إنشاء خطة جديدة
        </button>
      </div>
      
      {isCameraOpen && <FoodCamera onCapture={handleCaptureAndAnalyze} onClose={() => setIsCameraOpen(false)} />}
      
      {(isAnalyzingFood || foodAnalysisResult || foodAnalysisError) && (
        <FoodAnalysisModal
            isLoading={isAnalyzingFood}
            result={foodAnalysisResult}
            error={foodAnalysisError}
            onClose={onClearAnalysis}
            onAddToLog={handleAddToLogAndClose}
        />
      )}
    </div>
  );
};

export default WorkoutPlanDisplay;