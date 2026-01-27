import React from 'react';

const ProgressBar = ({ percentage = 0 }) => {
  const cleanPercentage = Math.min(Math.max(percentage, 0), 100);
  const isMastered = cleanPercentage === 100;

  return (
<div className="flex flex-col w-32 items-end gap-1 hover:scale-105 transition-transform cursor-help">
<div className="flex justify-between w-full px-1">
        <span className={`text-[9px] font-black uppercase tracking-widest ${isMastered ? 'text-emerald-500 animate-pulse' : 'text-blue-500'}`}>
          {isMastered ? ' Mastered' : 'Learning'}
        </span>
        <span className="text-[10px] font-bold font-mono opacity-60">{cleanPercentage}%</span>
      </div>
      
      <div className="relative w-full h-2 bg-gray-200/50 rounded-full overflow-hidden shadow-inner border border-black/5">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
            isMastered 
            ? 'bg-gradient-to-r from-emerald-400 to-green-600' 
            : 'bg-gradient-to-r from-blue-400 to-indigo-600'
          }`}
          style={{ width: `${cleanPercentage}%` }}
        >
          {/* Moving light shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;