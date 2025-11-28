import React, { useState, useMemo } from 'react';
import { ExerciseDatabaseCategory, ExerciseInfo } from '../types';
import ExerciseImage from './ExerciseImage';

type ExerciseDatabaseType = ExerciseDatabaseCategory;

interface ExerciseSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseDatabase: ExerciseDatabaseType[];
    onSelectExercise: (exercise: ExerciseInfo) => void;
}

const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({ isOpen, onClose, exerciseDatabase, onSelectExercise }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('الكل');

    const allMuscleGroups = useMemo(() => ['الكل', ...exerciseDatabase.map(cat => cat.muscleGroup)], [exerciseDatabase]);

    const filteredExercises = useMemo(() => {
        let categories = exerciseDatabase;

        if (selectedGroup !== 'الكل') {
            categories = categories.filter(cat => cat.muscleGroup === selectedGroup);
        }

        if (searchTerm.trim() === '') {
            return categories;
        }

        const lowercasedSearch = searchTerm.toLowerCase();
        return categories
            .map(cat => ({
                ...cat,
                exercises: cat.exercises.filter(ex => ex.name.toLowerCase().includes(lowercasedSearch)),
            }))
            .filter(cat => cat.exercises.length > 0);

    }, [searchTerm, selectedGroup, exerciseDatabase]);

    const handleSelect = (exercise: ExerciseInfo) => {
        onSelectExercise(exercise);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} dir="rtl">
                <header className="p-4 border-b">
                    <h2 className="text-xl font-bold text-slate-800">اختر تمريناً</h2>
                    <p className="text-sm text-slate-500">ابحث أو استعرض لإضافة تمرين إلى يومك.</p>
                </header>

                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="ابحث عن تمرين..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                        {allMuscleGroups.map(group => (
                            <button
                                key={group}
                                onClick={() => setSelectedGroup(group)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                                    selectedGroup === group 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                </div>

                <main className="flex-grow overflow-y-auto p-4 space-y-4">
                    {filteredExercises.length > 0 ? (
                        filteredExercises.map(category => (
                            <div key={category.muscleGroup}>
                                <h3 className="font-bold text-lg text-blue-600 mb-2">{category.muscleGroup}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {category.exercises.map(exercise => (
                                        <button
                                            key={exercise.name}
                                            onClick={() => handleSelect(exercise)}
                                            className="flex items-center gap-3 p-2 text-start bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-500 transition-colors w-full"
                                        >
                                            <ExerciseImage 
                                                src={exercise.imageUrl}
                                                alt={exercise.name}
                                                containerClassName="w-16 h-16 rounded-md flex-shrink-0"
                                                imageClassName="w-full h-full object-cover"
                                            />
                                            <span className="font-semibold text-slate-800">{exercise.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-500">لم يتم العثور على تمارين مطابقة.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ExerciseSelectionModal;