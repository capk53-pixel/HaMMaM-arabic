import React, { useState, useEffect } from 'react';

interface YouTubePlayerProps {
    url: string;
}

const getYouTubeID = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ url }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const videoId = getYouTubeID(url);

    if (!isOnline) {
        return (
            <div className="aspect-video bg-slate-200 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364m12.728 0L5.636 5.636" />
                </svg>
                <p className="font-semibold text-slate-700">أنت غير متصل بالإنترنت</p>
                <p className="text-sm text-slate-500">لا يمكن تشغيل الفيديو. يرجى التحقق من اتصالك بالشبكة.</p>
            </div>
        );
    }

    if (!videoId) {
        return <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center"><p className="text-red-500">رابط يوتيوب غير صالح.</p></div>;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="aspect-video w-full">
            <iframe
                className="w-full h-full rounded-lg shadow-md"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default YouTubePlayer;