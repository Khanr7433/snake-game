import React from 'react';

export const GameHeader = ({ score, highScore, elapsedTime }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex gap-4 w-full justify-between items-center bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-xl">
        <div className="flex gap-8">
            <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Score</p>
                <p className="text-2xl font-bold text-white font-mono">{score}</p>
            </div>
            <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Best</p>
                <p className="text-2xl font-bold text-neon-purple font-mono">{highScore}</p>
            </div>
        </div>
        
        <div className="text-right">
             <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-0.5">Time</p>
             <p className="text-2xl font-bold text-neon-green font-mono tracking-widest">
                {formatTime(elapsedTime)}
             </p>
        </div>
    </div>
  );
};
