import React from 'react';
import { AnalyzedFoodItem, NutritionPlan } from '../types';
import { ClipboardListIcon } from './Icons';

interface NutritionTrackerProps {
    log: AnalyzedFoodItem[];
    plan: NutritionPlan | null;
}

const parseTarget = (target: string | undefined): number => {
    if (!target) return 0;
    const match = target.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
};

const Progressbar: React.FC<{ value: number, target: number, color: string, label: string }> = ({ value, target, color, label }) => {
    const percentage = target > 0 ? Math.min((value / target) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <span className="text-xs font-mono text-slate-500">{Math.round(value)} / {target} جرام</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full">
                <div style={{ width: `${percentage}%` }} className={`h-2.5 rounded-full ${color} transition-all duration-500`}></div>
            </div>
        </div>
    );
};


const NutritionTracker: React.FC<NutritionTrackerProps> = ({ log, plan }) => {
    const totals = log.reduce((acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fats += item.fats;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const targets = {
        calories: parseTarget(plan?.dailyCalories),
        protein: parseTarget(plan?.dailyMacros.protein),
        carbs: parseTarget(plan?.dailyMacros.carbs),
        fats: parseTarget(plan?.dailyMacros.fats),
    };
    
    const caloriePercentage = targets.calories > 0 ? Math.min((totals.calories / targets.calories) * 100, 100) : 0;

    return (
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-6" dir="rtl">
            <div className="text-center">
                <div className="flex justify-center items-center gap-2 text-slate-800">
                    <ClipboardListIcon />
                    <h3 className="text-2xl font-bold">سجل التغذية اليومي</h3>
                </div>
            </div>
            
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-slate-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className="text-green-500"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${caloriePercentage}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <div className="absolute text-center">
                        <span className="text-4xl font-extrabold text-slate-800">{Math.round(totals.calories)}</span>
                        <p className="text-sm text-slate-500">/{targets.calories} Kcal</p>
                    </div>
                </div>
                
                {/* Macro Bars */}
                <div className="space-y-4">
                    <Progressbar value={totals.protein} target={targets.protein} color="bg-red-500" label="بروتين" />
                    <Progressbar value={totals.carbs} target={targets.carbs} color="bg-blue-500" label="كارب" />
                    <Progressbar value={totals.fats} target={targets.fats} color="bg-amber-500" label="دهون" />
                </div>
            </div>

            {/* Food Log List */}
            <div>
                 <h4 className="text-lg font-bold text-slate-800 mb-2">الأطعمة المسجلة:</h4>
                 {log.length > 0 ? (
                    <ul className="divide-y divide-slate-200 border rounded-lg max-h-48 overflow-y-auto">
                        {log.map((item, index) => (
                            <li key={`${item.name}-${index}`} className="p-3 bg-white flex justify-between items-center">
                                <span className="font-semibold">{item.name} <span className="text-sm text-slate-500">({item.weightGrams}جم)</span></span>
                                <span className="text-green-700 font-mono">{Math.round(item.calories)} Kcal</span>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <div className="text-center p-6 bg-white border border-slate-200 rounded-lg">
                        <p className="text-slate-500">لم تسجل أي طعام اليوم. ابدأ بتحليل وجبتك الأولى!</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default NutritionTracker;