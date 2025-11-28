import React, { useState, useMemo } from 'react';
import { ExerciseDatabaseCategory, ExerciseInfo } from '../types';
import ExerciseImage from './ExerciseImage';
import ExerciseDetailModal from './ExerciseDetailModal';

interface ExerciseLibraryProps {
    database: ExerciseDatabaseCategory[];
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ database }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('الكل');
    const [selectedExercise, setSelectedExercise] = useState<ExerciseInfo | null>(null);

    const allMuscleGroups = useMemo(() => ['الكل', ...database.map(cat => cat.muscleGroup)], [database]);

    const filteredExercises = useMemo(() => {
        let categories = database;

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

    }, [searchTerm, selectedGroup, database]);


    return (
        <>
            <div className="flex flex-col h-[70vh]" dir="rtl">
                <header className="p-4 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-4">مكتبة التمارين</h2>
                     <input
                        type="text"
                        placeholder="ابحث عن تمرين بالاسم..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex flex-wrap gap-2 mt-3 justify-center">
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
                </header>

                <main className="flex-grow overflow-y-auto p-4 space-y-6 bg-white">
                     {filteredExercises.length > 0 ? (
                        filteredExercises.map(category => (
                            <div key={category.muscleGroup}>
                                <h3 className="font-bold text-xl text-blue-600 mb-3 sticky top-0 bg-white/80 backdrop-blur-sm py-2">{category.muscleGroup}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {category.exercises.map(exercise => (
                                        <button
                                            key={exercise.name}
                                            onClick={() => setSelectedExercise(exercise)}
                                            className="flex items-center gap-4 p-3 text-start bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-500 hover:shadow-md transition-all w-full"
                                        >
                                            <ExerciseImage 
                                                src={exercise.imageUrl}
                                                alt={exercise.name}
                                                containerClassName="w-20 h-20 rounded-md flex-shrink-0"
                                                imageClassName="w-full h-full object-cover"
                                            />
                                            <span className="font-semibold text-slate-800 flex-grow">{exercise.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-slate-500 text-lg">لم يتم العثور على تمارين مطابقة لبحثك.</p>
                        </div>
                    )}
                </main>
            </div>
             {selectedExercise && (
                <ExerciseDetailModal 
                    exercise={selectedExercise}
                    onClose={() => setSelectedExercise(null)}
                />
            )}
        </>
    );
};

export default ExerciseLibrary;