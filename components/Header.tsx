import React from 'react';
import { LogoutIcon } from './Icons';
import Logo from './Logo';

interface HeaderProps {
    user: string | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm w-full sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-2xl font-bold text-slate-800 tracking-tight">HaMMaM Fit Hup</span>
        </div>
        {user && (
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                    <span className="font-semibold text-slate-700 text-sm">{user}</span>
                     <div className="relative flex-shrink-0" title="Online">
                        <img
                            className="w-9 h-9 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=40&h=40&fit=crop&q=80"
                            alt="Profile picture"
                        />
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                        <span className="sr-only">Online</span>
                    </div>
                </div>
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 font-semibold transition-colors"
                >
                    <LogoutIcon />
                    <span className="hidden sm:block">تسجيل الخروج</span>
                </button>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;