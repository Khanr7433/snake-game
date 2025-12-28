import React from 'react';

export const UIOverlay = ({ gameOver, isPaused, isGameStarted, onRestart, onResume, score }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-center items-center p-6">

      {/* Center Messages */}
      {(!isGameStarted || gameOver || isPaused) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm pointer-events-auto">
             <div className="bg-black/80 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl text-center transform transition-all scale-100">
                <h2 className={`text-5xl font-black mb-4 ${gameOver ? 'text-red-500' : 'text-neon-green'}`}>
                    {!isGameStarted ? 'SNAKE' : gameOver ? 'GAME OVER' : 'PAUSED'}
                </h2>
                
                {gameOver && (
                    <div className="mb-8">
                        <p className="text-gray-400 mb-2">Final Score</p>
                        <p className="text-6xl font-mono font-bold text-white">{score}</p>
                    </div>
                )}
                
                <button 
                    onClick={!isGameStarted ? onRestart : gameOver ? onRestart : onResume}
                    className="w-full py-4 text-xl font-bold text-black uppercase tracking-wider rounded-lg transition-transform hover:scale-105 active:scale-95 bg-white hover:bg-gray-100"
                >
                    {!isGameStarted ? 'Start Game' : gameOver ? 'Play Again' : 'Resume'}
                </button>
                
                {!isGameStarted && (
                     <p className="mt-4 text-gray-500 text-sm">Press <span className="font-bold text-white">Enter</span> to Start</p>
                )}
             </div>
        </div>
      )}
      
      {/* Footer Controls Hint - Removed */}
    </div>
  );
};
