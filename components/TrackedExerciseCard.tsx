import React, { useState, useEffect } from 'react';
import { Exercise, LoggedSet } from '../types';
import { SetState } from './WorkoutTracker';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon, PencilIcon, ThreeDotsIcon, CheckIcon, PauseIcon, PlayIcon, SkipIcon } from './Icons';
import ExerciseImage from './ExerciseImage';

interface TrackedExerciseCardProps {
    exercise: Exercise;
    previousSets: LoggedSet[];
    isInitiallyOpen?: boolean;
    setsData: SetState[];
    onSetChange: (setIndex: number, field: 'weight' | 'reps', value: string) => void;
    onToggleComplete: (setIndex: number) => boolean | undefined;
    onAddSet: () => void;
}


const TrackedExerciseCard: React.FC<TrackedExerciseCardProps> = ({ 
    exercise, 
    previousSets, 
    isInitiallyOpen = false, 
    setsData,
    onSetChange,
    onToggleComplete,
    onAddSet
}) => {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);
    const [exerciseNotes, setExerciseNotes] = useState('');
        
    // Timer state
    const [isResting, setIsResting] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    // Timer logic
    useEffect(() => {
        if (!isResting || isPaused) return;

        if (remainingTime <= 0) {
            setIsResting(false);
            return;
        }

        const intervalId = setInterval(() => {
            setRemainingTime(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isResting, isPaused, remainingTime]);

    const handleSetChange = (index: number, field: 'weight' | 'reps', value: string) => {
        let sanitizedValue = value;
        if (field === 'weight') {
            sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        } else {
            sanitizedValue = value.replace(/[^0-9]/g, '');
        }
        onSetChange(index, field, sanitizedValue);
    };
    
    const startTimer = () => {
        const restSeconds = parseInt(exercise.rest.match(/\d+/)?.[0] || '60', 10);
        setRemainingTime(restSeconds);
        setIsResting(true);
        setIsPaused(false);
    };

    const handleToggleSetComplete = (index: number) => {
        const setWasCompleted = onToggleComplete(index);
        if (setWasCompleted) { // if it just got completed
            if (index < setsData.length - 1) {
                 startTimer();
            }
        } else { // if it just got un-completed
            setIsResting(false);
        }
    };
    
    const handlePauseResumeTimer = () => setIsPaused(prev => !prev);
    
    const handleSkipTimer = () => {
        setIsResting(false);
        setRemainingTime(0);
    };
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const completedSetsCount = setsData.filter(s => s.completed).length;
    const totalSets = setsData.length;
    const isExerciseCompleted = totalSets > 0 && completedSetsCount === totalSets;
    const progress = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0;
    const firstIncompleteSetIndex = setsData.findIndex(s => !s.completed);

    const restText = exercise.rest.replace(' seconds', 'ث');

    return (
        <div className={`bg-white rounded-lg shadow-md border ${isExerciseCompleted ? 'border-green-300' : 'border-slate-200/80'}`}>
            {/* Card Header */}
            <div className="p-3 flex justify-between items-center cursor-pointer gap-2" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <ExerciseImage
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        containerClassName="w-14 h-14 rounded-lg flex-shrink-0"
                        imageClassName="w-full h-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                             {isExerciseCompleted && (
                                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0" title="اكتمل التمرين">
                                   <CheckIcon />
                                </div>
                            )}
                            <h3 className={`font-bold truncate ${isExerciseCompleted ? 'text-green-600' : 'text-slate-800'}`}>{exercise.name}</h3>
                        </div>
                        {/* Visual Progress Indicator */}
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-full bg-slate-200 rounded-full h-1.5 flex-grow">
                                <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${isExerciseCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-slate-500 font-mono flex-shrink-0">{completedSetsCount}/{totalSets}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-slate-500 flex-shrink-0">
                    <ThreeDotsIcon />
                    {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </div>
            </div>

            {/* Card Body */}
            {isOpen && (
                <div className="px-3 pb-3 pt-2 border-t border-slate-200/80 animate-fade-in">
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <PencilIcon />
                        <input type="text" value={exerciseNotes} onChange={(e) => setExerciseNotes(e.target.value)} placeholder="إضافة ملاحظات للتمرين..." className="text-sm bg-transparent w-full focus:outline-none" />
                    </div>

                    {/* Sets Table */}
                    <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase px-2">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-3">السابق</div>
                            <div className="col-span-4 text-center">الوزن (كجم)</div>
                            <div className="col-span-3 text-center">التكرارات</div>
                            <div className="col-span-1 text-center">تم</div>
                        </div>

                        {setsData.map((set, index) => (
                             <div key={index} className={`grid grid-cols-12 gap-2 items-center p-1 rounded-md ${set.completed ? 'bg-green-50' : 'bg-white'}`}>
                                <div className="col-span-1 font-bold text-slate-700 text-center">{index + 1}</div>
                                <div className={`col-span-3 p-2 rounded text-sm text-slate-500 font-mono transition-colors ${index === firstIncompleteSetIndex ? 'bg-blue-100 text-blue-800' : ''}`}>
                                    <span>{previousSets[index] ? `${previousSets[index].weight} kg x ${previousSets[index].reps}` : '-'}</span>
                                </div>
                                <div className="col-span-4">
                                    <input type="text" pattern="[0-9.]*" value={set.weight} onChange={(e) => handleSetChange(index, 'weight', e.target.value)} className="w-full text-center font-semibold p-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <div className="col-span-3">
                                    <input type="text" pattern="[0-9]*" value={set.reps} onChange={(e) => handleSetChange(index, 'reps', e.target.value)} className="w-full text-center font-semibold p-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <button onClick={() => handleToggleSetComplete(index)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform active:scale-90 ${set.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400 bg-white hover:bg-slate-50'}`}>
                                       {set.completed && <CheckIcon />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                        {isResting ? (
                             <div className="flex-1 flex items-center justify-between gap-2 py-2 px-3 bg-blue-50 text-blue-800 font-semibold rounded-md text-sm transition-all">
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="h-4 w-4 text-blue-600" />
                                    <span className="font-mono text-lg">{formatTime(remainingTime)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handlePauseResumeTimer} className="p-1 rounded-full hover:bg-blue-200 text-blue-600">
                                        {isPaused ? <PlayIcon /> : <PauseIcon />}
                                    </button>
                                    <button onClick={handleSkipTimer} className="p-1 rounded-full hover:bg-blue-200 text-blue-600">
                                        <SkipIcon />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={startTimer} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md text-sm hover:bg-slate-200 transition-colors">
                                <ClockIcon />
                                راحة: {restText}
                            </button>
                        )}
                        <button onClick={onAddSet} className="flex-1 py-2 bg-slate-100 text-slate-700 font-semibold rounded-md text-sm hover:bg-slate-200 transition-colors">
                            + إضافة جولة
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackedExerciseCard;