import { useEffect, useRef, useCallback } from "react";
import { useRacing } from "../lib/stores/useRacing";
import { useAudio } from "../lib/stores/useAudio";
import { GameLogic, Car, Collectible } from "../lib/gameLogic";

interface GameCanvasProps {
  selectedCar: string;
}

export default function GameCanvas({ selectedCar }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLogicRef = useRef<GameLogic | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  const { 
    gameState, 
    updateScore, 
    gameOver,
    updateLives,
    lives
  } = useRacing();
  
  const { playHit, playSuccess, isMuted } = useAudio();

  const gameLoop = useCallback(() => {
    if (!canvasRef.current || !gameLogicRef.current || gameState !== 'playing') {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const game = gameLogicRef.current;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road
    drawRoad(ctx, canvas, game.roadOffset);

    // Update game logic
    game.update();

    // Draw player car
    drawCar(ctx, game.player, '#00ff00', selectedCar);

    // Draw enemy cars
    game.enemies.forEach(enemy => {
      drawCar(ctx, enemy, '#ff0000', '🚗');
    });

    // Draw collectibles
    game.collectibles.forEach(collectible => {
      drawCollectible(ctx, collectible);
    });

    // Check collisions
    const collisions = game.checkCollisions();
    
    // Handle enemy collisions
    if (collisions.enemyHit && lives > 1) {
      updateLives(lives - 1);
      if (!isMuted) playHit();
    } else if (collisions.enemyHit && lives <= 1) {
      gameOver();
      if (!isMuted) playHit();
      return;
    }

    // Handle collectible collisions
    if (collisions.collectibleCollected) {
      if (!isMuted) playSuccess();
    }

    // Update score
    updateScore(game.score);

    // Continue game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updateScore, gameOver, playHit, playSuccess, isMuted, lives, updateLives]);

  // Initialize game
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game logic
    gameLogicRef.current = new GameLogic(canvas.width, canvas.height);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoop();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Reset game logic when restarting
  useEffect(() => {
    if (gameState === 'menu' && canvasRef.current) {
      gameLogicRef.current = new GameLogic(canvasRef.current.width, canvasRef.current.height);
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameLogicRef.current || gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          gameLogicRef.current.player.moveLeft = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          gameLogicRef.current.player.moveRight = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!gameLogicRef.current) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          gameLogicRef.current.player.moveLeft = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          gameLogicRef.current.player.moveRight = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}

// Helper drawing functions
function drawRoad(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, roadOffset: number) {
  const laneWidth = Math.min(canvas.width * 0.8, 400);
  const roadStartX = (canvas.width - laneWidth) / 2;
  
  // Draw road background
  ctx.fillStyle = '#333333';
  ctx.fillRect(roadStartX, 0, laneWidth, canvas.height);
  
  // Draw lane dividers
  ctx.strokeStyle = '#ffffff';
  ctx.setLineDash([20, 20]);
  ctx.lineWidth = 3;
  
  const laneCount = 3;
  for (let i = 1; i < laneCount; i++) {
    const x = roadStartX + (laneWidth * i / laneCount);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Draw road edges
  ctx.setLineDash([]);
  ctx.strokeStyle = '#ffff00';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(roadStartX, 0);
  ctx.lineTo(roadStartX, canvas.height);
  ctx.moveTo(roadStartX + laneWidth, 0);
  ctx.lineTo(roadStartX + laneWidth, canvas.height);
  ctx.stroke();
}

function drawCar(ctx: CanvasRenderingContext2D, car: Car, color: string, emoji: string) {
  // Draw car body
  ctx.fillStyle = color;
  ctx.fillRect(car.x, car.y, car.width, car.height);
  
  // Draw car emoji/icon
  ctx.font = `${car.width * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, car.x + car.width / 2, car.y + car.height / 2);
  
  // Draw car outline
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(car.x, car.y, car.width, car.height);
}

function drawCollectible(ctx: CanvasRenderingContext2D, collectible: Collectible) {
  // Draw coin background
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, collectible.width / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw coin emoji
  ctx.font = `${collectible.width * 0.8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000000';
  ctx.fillText('💰', collectible.x + collectible.width / 2, collectible.y + collectible.height / 2);
}
