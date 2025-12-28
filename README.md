# Snake Arcade

A neon-styled Snake game built with React and Vite. Glide around a 20x20 grid, chase glowing food, and watch the speed ramp up as you grow. High scores persist locally so you can keep improving your run.

## Features
- Smooth canvas rendering with subtle grid lines and neon glow.
- Big food spawns every 5th item (2x2 size, +50 points); normal food gives +10 points.
- Speed increases after each bite down to a fast minimum for late-game tension.
- Pause/resume and start/restart overlays with both keyboard and on-screen buttons.
- Persistent high score stored in localStorage plus a session timer.
- Modern stack: React 19, Vite, Tailwind CSS v4.

## Controls
- Move: Arrow keys or WASD.
- Start / Play again: Enter (or the on-screen button).
- Pause / Resume: Space (or the on-screen button when paused).

## How to Play
1) Press Enter or click Start Game.
2) Eat food to grow and score points. Every fifth piece is a bigger 2x2 target worth more points.
3) Avoid hitting walls or yourself; the run ends on collision.
4) Press Space to pause; press again or use the button to resume.

## Getting Started
Prerequisite: Node.js 18+ recommended.

Install dependencies:
```bash
npm install
```

Run the dev server:
```bash
npm run dev
# then open the printed localhost URL
```

Build for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

Lint the project:
```bash
npm run lint
```

## Project Notes
- Core game loop, speed, scoring, and food logic live in src/hooks/useSnakeGame.js.
- Rendering is handled by the canvas board in src/components/GameBoard.jsx with overlays in src/components/UIOverlay.jsx.
- Styling uses Tailwind v4 via the @tailwindcss/vite plugin.

## Customization Ideas
- Tweak GRID_SIZE, INITIAL_SPEED, or scoring values in the hook to change difficulty.
- Swap colors or glow effects in the board component for a different vibe.
- Add sound effects or a leaderboard backed by an API.
