import React, { useState, useEffect, useRef } from 'react';
import { ReloadIcon } from './Icons';
import { useImageModal } from '../contexts/ImageModalContext';

// A more informative fallback component that shows an icon, the alt text, and a reload button.
const Fallback: React.FC<{ alt: string; onReload: () => void }> = ({ alt, onReload }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 relative group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-1/3 max-h-8 w-auto text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M10 21V3m4 18V3M4 12H2m20 0h-2M5 12h14a1 1 0 010 2H5a1 1 0 010-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h2v10H5zM17 7h2v10h-2z" />
        </svg>
        <p className="text-xs text-slate-500 leading-tight font-semibold">{alt}</p>
        <button
            onClick={(e) => {
                e.stopPropagation(); // Prevent card clicks if image is inside a button
                onReload();
            }}
            className="absolute bottom-1 right-1 p-1 rounded-full bg-slate-500/50 text-white hover:bg-slate-600/70 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Reload image"
        >
            <ReloadIcon className="h-4 w-4" />
        </button>
    </div>
);


interface ExerciseImageProps {
  src?: string;
  alt: string;
  // classes for the container div
  containerClassName: string;
  // classes for the img element
  imageClassName: string;
}

const ExerciseImage: React.FC<ExerciseImageProps> = ({ src, alt, containerClassName, imageClassName }) => {
  const { openImage } = useImageModal();
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHasError(!src);
    setIsLoaded(false);
    setRetryCount(0); // Reset retry count when src changes
  }, [src]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        rootMargin: '100px', // Preload images 100px before they enter the viewport
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  const handleReload = () => {
    setHasError(false);
    setIsLoaded(false);
    setRetryCount(prev => prev + 1);
  };
  
  const handleImageClick = () => {
      if (src && isLoaded && !hasError) {
          openImage(src);
      }
  };

  const commonContainerClasses = 'bg-slate-200 flex items-center justify-center overflow-hidden';
  const clickableClasses = src && isLoaded && !hasError ? 'cursor-pointer' : '';


  if (hasError) {
    return (
      <div className={`${commonContainerClasses} ${containerClassName}`}>
        <Fallback alt={alt} onReload={handleReload} />
      </div>
    );
  }
  
  // Append a retry parameter to the URL to bypass cache on failure
  const imageUrl = src ? `${src}${src.includes('?') ? '&' : '?'}retry=${retryCount}` : undefined;

  return (
    <div 
        ref={containerRef} 
        className={`${commonContainerClasses} ${containerClassName} ${clickableClasses}`}
        onClick={handleImageClick}
        role="button"
        aria-label={`View ${alt} in full screen`}
        tabIndex={clickableClasses ? 0 : -1}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleImageClick()}
    >
      {isInView && !isLoaded && (
        <div className="w-full h-full animate-pulse bg-slate-300" />
      )}
      <img
        src={isInView ? imageUrl : undefined}
        alt={alt}
        className={`${imageClassName} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{ transition: 'opacity 300ms ease-in-out' }}
        loading="lazy"
      />
    </div>
  );
};

export default ExerciseImage;