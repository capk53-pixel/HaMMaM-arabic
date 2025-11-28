import React, { useState } from 'react';
import { CardioExercise, CardioLogEntry } from '../types';
import { CloseIcon, PlusIcon } from './Icons';
import ExerciseImage from './ExerciseImage';

interface CardioLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardioLibrary: CardioExercise[];
    onLogCardio: (log: Omit<CardioLogEntry, 'id' | 'date'>) => void;
}

const CardioLogModal: React.FC<CardioLogModalProps> = ({ isOpen, onClose, cardioLibrary, onLogCardio }) => {
    const [selectedExercise, setSelectedExercise] = useState<CardioExercise | null>(null);
    const [duration, setDuration] = useState('');
    const [distance, setDistance] = useState('');
    const [calories, setCalories] = useState('');
    const [error, setError] = useState('');

    const handleSelectExercise = (exercise: CardioExercise) => {
        setSelectedExercise(exercise);
        setError('');
    };
    
    const handleSubmit = () => {
        if (!selectedExercise) return;
        
        const durationMinutes = parseInt(duration);
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            setError("الرجاء إدخال مدة زمنية صالحة.");
            return;
        }

        onLogCardio({
            exerciseName: selectedExercise.name,
            durationMinutes,
            distanceKm: distance ? parseFloat(distance) : undefined,
            calories: calories ? parseInt(calories) : undefined,
        });

        // Reset and close
        setSelectedExercise(null);
        setDuration('');
        setDistance('');
        setCalories('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} dir="rtl">
                <header className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-slate-800">{selectedExercise ? `تسجيل: ${selectedExercise.name}` : "اختر نشاط كارديو"}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200"><CloseIcon /></button>
                </header>

                <main className="flex-grow overflow-y-auto p-4">
                    {selectedExercise ? (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                 <label className="block mb-1 text-sm font-medium text-slate-700">المدة (بالدقائق)</label>
                                 <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 border rounded-md" placeholder="مثال: 30" />
                            </div>
                            {selectedExercise.primaryMetrics.includes('distance') && (
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-slate-700">المسافة (كم)</label>
                                    <input type="number" value={distance} onChange={e => setDistance(e.target.value)} className="w-full p-2 border rounded-md" placeholder="مثال: 5.2" />
                                </div>
                            )}
                            {selectedExercise.primaryMetrics.includes('calories') && (
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-slate-700">السعرات</label>
                                    <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="w-full p-2 border rounded-md" placeholder="مثال: 350" />
                                </div>
                            )}
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {cardioLibrary.map(ex => (
                                <button key={ex.name} onClick={() => handleSelectExercise(ex)} className="flex flex-col items-center p-3 text-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-500 transition-colors w-full">
                                    <ExerciseImage src={ex.imageUrl} alt={ex.name} containerClassName="w-20 h-20 rounded-lg mb-2" imageClassName="w-full h-full object-contain p-2" />
                                    <span className="font-semibold text-slate-800">{ex.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </main>

                {selectedExercise && (
                    <footer className="p-4 border-t bg-white">
                        <button
                          onClick={handleSubmit}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg"
                        >
                          <PlusIcon />
                          إضافة للسجل
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default CardioLogModal;