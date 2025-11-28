import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon, CameraIcon, ReloadIcon, CheckIcon } from './Icons';

interface FoodCameraProps {
    onCapture: (base64Image: string) => void;
    onClose: () => void;
}

const FoodCamera: React.FC<FoodCameraProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isPreviewPaused, setIsPreviewPaused] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const startCamera = useCallback(async () => {
        setError(null);
        setIsVideoReady(false);
        
        // إعدادات محسنة للثبات والسلاسة: دقة عالية + معدل إطارات مستقر
        const constraints: MediaStreamConstraints = {
            audio: false,
            video: {
                facingMode: 'environment',
                // نطلب دقة عالية لتحسين عمل التركيز التلقائي (Autofocus)
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                // نطلب معدل إطارات سلس
                frameRate: { ideal: 30, max: 60 }
            }
        };

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.warn("Could not get ideal camera constraints, trying fallback.", err);
            try {
                // محاولة ثانية بإعدادات أبسط في حال فشل الإعدادات العالية
                const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                setStream(fallbackStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = fallbackStream;
                }
            } catch (finalErr) {
                console.error("Camera access denied:", finalErr);
                setError("لم نتمكن من الوصول إلى الكاميرا. يرجى تفعيل الإذن من إعدادات المتصفح والتأكد من وجود كاميرا متاحة.");
            }
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);
    
    const handleVideoLoaded = () => {
        setIsVideoReady(true);
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }
    };

    const handleInitialCapture = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPreviewPaused(true);
        }
    };
    
    const handleRetake = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPreviewPaused(false);
        }
    };
    
    const handleConfirmCapture = () => {
        if (videoRef.current && canvasRef.current && !isCapturing) {
            setIsCapturing(true);

            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // استخدام نفس أبعاد الفيديو الأصلية للحفاظ على الجودة
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            if(context) {
                // رسم الفيديو كما هو
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                
                // ضغط الصورة كـ JPEG بجودة عالية
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                const base64Data = dataUrl.split(',')[1];
                
                onCapture(base64Data);
                onClose();
            } else {
                setIsCapturing(false);
                handleRetake();
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="w-full h-full flex flex-col overflow-hidden relative bg-black" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header Actions */}
                <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                    <button onClick={onClose} className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors">
                        <CloseIcon className="h-8 w-8"/>
                    </button>
                    <div className="text-white text-sm font-medium bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
                        التقط صورة للطعام
                    </div>
                </div>

                {/* Main Camera Area */}
                <div className="flex-grow relative flex items-center justify-center overflow-hidden">
                    {error ? (
                        <div className="p-6 text-center text-white bg-slate-800 rounded-lg max-w-xs mx-auto">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Loading Indicator */}
                            {!isVideoReady && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                            
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted
                                onLoadedMetadata={handleVideoLoaded}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
                            ></video>

                            {/* Overlay Guide (Always visible to help framing) */}
                            {!isPreviewPaused && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="w-[70%] aspect-square border-2 border-white/50 border-dashed rounded-xl shadow-[0_0_0_1000px_rgba(0,0,0,0.3)]"></div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Controls Area */}
                <div className="bg-black/80 backdrop-blur-lg p-6 pb-10 flex-shrink-0 z-20">
                    <div className="flex items-center justify-around max-w-md mx-auto">
                        {isPreviewPaused ? (
                            <>
                                <button 
                                    onClick={handleRetake} 
                                    className="flex flex-col items-center gap-2 text-slate-300 font-medium transition-transform active:scale-95"
                                    disabled={isCapturing}
                                >
                                    <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                                       <ReloadIcon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs">إعادة</span>
                                </button>

                                <button 
                                    onClick={handleConfirmCapture} 
                                    disabled={isCapturing}
                                    className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-500 border-4 border-white/20 shadow-lg shadow-blue-900/50 transition-transform active:scale-95 flex items-center justify-center"
                                >
                                    {isCapturing ? (
                                        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                                    ) : (
                                        <CheckIcon className="h-10 w-10 text-white" />
                                    )}
                                </button>
                                
                                <div className="w-14 opacity-0"></div> {/* Spacer for alignment */}
                            </>
                        ) : (
                            <button 
                                onClick={handleInitialCapture} 
                                disabled={!isVideoReady} 
                                className={`w-20 h-20 rounded-full border-[6px] transition-all duration-200 active:scale-95 flex items-center justify-center ${
                                    isVideoReady 
                                    ? 'bg-white border-slate-300 ring-4 ring-white/20 cursor-pointer' 
                                    : 'bg-slate-500 border-slate-600 opacity-50 cursor-not-allowed'
                                }`}
                            >
                                <div className="w-16 h-16 bg-white rounded-full border-2 border-black/10"></div>
                            </button>
                        )}
                    </div>
                </div>
                
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default FoodCamera;