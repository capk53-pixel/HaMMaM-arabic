import React, { useState } from 'react';
import { WorkoutPlan, WorkoutDay, Exercise, ExerciseDatabaseCategory, ExerciseInfo } from '../types';
import { BackArrowIcon, CheckIcon, PlusIcon, TrashIcon } from './Icons';
import ExerciseSelectionModal from './ExerciseSelectionModal';

interface WorkoutCustomizerProps {
    exerciseDatabase: ExerciseDatabaseCategory[];
    onSavePlan: (plan: WorkoutPlan) => void;
    onCancel: () => void;
}

const WorkoutCustomizer: React.FC<WorkoutCustomizerProps> = ({ exerciseDatabase, onSavePlan, onCancel }) => {
    const initialDay: WorkoutDay = {
        day: 'اليوم 1',
        muscleGroups: '',
        exercises: [],
    };
    const [planName, setPlanName] = useState('خطتي المخصصة');
    const [weeklySplit, setWeeklySplit] = useState<WorkoutDay[]>([initialDay]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);

    const handleUpdateDay = (dayIndex: number, field: 'day' | 'muscleGroups', value: string) => {
        const newSplit = [...weeklySplit];
        newSplit[dayIndex][field] = value;
        setWeeklySplit(newSplit);
    };

    const handleAddDay = () => {
        setWeeklySplit([
            ...weeklySplit,
            { day: `اليوم ${weeklySplit.length + 1}`, muscleGroups: '', exercises: [] }
        ]);
    };

    const handleRemoveDay = (dayIndex: number) => {
        if (weeklySplit.length > 1) {
            setWeeklySplit(weeklySplit.filter((_, i) => i !== dayIndex));
        }
    };
    
    const handleOpenModal = (dayIndex: number) => {
        setCurrentDayIndex(dayIndex);
        setIsModalOpen(true);
    };

    const handleSelectExercise = (exerciseInfo: ExerciseInfo) => {
        if (currentDayIndex === null) return;
        const newSplit = [...weeklySplit];
        const newExercise: Exercise = {
            name: exerciseInfo.name,
            imageUrl: exerciseInfo.imageUrl,
            sets: '3',
            reps: '8-12',
            rest: '60 seconds',
            notes: '',
        };
        newSplit[currentDayIndex].exercises.push(newExercise);
        setWeeklySplit(newSplit);
    };
    
    const handleUpdateExercise = (dayIndex: number, exIndex: number, field: keyof Exercise, value: string) => {
        const newSplit = [...weeklySplit];
        (newSplit[dayIndex].exercises[exIndex] as any)[field] = value;
        setWeeklySplit(newSplit);
    };

    const handleRemoveExercise = (dayIndex: number, exIndex: number) => {
        const newSplit = [...weeklySplit];
        newSplit[dayIndex].exercises.splice(exIndex, 1);
        setWeeklySplit(newSplit);
    };

    const handleSave = () => {
        const finalPlan: WorkoutPlan = {
            planName,
            weeklySplit,
        };
        onSavePlan(finalPlan);
    };

    return (
        <div className="w-full h-full max-w-5xl mx-auto flex flex-col bg-white" dir="rtl">
            {/* Header */}
            <header className="p-4 bg-white shadow-sm sticky top-0 z-20">
                <div className="flex justify-between items-center">
                    <button onClick={onCancel} className="p-2 -ms-2 transform scale-x-[-1]">
                        <BackArrowIcon />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">إنشاء خطة مخصصة</h1>
                    <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm shadow transition-transform transform hover:scale-105">
                        <CheckIcon />
                        <span>حفظ الخطة</span>
                    </button>
                </div>
            </header>

            {/* Builder */}
            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <label htmlFor="planName" className="block text-sm font-medium text-slate-700">اسم الخطة</label>
                    <input
                        type="text"
                        id="planName"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        className="mt-1 bg-white border border-slate-300 text-slate-900 text-lg font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>

                {weeklySplit.map((day, dayIndex) => (
                    <div key={dayIndex} className="p-4 bg-white rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                value={day.day}
                                onChange={e => handleUpdateDay(dayIndex, 'day', e.target.value)}
                                className="text-xl font-bold text-slate-800 bg-transparent focus:outline-none focus:bg-slate-100 rounded p-1"
                            />
                            <button onClick={() => handleRemoveDay(dayIndex)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={weeklySplit.length <= 1}>
                                <TrashIcon />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="المجموعات العضلية المستهدفة (مثال: صدر، كتف)"
                            value={day.muscleGroups}
                            onChange={e => handleUpdateDay(dayIndex, 'muscleGroups', e.target.value)}
                            className="mb-4 bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                        />
                        
                        <div className="space-y-2">
                            {day.exercises.map((ex, exIndex) => (
                                <div key={exIndex} className="grid grid-cols-12 gap-2 items-center p-2 bg-white border border-slate-200 rounded-md">
                                    <div className="col-span-12 sm:col-span-3 font-semibold text-slate-700 truncate">{ex.name}</div>
                                    <div className="col-span-4 sm:col-span-2"><input type="text" value={ex.sets} onChange={e => handleUpdateExercise(dayIndex, exIndex, 'sets', e.target.value)} className="w-full p-1 border rounded text-center" placeholder="الجولات" /></div>
                                    <div className="col-span-4 sm:col-span-3"><input type="text" value={ex.reps} onChange={e => handleUpdateExercise(dayIndex, exIndex, 'reps', e.target.value)} className="w-full p-1 border rounded text-center" placeholder="التكرارات" /></div>
                                    <div className="col-span-4 sm:col-span-3"><input type="text" value={ex.rest} onChange={e => handleUpdateExercise(dayIndex, exIndex, 'rest', e.target.value)} className="w-full p-1 border rounded text-center" placeholder="الراحة" /></div>
                                    <div className="col-span-12 sm:col-span-1 flex justify-end">
                                        <button onClick={() => handleRemoveExercise(dayIndex, exIndex)} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => handleOpenModal(dayIndex)} className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-700 font-semibold rounded-md text-sm hover:bg-blue-100/60 transition-colors">
                            <PlusIcon className="w-5 h-5" />
                            إضافة تمرين
                        </button>
                    </div>
                ))}
                <button onClick={handleAddDay} className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-colors">
                    <PlusIcon />
                    إضافة يوم تدريبي
                </button>
            </main>
            
            <ExerciseSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exerciseDatabase={exerciseDatabase}
                onSelectExercise={handleSelectExercise}
            />
        </div>
    );
};

export default WorkoutCustomizer;