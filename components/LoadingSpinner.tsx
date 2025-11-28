import React from 'react';

interface LoadingSpinnerProps {
    text?: string;
    subtext?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text, subtext }) => {
  const defaultText = "جاري إنشاء خطتك المخصصة...";
  const defaultSubtext = "يقوم مدربك HaMMaM بتحليل بياناتك لوضع أفضل خطة تدريبية لك.";

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{text || defaultText}</h2>
      <p className="text-slate-600">
        {subtext || defaultSubtext}
      </p>
    </div>
  );
};

export default LoadingSpinner;