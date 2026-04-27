import React from 'react';

const LoadingFallback = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#030303] z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500 animate-pulse">
            Loading Gallery
        </span>
      </div>
    </div>
  );
};

export default LoadingFallback;
