import React from 'react';
import { NutritionPlan } from '../types';

const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);


const NutritionPlanDisplay: React.FC<{ plan: NutritionPlan }> = ({ plan }) => {
  const parseValue = (value: string) => {
    return value.replace('calories', '').replace('g', '').trim();
  }

  return (
    <div className="w-full text-slate-800 animate-fade-in" dir="rtl">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-green-600">{plan.planTitle}</h3>
      </div>

      {/* Daily Targets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200">
        <div className="text-center">
          <p className="text-sm text-slate-500">السعرات</p>
          <p className="text-2xl font-bold text-slate-900">{parseValue(plan.dailyCalories)}</p>
          <p className="text-xs text-slate-400">Kcal</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-500">بروتين</p>
          <p className="text-2xl font-bold text-slate-900">{parseValue(plan.dailyMacros.protein)}</p>
          <p className="text-xs text-slate-400">جرام</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-500">كارب</p>
          <p className="text-2xl font-bold text-slate-900">{parseValue(plan.dailyMacros.carbs)}</p>
          <p className="text-xs text-slate-400">جرام</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-500">دهون</p>
          <p className="text-2xl font-bold text-slate-900">{parseValue(plan.dailyMacros.fats)}</p>
          <p className="text-xs text-slate-400">جرام</p>
        </div>
      </div>

      {/* Sample Day Meals */}
      <div className="mb-8">
        <h4 className="text-xl font-bold mb-4 text-center text-slate-700">يوم نموذجي</h4>
        <div className="space-y-4">
          {plan.sampleDay.map((meal, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-lg text-green-700">{meal.name}</h5>
                <span className="text-sm font-mono bg-slate-200 text-slate-700 px-2 py-1 rounded">{meal.calories}</span>
              </div>
              <p className="mt-2 text-slate-600">{meal.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="text-xl font-bold mb-4 text-center text-slate-700">توصيات هامة</h4>
        <ul className="space-y-3">
          {plan.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start space-x-3 rtl:space-x-reverse bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex-shrink-0 pt-1">
                    <CheckIcon />
                </div>
                <span className="text-slate-600">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NutritionPlanDisplay;