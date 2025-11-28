import React, { useState, useEffect } from 'react';
import { GoogleIcon, FacebookIcon, LoginIcon } from './Icons';
import Logo from './Logo';

interface LoginProps {
    onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const lastUser = localStorage.getItem('lastLoggedInUser');
        if (lastUser) {
            setUsername(lastUser);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fade-in" dir="rtl">
            <div className="text-center">
                 <div className="flex justify-center items-center gap-3 mb-4">
                    <Logo />
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">HaMMaM Fit Hup</span>
                 </div>
                <p className="mt-2 text-slate-500">سجل الدخول لحفظ تقدمك</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-slate-700">اسم المستخدم</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="e.g., Hero123"
                        required
                    />
                </div>
                <button type="submit" className="w-full flex justify-center items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-transform transform hover:scale-105 shadow-lg">
                    <LoginIcon />
                    دخول / تسجيل
                </button>
            </form>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">أو سجل الدخول عبر</span>
                </div>
            </div>

            <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                    <GoogleIcon />
                    <span className="font-semibold">Google</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                    <FacebookIcon />
                    <span className="font-semibold">Facebook</span>
                </button>
            </div>
        </div>
    );
};

export default Login;