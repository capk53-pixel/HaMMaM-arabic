import React from 'react';
import { Exercise } from '../types';
import ExerciseImage from './ExerciseImage';

interface ExerciseCardProps {
  exercise: Exercise;
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-blue-600">{value}</p>
    </div>
);

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const restText = exercise.rest.replace(' seconds', 's');
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between h-full transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
      <div>
        <ExerciseImage
          src={exercise.imageUrl}
          alt={exercise.name}
          containerClassName="mb-3 rounded-md aspect-video"
          imageClassName="w-full h-full object-cover"
        />
        <h4 className="text-lg font-bold text-slate-800 mb-3 text-center">{exercise.name}</h4>
        <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-200 py-3 mb-3">
          <Stat label="الجولات" value={exercise.sets} />
          <Stat label="التكرارات" value={exercise.reps} />
          <Stat label="الراحة" value={restText} />
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-600 leading-relaxed">
          <span className="font-semibold text-blue-600">ملاحظات:</span> {exercise.notes}
        </p>
      </div>
    </div>
  );
};

export default ExerciseCard;