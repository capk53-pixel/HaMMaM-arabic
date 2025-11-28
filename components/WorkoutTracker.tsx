import React, { useState, useEffect } from 'react';
import { WorkoutDay, LoggedExercise } from '../types';
import { PreviousPerformance } from '../App';
import { BackArrowIcon, CheckIcon } from './Icons';
import TrackedExerciseCard from './TrackedExerciseCard';

export interface SetState {
    weight: string;
    reps: string;
    completed: boolean;
}

interface WorkoutTrackerProps {
  day: WorkoutDay;
  previousPerformance: PreviousPerformance;
  onFinish: (log: LoggedExercise[], duration: number) => void;
  onCancel: () => void;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ day, previousPerformance, onFinish, onCancel }) => {
    const [setsState, setSetsState] = useState<Record<string, SetState[]>>(() => {
        const initialState: Record<string, SetState[]> = {};
        day.exercises.forEach(ex => {
            const targetSets = parseInt(ex.sets, 10) || 3;
            const prevSets = previousPerformance[ex.name] || [];
            initialState[ex.name] = Array.from({ length: targetSets }, (_, i) => ({
                weight: prevSets[i] ? String(prevSets[i].weight) : '',
                reps: '',
                completed: false,
            }));
        });
        return initialState;
    });
    
    const [completedExercises, setCompletedExercises] = useState(0);
    const [startTime] = useState(Date.now());


    const totalExercises = day.exercises.length;
    const progress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
    
    const onSetChange = (exerciseName: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
        const newSets = [...(setsState[exerciseName] || [])];
        if (newSets[setIndex]) {
            newSets[setIndex] = { ...newSets[setIndex], [field]: value };
            setSetsState(prev => ({ ...prev, [exerciseName]: newSets }));
        }
    };

    const onAddSet = (exerciseName: string) => {
        const currentSets = setsState[exerciseName] || [];
        const lastSet = currentSets.length > 0 ? currentSets[currentSets.length - 1] : { weight: '', reps: '' };
        const newSet: SetState = { weight: lastSet.weight, reps: '', completed: false };
        setSetsState(prev => ({ ...prev, [exerciseName]: [...currentSets, newSet] }));
    };

    const onToggleComplete = (exerciseName: string, setIndex: number) => {
        const newSets = [...(setsState[exerciseName] || [])];
        const set = newSets[setIndex];
        if (!set) return;

        const wasCompleted = set.completed;
        if (!wasCompleted && (set.reps.trim() === '' || set.weight.trim() === '')) {
            return;
        }

        newSets[setIndex] = { ...set, completed: !wasCompleted };

        if (!wasCompleted && setIndex < newSets.length - 1 && newSets[setIndex + 1].weight === '') {
            newSets[setIndex + 1] = { ...newSets[setIndex + 1], weight: set.weight };
        }
        
        setSetsState(prev => ({ ...prev, [exerciseName]: newSets }));
        return !wasCompleted;
    };
    
    useEffect(() => {
        const newCompletedCount = day.exercises.reduce((count, exercise) => {
            const exerciseSets = setsState[exercise.name] || [];
            const targetSets = parseInt(exercise.sets, 10);
            const completedSetsCount = exerciseSets.filter(s => s.completed).length;
            if (completedSetsCount >= targetSets && exerciseSets.every(s => s.completed || (s.reps === '' && s.weight === ''))) {
                 return count + 1;
            }
            return count;
        }, 0);
        setCompletedExercises(newCompletedCount);
    }, [setsState, day.exercises]);

    const handleFinishWorkout = () => {
        const durationInSeconds = Math.floor((Date.now() - startTime) / 1000);
        const finalLog: LoggedExercise[] = Object.entries(setsState)
            .map(([name, sets]) => ({
                name,
                // FIX: Cast 'sets' to 'SetState[]' to resolve TypeScript inference issue with Object.entries.
                sets: (sets as SetState[])
                    .filter(s => s.completed)
                    .map(s => ({
                        reps: parseInt(s.reps, 10) || 0,
                        weight: parseFloat(s.weight) || 0,
                    })),
            }))
            .filter(ex => ex.sets.length > 0);

        onFinish(finalLog, durationInSeconds);
    };

    return (
        <div className="w-full h-full max-w-5xl mx-auto flex flex-col bg-white" dir="rtl">
            {/* Header */}
            <header className="p-4 bg-white shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <button onClick={onCancel} className="p-2 -ms-2 transform scale-x-[-1]">
                        <BackArrowIcon />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-slate-900">{day.day}</h1>
                        <p className="text-sm text-slate-500">{day.muscleGroups}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleFinishWorkout} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-full font-semibold text-sm shadow transition-transform transform hover:scale-105">
                            <CheckIcon />
                            <span>إنهاء</span>
                        </button>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-1 font-medium">
                        <span>اكتمل {completedExercises} / {totalExercises}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Exercises List */}
            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                {day.exercises.map((exercise, index) => (
                    <TrackedExerciseCard
                        key={exercise.name}
                        exercise={exercise}
                        previousSets={previousPerformance[exercise.name] || []}
                        isInitiallyOpen={index === 0}
                        setsData={setsState[exercise.name] || []}
                        onSetChange={(setIndex, field, value) => onSetChange(exercise.name, setIndex, field, value)}
                        onToggleComplete={(setIndex) => onToggleComplete(exercise.name, setIndex)}
                        onAddSet={() => onAddSet(exercise.name)}
                    />
                ))}
            </main>
        </div>
    );
};

export default WorkoutTracker;