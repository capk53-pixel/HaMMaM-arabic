import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CardioLogEntry, CardioExercise } from '../types';
import { PlusIcon, FootstepsIcon, GoogleFitIcon, SamsungHealthIcon, GoogleMapsIcon, PencilIcon } from './Icons';
import CardioLogModal from './CardioLogModal';
import LoadingSpinner from './LoadingSpinner';

interface DailyActivityLogProps {
    logs: CardioLogEntry[];
    cardioLibrary: CardioExercise[] | null;
    isLibraryLoading: boolean;
    onFetchCardioLibrary: () => void;
    onLogCardio: (log: Omit<CardioLogEntry, 'id' | 'date'>) => void;
    dailySteps: number;
    onUpdateSteps: (steps: number) => void;
}

const DailyActivityLog: React.FC<DailyActivityLogProps> = ({ logs, cardioLibrary, isLibraryLoading, onFetchCardioLibrary, onLogCardio, dailySteps, onUpdateSteps }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingSteps, setIsEditingSteps] = useState(false);
    const [editedSteps, setEditedSteps] = useState(dailySteps.toString());
    const stepsInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingSteps && stepsInputRef.current) {
            stepsInputRef.current.focus();
            stepsInputRef.current.select();
        }
    }, [isEditingSteps]);
    
    useEffect(() => {
        if (!isEditingSteps) {
            setEditedSteps(dailySteps.toString());
        }
    }, [dailySteps, isEditingSteps]);

    const handleStepsUpdate = () => {
        const newSteps = parseInt(editedSteps, 10);
        if (!isNaN(newSteps) && newSteps >= 0) {
            onUpdateSteps(newSteps);
        } else {
            setEditedSteps(dailySteps.toString());
        }
        setIsEditingSteps(false);
    };

    const handleStepsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleStepsUpdate();
        } else if (e.key === 'Escape') {
            setEditedSteps(dailySteps.toString());
            setIsEditingSteps(false);
        }
    };
    
    const today = new Date().toISOString().split('T')[0];
    const todaysLogs = logs.filter(log => log.date === today);

    const cumulativeStats = useMemo(() => {
        const stats: { [key: string]: { totalDuration: number, totalDistance: number, count: number } } = {};
        logs.forEach(log => {
            if (!stats[log.exerciseName]) {
                stats[log.exerciseName] = { totalDuration: 0, totalDistance: 0, count: 0 };
            }
            stats[log.exerciseName].totalDuration += log.durationMinutes;
            stats[log.exerciseName].totalDistance += log.distanceKm || 0;
            stats[log.exerciseName].count += 1;
        });
        return Object.entries(stats).sort((a, b) => b[1].totalDuration - a[1].totalDuration);
    }, [logs]);
    
    return (
        <div className="space-y-8" dir="rtl">
            <div className="text-center">
                 <h2 className="text-3xl font-bold text-slate-900">سجل النشاط اليومي</h2>
                 <p className="text-slate-500 mt-1">تتبع خطواتك وتمارين الكارديو وحافظ على صحة قلبك.</p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500 mb-1">الخطوات اليومية</p>
                     {isEditingSteps ? (
                         <input
                            ref={stepsInputRef}
                            type="number"
                            value={editedSteps}
                            onChange={(e) => setEditedSteps(e.target.value.replace(/[^0-9]/g, ''))}
                            onBlur={handleStepsUpdate}
                            onKeyDown={handleStepsKeyDown}
                            className="text-4xl font-extrabold text-slate-800 bg-white border border-slate-300 rounded-md w-48 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <div onClick={() => setIsEditingSteps(true)} className="flex items-center gap-2 cursor-pointer group">
                             <p className="text-4xl font-extrabold text-slate-800">{dailySteps.toLocaleString('ar-EG')}</p>
                             <PencilIcon className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    <p className="text-sm text-green-600 font-semibold mt-1">ممتاز! واصل التقدم.</p>
                </div>
                <FootstepsIcon className="h-16 w-16 text-blue-500" />
            </div>

            <div className="p-4 bg-white border-2 border-dashed border-blue-200 rounded-xl text-center">
                 <h3 className="text-xl font-bold text-slate-900 mb-3">هل قمت بنشاط اليوم؟</h3>
                 <button
                    onClick={() => {
                        onFetchCardioLibrary();
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                 >
                    <PlusIcon />
                    سجل نشاط كارديو
                 </button>
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">مزامنة الأنشطة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <GoogleFitIcon className="h-8 w-8" />
                            <span className="font-semibold text-slate-700">Google Fit</span>
                        </div>
                        <button className="text-sm font-semibold text-blue-600 hover:underline">ربط</button>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <SamsungHealthIcon className="h-8 w-8" />
                            <span className="font-semibold text-slate-700">Samsung Health</span>
                        </div>
                        <button className="text-sm font-semibold text-blue-600 hover:underline">ربط</button>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <GoogleMapsIcon className="h-8 w-8 text-green-600" />
                            <span className="font-semibold text-slate-700">Google Maps</span>
                        </div>
                        <button className="text-sm font-semibold text-blue-600 hover:underline">ربط</button>
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">قم بربط تطبيقاتك الصحية لمزامنة عدد الخطوات والأنشطة تلقائيًا.</p>
            </div>

             {/* Today's Logs */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">أنشطة اليوم المسجلة</h3>
                {todaysLogs.length > 0 ? (
                    <div className="space-y-2">
                        {todaysLogs.map(log => (
                            <div key={log.id} className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between items-center">
                                <span className="font-semibold">{log.exerciseName}</span>
                                <div className="text-sm text-slate-600 flex gap-4">
                                    <span>{log.durationMinutes} دقيقة</span>
                                    {log.distanceKm != null && <span>{log.distanceKm.toFixed(1)} كم</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-6 bg-white border border-slate-200 rounded-lg">
                        <p className="text-slate-500">لم يتم تسجيل أي نشاط كارديو اليوم.</p>
                    </div>
                )}
            </div>
            
            {/* Cumulative Stats */}
             <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">إحصائيات تراكمية</h3>
                 {cumulativeStats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cumulativeStats.map(([name, stats]) => (
                            <div key={name} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <h4 className="font-bold text-blue-600">{name}</h4>
                                <p className="text-sm text-slate-500">({stats.count} {stats.count > 1 ? 'جلسات' : 'جلسة'})</p>
                                <div className="mt-2 space-y-1 text-slate-700">
                                    <p>إجمالي الوقت: <span className="font-semibold">{stats.totalDuration} دقيقة</span></p>
                                    <p>إجمالي المسافة: <span className="font-semibold">{stats.totalDistance.toFixed(2)} كم</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-6 bg-white border border-slate-200 rounded-lg">
                        <p className="text-slate-500">لا توجد إحصائيات بعد. ابدأ بتسجيل أول نشاط لك!</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                isLibraryLoading ? <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><LoadingSpinner text="جاري تحميل مكتبة الكارديو..." /></div> :
                <CardioLogModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    cardioLibrary={cardioLibrary || []}
                    onLogCardio={onLogCardio}
                />
            )}
        </div>
    );
};

export default DailyActivityLog;