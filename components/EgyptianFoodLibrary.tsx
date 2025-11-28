import React, { useState, useMemo } from 'react';
import { FoodCategory, FoodItem, AnalyzedFoodItem } from '../types';
import ExerciseImage from './ExerciseImage'; // Reusable for food images
import { BookOpenIcon, PlusIcon, CheckIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface EgyptianFoodLibraryProps {
    library: FoodCategory[];
    onSearchFood: (query: string) => void;
    isSearchLoading: boolean;
    onAddFoodToLog: (item: AnalyzedFoodItem) => void;
}

const EgyptianFoodLibrary: React.FC<EgyptianFoodLibraryProps> = ({ library, onSearchFood, isSearchLoading, onAddFoodToLog }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLibrary = useMemo(() => {
        if (!searchTerm.trim()) {
            return library;
        }
        const lowercasedSearch = searchTerm.toLowerCase();
        return library
            .map(category => ({
                ...category,
                items: category.items.filter(item => item.name.toLowerCase().includes(lowercasedSearch)),
            }))
            .filter(category => category.items.length > 0);
    }, [searchTerm, library]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearchFood(searchTerm.trim());
        }
    };

    return (
        <div className="flex flex-col" dir="rtl">
            <header className="text-center mb-6">
                 <div className="flex justify-center items-center gap-3 text-slate-800">
                    <BookOpenIcon />
                    <h2 className="text-2xl font-bold">موسوعة الطعام الشاملة</h2>
                 </div>
                <p className="text-slate-500 mt-2">استكشف أشهر الأطباق المصرية والعالمية وتفاصيلها الغذائية.</p>
            </header>
            
            <div className="mb-6">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        placeholder="ابحث عن أكلة (مثل: كشري، بيتزا، محشي)..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-4 text-lg bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                     {searchTerm.trim() && !isSearchLoading && (
                        <button 
                            type="submit"
                            className="absolute left-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                        >
                            <span>اسأل الذكاء الاصطناعي</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </button>
                    )}
                </form>
                {searchTerm.trim() && (
                    <p className="text-xs text-slate-400 mt-2 mr-2">إذا لم تجد طعامك في القائمة، اضغط على زر الذكاء الاصطناعي وسيقوم HaMMaM بإحضاره لك.</p>
                )}
            </div>

            {isSearchLoading ? (
                 <LoadingSpinner text={`جاري البحث عن "${searchTerm}"...`} subtext="يقوم الذكاء الاصطناعي بجمع المعلومات الغذائية الدقيقة لك." />
            ) : (
                <main className="space-y-8">
                    {filteredLibrary.length > 0 ? (
                        filteredLibrary.map(category => (
                            <div key={category.categoryName}>
                                <h3 className="font-bold text-xl text-blue-800 bg-blue-50 p-2 rounded-r-lg border-r-4 border-blue-500 mb-4 inline-block pr-4 min-w-[200px]">{category.categoryName}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.items.map(item => (
                                        <FoodItemCard key={item.name} item={item} onAdd={onAddFoodToLog} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-xl text-slate-600 font-semibold mb-2">لم يتم العثور على "{searchTerm}" في القائمة المحلية.</p>
                            <p className="text-slate-500 mb-6">لكن لا تقلق! مدربك الذكي جاهز للمساعدة.</p>
                            <button 
                                onClick={() => onSearchFood(searchTerm)}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 mx-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                البحث باستخدام الذكاء الاصطناعي
                            </button>
                        </div>
                    )}
                </main>
            )}
        </div>
    );
};


const MacroStat: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div>
        <p className={`text-xs font-semibold ${color}`}>{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
);


const FoodItemCard: React.FC<{ item: FoodItem; onAdd: (item: AnalyzedFoodItem) => void }> = ({ item, onAdd }) => {
    const [isAdded, setIsAdded] = useState(false);
    const caloriesText = item.calories.replace('calories', '').replace('سعرة حرارية', '').trim();
    
    const handleAdd = () => {
        const extractNumber = (str: string | undefined): number => {
            if (!str) return 0;
            // Convert Arabic-Indic digits to Western Arabic digits (٠-٩ -> 0-9)
            const normalized = str.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
            // Matches integer or decimal numbers
            const match = normalized.match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[0]) : 0;
        };

        const analyzedItem: AnalyzedFoodItem = {
            name: item.name,
            calories: extractNumber(item.calories),
            protein: extractNumber(item.protein),
            carbs: extractNumber(item.carbs),
            fats: extractNumber(item.fats),
            // Try to infer grams if present in serving size, otherwise default to 0 or standard portion
            weightGrams: extractNumber(item.servingSize) || 100 
        };

        onAdd(analyzedItem);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative">
            <ExerciseImage
                src={item.imageUrl}
                alt={item.name}
                containerClassName="mb-3 rounded-lg aspect-video overflow-hidden"
                imageClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="flex-grow">
                 <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                 <p className="text-sm text-slate-500 mb-2 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">{item.servingSize}</p>
            </div>

             {(item.protein || item.carbs || item.fats) && (
                <div className="grid grid-cols-3 gap-2 text-center my-3 py-2 border-t border-b border-slate-100 bg-slate-50/50 rounded-md">
                    {item.protein && <MacroStat label="بروتين" value={item.protein} color="text-red-500" />}
                    {item.carbs && <MacroStat label="كارب" value={item.carbs} color="text-blue-500" />}
                    {item.fats && <MacroStat label="دهون" value={item.fats} color="text-amber-500" />}
                </div>
            )}

            <div className="mt-auto pt-2 flex justify-between items-center">
                 <p className="text-xl font-bold text-green-600">{caloriesText} <span className="text-sm text-slate-500 font-normal">سعرة</span></p>
                 
                 <button 
                    onClick={handleAdd}
                    disabled={isAdded}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                        isAdded 
                        ? 'bg-green-100 text-green-700 scale-105' 
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
                    }`}
                 >
                    {isAdded ? (
                        <>
                            <CheckIcon className="h-4 w-4" />
                            تمت الإضافة
                        </>
                    ) : (
                        <>
                            <PlusIcon className="h-4 w-4" />
                            إضافة
                        </>
                    )}
                 </button>
            </div>
        </div>
    );
};

export default EgyptianFoodLibrary;