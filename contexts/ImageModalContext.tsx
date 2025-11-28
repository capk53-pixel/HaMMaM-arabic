import React, { createContext, useState, useContext, ReactNode } from 'react';
import FullScreenImageViewer from '../components/FullScreenImageViewer';

interface ImageModalContextType {
    openImage: (url: string) => void;
}

const ImageModalContext = createContext<ImageModalContextType | undefined>(undefined);

export const useImageModal = () => {
    const context = useContext(ImageModalContext);
    if (!context) {
        throw new Error('useImageModal must be used within an ImageModalProvider');
    }
    return context;
};

interface ImageModalProviderProps {
    children: ReactNode;
}

export const ImageModalProvider: React.FC<ImageModalProviderProps> = ({ children }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const openImage = (url: string) => {
        setImageUrl(url);
    };

    const closeImage = () => {
        setImageUrl(null);
    };

    return (
        <ImageModalContext.Provider value={{ openImage }}>
            {children}
            {imageUrl && <FullScreenImageViewer src={imageUrl} onClose={closeImage} />}
        </ImageModalContext.Provider>
    );
};
