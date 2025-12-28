import React, { useEffect } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { GameBoard } from './components/GameBoard';
import { UIOverlay } from './components/UIOverlay';
import { GameHeader } from './components/GameHeader';

function App() {
  const {
    snake,
    food,
    score,
    highScore,
    elapsedTime,
    gameOver,
    isPaused,
    isGameStarted,
    setIsPaused,
    resetGame,
    startGame,
    changeDirection,
    GRID_SIZE
  } = useSnakeGame();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
        // Prevent default scrolling for arrows and space
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                changeDirection({ x: 0, y: -1 });
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                changeDirection({ x: 0, y: 1 });
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                changeDirection({ x: -1, y: 0 });
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                changeDirection({ x: 1, y: 0 });
                break;
            case ' ':
                if (!gameOver && isGameStarted) {
                    setIsPaused(prev => !prev);
                }
                break;
            case 'Enter':
                if (!isGameStarted) {
                    startGame();
                } else if (gameOver) {
                    resetGame();
                }
                break;
            default:
                break;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, setIsPaused, gameOver, resetGame, isGameStarted, startGame]);

  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black overflow-hidden relative selection:bg-neon-green selection:text-black gap-4">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none sticky">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full gap-5">
        
        {/* Header Stats */}
        <div className="w-full max-w-[560px]">
            <GameHeader 
                score={score} 
                highScore={highScore} 
                elapsedTime={elapsedTime} 
            />
        </div>

        {/* Game Area */}
        <div className="relative shadow-2xl rounded-xl border-4 border-gray-800">
            <GameBoard 
                snake={snake} 
                food={food} 
                gridSize={GRID_SIZE} 
                width={560} 
                height={560} 
            />
            <UIOverlay 
                score={score}
                gameOver={gameOver}
                isPaused={isPaused}
                isGameStarted={isGameStarted}
                onRestart={!isGameStarted ? startGame : resetGame}
                onResume={() => setIsPaused(false)}
            />
        </div>
      </div>
    </div>
  );
}

export default App;
