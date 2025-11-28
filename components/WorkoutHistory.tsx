import React, { useState } from 'react';
import { WorkoutSession } from '../types';

interface WorkoutHistoryProps {
    sessions: WorkoutSession[];
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ sessions }) => {
    const [openSessionId, setOpenSessionId] = useState<string | null>(null);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} دقيقة ${secs} ثانية`;
    };

    const toggleSession = (id: string) => {
        setOpenSessionId(openSessionId === id ? null : id);
    };

    if (sessions.length === 0) {
        return (
            <div className="text-center p-10 bg-white border border-slate-200 rounded-lg">
                <h3 className="text-2xl font-bold text-slate-800">لا يوجد سجلات بعد</h3>
                <p className="text-slate-500 mt-2">ابدأ تمريناً جديداً لتسجيل تقدمك هنا.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4" dir="rtl">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-900">سجل التمارين</h2>
            {sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                        onClick={() => toggleSession(session.id)}
                        className="w-full p-4 text-right flex justify-between items-center transition-colors hover:bg-slate-50"
                    >
                        <div>
                            <p className="font-bold text-lg text-blue-600">{session.dayName}</p>
                            <p className="text-sm text-slate-500">{session.date}</p>
                        </div>
                        <div className="text-left">
                             <p className="text-sm text-slate-500">{formatDuration(session.duration)}</p>
                             <svg
                                className={`w-6 h-6 text-slate-500 transition-transform ${openSessionId === session.id ? 'transform rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>
                    {openSessionId === session.id && (
                        <div className="p-4 bg-white border-t border-slate-200 animate-fade-in">
                            {session.exercises.length > 0 ? (
                                <ul className="space-y-3">
                                    {session.exercises.map((exercise, exIndex) => (
                                        <li key={exIndex}>
                                            <p className="font-semibold text-slate-800">{exercise.name}</p>
                                            <div className="ps-4 mt-1 space-y-1 text-sm text-slate-600">
                                                {exercise.sets.map((set, setIndex) => (
                                                    <p key={setIndex}>
                                                        <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">الجولة {setIndex + 1}:</span> {set.reps} تكرار @ {set.weight} كجم
                                                    </p>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-500">لم يتم تسجيل أي تمرين في هذه الجلسة.</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default WorkoutHistory;