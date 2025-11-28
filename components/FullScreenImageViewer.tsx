import React from 'react';
import { CloseIcon } from './Icons';

interface FullScreenImageViewerProps {
    src: string;
    onClose: () => void;
}

const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = ({ src, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-label="Full screen image viewer"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-white bg-black/30 hover:bg-black/50 transition-colors z-10"
                aria-label="Close full screen image"
            >
                <CloseIcon className="h-8 w-8" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <img
                    src={src}
                    alt="Full screen view"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
            </div>
        </div>
    );
};

export default FullScreenImageViewer;