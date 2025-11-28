import React from 'react';
import { FoodAnalysisResult, AnalyzedFoodItem } from '../types';
import { CloseIcon, PlusIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface FoodAnalysisModalProps {
    isLoading: boolean;
    result: FoodAnalysisResult | null;
    error: string | null;
    onClose: () => void;
    onAddToLog: (items: AnalyzedFoodItem[]) => void;
}

const FoodAnalysisModal: React.FC<FoodAnalysisModalProps> = ({ isLoading, result, error, onClose, onAddToLog }) => {
    
    const MacroBar: React.FC<{ value: number, total: number, color: string, label: string }> = ({ value, total, color, label }) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;
        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-slate-700">{label}</span>
                    <span className="text-sm font-mono text-slate-500">{Math.round(value)}ج</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full">
                    <div style={{ width: `${percentage}%` }} className={`h-2 rounded-full ${color}`}></div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner text="جاري تحليل وجبتك..." subtext="يتفحص خبيرنا الذكي كل مكون ليعطيك أدق النتائج." />;
        }
        if (error) {
            return (
                <div className="text-center p-8">
                    <h3 className="text-xl font-bold text-red-500 mb-2">حدث خطأ</h3>
                    <p className="text-slate-600">{error}</p>
                </div>
            );
        }
        if (result) {
            const totalMacros = result.totalMacros.protein + result.totalMacros.carbs + result.totalMacros.fats;
            return (
                 <div className="p-4 md:p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-slate-500">إجمالي السعرات الحرارية المقدرة</p>
                        <p className="text-5xl font-extrabold text-green-600">{Math.round(result.totalCalories)}</p>
                        <p className="text-lg text-slate-600">Kcal</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                         <h4 className="text-md font-bold text-slate-800 text-center mb-2">توزيع الماكروز</h4>
                         <MacroBar value={result.totalMacros.protein} total={totalMacros} color="bg-red-500" label="بروتين"/>
                         <MacroBar value={result.totalMacros.carbs} total={totalMacros} color="bg-blue-500" label="كارب"/>
                         <MacroBar value={result.totalMacros.fats} total={totalMacros} color="bg-amber-500" label="دهون"/>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">المكونات المحللة:</h4>
                        <ul className="divide-y divide-slate-200 border rounded-lg overflow-hidden">
                            {result.items.map(item => (
                                <li key={item.name} className="p-3 bg-white">
                                    <div className="flex justify-between items-center font-semibold">
                                        <span>{item.name} <span className="text-sm text-slate-500">({item.weightGrams}جم)</span></span>
                                        <span className="text-green-700">{item.calories} Kcal</span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex gap-4 mt-1">
                                        <span>بروتين: {item.protein}ج</span>
                                        <span>كارب: {item.carbs}ج</span>
                                        <span>دهون: {item.fats}ج</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white border-s-4 border-blue-500 p-4 rounded-e-lg">
                        <h4 className="font-bold text-blue-800">ملخص الخبير:</h4>
                        <p className="text-sm text-blue-700 mt-1">{result.summary}</p>
                    </div>
                 </div>
            );
        }
        return null;
    };


    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" 
                onClick={e => e.stopPropagation()}
                dir="rtl"
            >
                <header className="p-4 flex justify-between items-center border-b border-slate-200 bg-white sticky top-0">
                    <h2 className="text-xl font-bold text-slate-800">تحليل الوجبة</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800">
                        <CloseIcon />
                    </button>
                </header>
                
                <main className="flex-grow overflow-y-auto">
                    {renderContent()}
                </main>
                
                {result && !isLoading && !error && (
                    <footer className="p-4 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
                        <button
                          onClick={() => onAddToLog(result.items)}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                        >
                          <PlusIcon />
                          إضافة للسجل اليومي
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default FoodAnalysisModal;