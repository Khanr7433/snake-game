import { useState, useEffect, useCallback, useRef } from "react";

// Game Constants
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 50;
const SPEED_INCREMENT = 2;

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving Up

export const useSnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5, type: "normal" });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [itemsEaten, setItemsEaten] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("snakeHighScore") || "0", 10)
  );
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Refs for mutable state in the game loop to avoid dependency staleness
  const directionRef = useRef(INITIAL_DIRECTION);
  const snakeRef = useRef(INITIAL_SNAKE);
  const foodRef = useRef({ x: 5, y: 5, type: "normal" });
  const gameLoopRef = useRef(null);
  const lastRenderTimeRef = useRef(0);
  const gameOverRef = useRef(false);
  const isPausedRef = useRef(false);
  const isGameStartedRef = useRef(false);
  const itemsEatenRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Sync refs with state when resetting or logic updates
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (!isPaused) {
      lastRenderTimeRef.current = performance.now();
      requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, [isPaused]);

  // Initialize Game
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setElapsedTime(0);
    setItemsEaten(0);
    itemsEatenRef.current = 0;
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    gameOverRef.current = false;
    setIsPaused(false);
    isPausedRef.current = false;
    spawnFood(INITIAL_SNAKE);

    // Restart loop if game is already started (e.g. Play Again)
    if (isGameStartedRef.current) {
      lastRenderTimeRef.current = performance.now();
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, []);

  const spawnFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      const isBig = (itemsEatenRef.current + 1) % 5 === 0;
      // If big, max coordinate is GRID_SIZE - 2 to fit 2x2
      const maxCoord = isBig ? GRID_SIZE - 1 : GRID_SIZE;

      newFood = {
        x: Math.floor(Math.random() * maxCoord),
        y: Math.floor(Math.random() * maxCoord),
        type: isBig ? "big" : "normal",
      };

      // Ensure food doesn't spawn on snake
      // For big food, check all 4 cells
      let onSnake = false;
      const cellsToCheck = [];
      cellsToCheck.push({ x: newFood.x, y: newFood.y });
      if (newFood.type === "big") {
        cellsToCheck.push({ x: newFood.x + 1, y: newFood.y });
        cellsToCheck.push({ x: newFood.x, y: newFood.y + 1 });
        cellsToCheck.push({ x: newFood.x + 1, y: newFood.y + 1 });
      }

      for (const cell of cellsToCheck) {
        if (currentSnake.some((seg) => seg.x === cell.x && seg.y === cell.y)) {
          onSnake = true;
          break;
        }
      }

      if (!onSnake) break;
    }
    setFood(newFood);
    foodRef.current = newFood;
  }, []);

  const changeDirection = useCallback((newDir) => {
    // Prevent reversing direction
    if (
      (newDir.x === 0 && directionRef.current.x === 0) || // Vertical opposite
      (newDir.y === 0 && directionRef.current.y === 0) // Horizontal opposite
    ) {
      return;
    }
    // Also prevent rapid double turns causing self-collision
    // ideally we queue moves, but for now just update ref immediately
    // For smoother experience we might queue specific turns per frame
    directionRef.current = newDir;
    setDirection(newDir);
  }, []);

  const gameLoop = (timestamp) => {
    if (gameOverRef.current || isPausedRef.current || !isGameStartedRef.current)
      return;

    if (timestamp - lastRenderTimeRef.current < speedRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    lastRenderTimeRef.current = timestamp;

    const currentHead = snakeRef.current[0];
    const newHead = {
      x: currentHead.x + directionRef.current.x,
      y: currentHead.y + directionRef.current.y,
    };

    // Collision Detection
    // 1. Walls
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      setGameOver(true);
      gameOverRef.current = true;
      return;
    }

    // 2. Self
    if (
      snakeRef.current.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
    ) {
      setGameOver(true);
      gameOverRef.current = true;
      return;
    }

    // Move Snake
    const newSnake = [newHead, ...snakeRef.current];

    // Check Food Collision
    let eaten = false;
    const foodObj = foodRef.current;

    if (foodObj.type === "normal") {
      if (newHead.x === foodObj.x && newHead.y === foodObj.y) {
        eaten = true;
      }
    } else {
      // Big food occupies (x,y), (x+1,y), (x,y+1), (x+1,y+1)
      // Check if head hits any of these
      if (
        (newHead.x === foodObj.x || newHead.x === foodObj.x + 1) &&
        (newHead.y === foodObj.y || newHead.y === foodObj.y + 1)
      ) {
        eaten = true;
      }
    }

    if (eaten) {
      // Ate food
      const points = foodObj.type === "big" ? 50 : 10;

      setItemsEaten((prev) => {
        const newVal = prev + 1;
        itemsEatenRef.current = newVal;
        return newVal;
      });

      setScore((prev) => {
        const newScore = prev + points;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("snakeHighScore", newScore);
        }
        return newScore;
      });
      setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      spawnFood(newSnake);
      // Don't pop - snake grows
    } else {
      newSnake.pop(); // Remove tail
    }

    snakeRef.current = newSnake;
    setSnake(newSnake);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, []);

  useEffect(() => {
    isGameStartedRef.current = isGameStarted;
    if (isGameStarted) {
      lastRenderTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isGameStarted]);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (isGameStarted && !isPaused && !gameOver) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameStarted, isPaused, gameOver]);

  const startGame = useCallback(() => {
    setIsGameStarted(true);
    resetGame();
  }, [resetGame]);

  return {
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
    GRID_SIZE,
  };
};
