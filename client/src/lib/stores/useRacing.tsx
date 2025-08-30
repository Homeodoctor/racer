import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "menu" | "playing" | "gameOver";

interface RacingState {
  gameState: GameState;
  score: number;
  highScore: number;
  lives: number;
  level: number;
  
  // Actions
  startGame: () => void;
  gameOver: () => void;
  restartGame: () => void;
  updateScore: (newScore: number) => void;
  updateLives: (newLives: number) => void;
}

export const useRacing = create<RacingState>()(
  subscribeWithSelector((set, get) => ({
    gameState: "menu",
    score: 0,
    highScore: parseInt(localStorage.getItem('racing-high-score') || '0'),
    lives: 3,
    level: 1,
    
    startGame: () => {
      set({ 
        gameState: "playing", 
        score: 0, 
        lives: 3, 
        level: 1 
      });
    },
    
    gameOver: () => {
      const currentScore = get().score;
      const currentHighScore = get().highScore;
      
      if (currentScore > currentHighScore) {
        localStorage.setItem('racing-high-score', currentScore.toString());
        set({ highScore: currentScore });
      }
      
      set({ gameState: "gameOver" });
    },
    
    restartGame: () => {
      set({ 
        gameState: "playing", 
        score: 0, 
        lives: 3, 
        level: 1 
      });
    },
    
    updateScore: (newScore: number) => {
      set({ score: newScore });
    },
    
    updateLives: (newLives: number) => {
      set({ lives: Math.max(0, newLives) });
    }
  }))
);
