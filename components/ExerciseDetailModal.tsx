import React from 'react';
import { ExerciseInfo } from '../types';
import { CloseIcon } from './Icons';
import ExerciseImage from './ExerciseImage';
import YouTubePlayer from './YouTubePlayer';

interface ExerciseDetailModalProps {
    exercise: ExerciseInfo;
    onClose: () => void;
}

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" 
                onClick={e => e.stopPropagation()}
                dir="rtl"
            >
                <header className="p-4 flex justify-between items-center border-b border-slate-200 bg-white">
                    <h2 className="text-xl font-bold text-slate-800">{exercise.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800">
                        <CloseIcon />
                    </button>
                </header>
                
                <main className="flex-grow overflow-y-auto p-4 space-y-4">
                    <ExerciseImage 
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        containerClassName="w-full aspect-video rounded-lg"
                        imageClassName="w-full h-full object-cover"
                    />
                    
                    <div>
                        <h3 className="text-lg font-bold text-blue-600 mb-2">فيديو توضيحي</h3>
                        {exercise.youtubeUrl ? (
                            <YouTubePlayer url={exercise.youtubeUrl} />
                        ) : (
                            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                                <p className="text-slate-500">لا يوجد فيديو متاح لهذا التمرين.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ExerciseDetailModal;