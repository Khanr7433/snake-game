import React, { useRef, useEffect } from 'react';

export const GameBoard = ({ snake, food, gridSize, width = 600, height = 600 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dimensions
    const cellSize = width / gridSize;
    
    // Draw Grid (Optional, subtle)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(width, i * cellSize);
        ctx.stroke();
    }

    // Draw Food
    const isBigFood = food.type === 'big';
    
    // Glow effect
    ctx.shadowBlur = isBigFood ? 40 : 15;
    ctx.shadowColor = isBigFood ? '#fbbf24' : '#ff00ff'; // Gold for Big, Magenta for Normal
    ctx.fillStyle = isBigFood ? '#fbbf24' : '#ff00ff';
    
    let foodX, foodY, radius;
    
    if (isBigFood) {
        // Center of 2x2 grid
        foodX = (food.x * cellSize) + cellSize; 
        foodY = (food.y * cellSize) + cellSize;
        radius = cellSize - 4; // Almost full 2x2 coverage radius
    } else {
        // Center of 1x1 grid
        foodX = food.x * cellSize + cellSize / 2;
        foodY = food.y * cellSize + cellSize / 2;
        radius = cellSize / 2 - 2;
    }
    
    ctx.beginPath();
    ctx.arc(foodX, foodY, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Reset shadow for snake
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff00'; // Neon Green for snake head
    
    // Draw Snake
    snake.forEach((segment, index) => {
        const x = segment.x * cellSize;
        const y = segment.y * cellSize;
        
        // Head is Neon Green, Body is slightly darker or different tone
        if (index === 0) {
            ctx.fillStyle = '#00ff00';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ff00';
        } else {
            ctx.fillStyle = '#00cc00';
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'transparent';
        }
        
        // Round Rect for segments
        // Using simple rect for performance, but we can make it prettier
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, 4);
        ctx.fill();
    });
    
    // Reset context
    ctx.shadowBlur = 0;
    
  }, [snake, food, gridSize, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-white/20 rounded-lg shadow-2xl shadow-blue-500/20 bg-black/50 backdrop-blur-sm"
    />
  );
};
