import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MoveLeft, HelpCircle } from 'lucide-react';

const NotFound = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center relative overflow-hidden px-6">
            {/* Background Aesthetic Elements */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif font-black tracking-tighter leading-none italic">
                    404
                </div>
            </div>

            {/* Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
                <div className="mb-8 p-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm animate-pulse">
                    <HelpCircle size={32} strokeWidth={1} className="text-gray-400" />
                </div>

                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 font-medium italic">
                    {t('notFound', 'errorCode')}
                </span>

                <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-tight">
                    {t('notFound', 'title')}
                </h1>

                <p className="text-gray-400 text-lg md:text-xl font-light mb-12 leading-relaxed max-w-lg">
                    {t('notFound', 'subtitle')}
                </p>

                <Link
                    to="/"
                    className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full transition-all duration-500 hover:pr-10 hover:bg-[#f0f0f0]"
                >
                    <MoveLeft size={20} className="transition-transform duration-500 group-hover:-translate-x-1" />
                    <span className="font-medium tracking-wide uppercase text-sm">
                        {t('notFound', 'backHome')}
                    </span>
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:animate-ping pointer-events-none"></div>
                </Link>
            </div>

            {/* Corner Decorative Text */}
            <div className="absolute bottom-10 left-10 hidden md:block">
                <div className="text-[10px] uppercase tracking-[0.5em] text-gray-600 vertical-text-sideways">
                    Arts of Carmen © 2026
                </div>
            </div>
            
            <div className="absolute top-10 right-10 hidden md:block">
                <div className="text-[10px] uppercase tracking-[0.5em] text-gray-600">
                    Studio Carmen
                </div>
            </div>
        </div>
    );
};

export default NotFound;
