import { useEffect, useRef, useState } from "react";
import { useRacing } from "../lib/stores/useRacing";
import { useAudio } from "../lib/stores/useAudio";
import GameCanvas from "./GameCanvas";
import { Button } from "./ui/button";

export default function RacingGame() {
  const { 
    gameState, 
    score, 
    highScore,
    lives,
    startGame, 
    restartGame,
    gameOver 
  } = useRacing();
  
  const { 
    isMuted, 
    toggleMute, 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound, 
    setEngineSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    startEngine,
    stopEngine
  } = useAudio();
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedCar, setSelectedCar] = useState('🏎️');
  const [showCarSelection, setShowCarSelection] = useState(false);
  
  const carOptions = [
    { emoji: '🏎️', name: 'Formula Car' },
    { emoji: '🚗', name: 'Sports Car' },
    { emoji: '🚙', name: 'SUV' },
    { emoji: '🏁', name: 'Race Car' },
    { emoji: '🚘', name: 'Sedan' },
    { emoji: '🚖', name: 'Taxi' }
  ];

  // Load audio files
  useEffect(() => {
    const loadAudio = () => {
      // Background music
      const bgMusic = new Audio('/sounds/background.mp3');
      bgMusic.preload = 'auto';
      setBackgroundMusic(bgMusic);
      
      // Hit sound
      const hitAudio = new Audio('/sounds/hit.mp3');
      hitAudio.preload = 'auto';
      setHitSound(hitAudio);
      
      // Success sound
      const successAudio = new Audio('/sounds/success.mp3');
      successAudio.preload = 'auto';
      setSuccessSound(successAudio);
      
      // For now, skip engine sound to avoid audio context issues
      // In a real implementation, you would add an engine.mp3 file
      console.log('Engine sound feature temporarily disabled');
    };
    
    loadAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound, setEngineSound]);
  
  // Hide instructions when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      setShowInstructions(false);
      if (!isMuted) {
        playBackgroundMusic();
        startEngine();
      }
    } else if (gameState === 'menu' || gameState === 'gameOver') {
      stopBackgroundMusic();
      stopEngine();
    }
  }, [gameState, isMuted, playBackgroundMusic, stopBackgroundMusic, startEngine, stopEngine]);

  const handleStartGame = () => {
    setShowInstructions(false);
    startGame();
  };
  
  const handleCarSelection = () => {
    setShowCarSelection(true);
    setShowInstructions(false);
  };
  
  const handleCarSelect = (carEmoji: string) => {
    setSelectedCar(carEmoji);
    setShowCarSelection(false);
    setShowInstructions(true);
  };

  const handleRestart = () => {
    setShowInstructions(false);
    restartGame();
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      {/* Game Canvas */}
      <GameCanvas selectedCar={selectedCar} />
      
      {/* UI Overlays */}
      {showInstructions && gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
          <div className="bg-gray-800 p-8 rounded-lg text-white text-center max-w-md mx-4">
            <h1 className="text-4xl font-bold mb-6 text-yellow-400">🏎️ Car Racing</h1>
            <div className="text-left mb-6 space-y-2">
              <p><strong>Controls:</strong></p>
              <p>🖱️ Desktop: Left/Right Arrow Keys</p>
              <p>📱 Mobile: Tap Left/Right sides</p>
              <p className="mt-4"><strong>Goal:</strong> Avoid enemy cars and survive!</p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={handleStartGame}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
              >
                🚀 START RACE
              </Button>
              <Button 
                onClick={handleCarSelection}
                variant="outline"
                className="w-full mb-2"
              >
                🏎️ Choose Car ({selectedCar})
              </Button>
              <Button 
                onClick={toggleMute}
                variant="outline"
                className="w-full"
              >
                {isMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Car Selection Screen */}
      {showCarSelection && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
          <div className="bg-gray-800 p-8 rounded-lg text-white text-center max-w-md mx-4">
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">🏎️ Choose Your Car</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {carOptions.map((car) => (
                <button
                  key={car.emoji}
                  onClick={() => handleCarSelect(car.emoji)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedCar === car.emoji 
                      ? 'border-yellow-400 bg-yellow-900/30' 
                      : 'border-gray-600 hover:border-yellow-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{car.emoji}</div>
                  <div className="text-xs text-gray-300">{car.name}</div>
                </button>
              ))}
            </div>
            <Button 
              onClick={() => setShowCarSelection(false)}
              variant="outline"
              className="w-full"
            >
              ← Back to Menu
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
          <div className="bg-red-900 border-2 border-red-600 p-8 rounded-lg text-white text-center max-w-md mx-4">
            <h2 className="text-3xl font-bold mb-4 text-red-400">💥 GAME OVER!</h2>
            <div className="mb-6 space-y-2">
              <p className="text-xl">Score: <span className="text-yellow-400 font-bold">{score}</span></p>
              {score === highScore && score > 0 && (
                <p className="text-green-400 font-bold">🎉 NEW HIGH SCORE! 🎉</p>
              )}
              <p className="text-lg">High Score: <span className="text-yellow-400">{highScore}</span></p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={handleRestart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
              >
                🔄 PLAY AGAIN
              </Button>
              <Button 
                onClick={() => setShowInstructions(true)}
                variant="outline"
                className="w-full"
              >
                📋 INSTRUCTIONS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* HUD - Score and Lives */}
      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
            <div className="text-sm font-bold">Score: {score}</div>
            <div className="text-xs text-yellow-400">High: {highScore}</div>
          </div>
          <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
            <div className="text-sm font-bold">Lives: {'❤️'.repeat(lives)}</div>
          </div>
          <Button 
            onClick={toggleMute}
            variant="outline"
            size="sm"
            className="bg-black bg-opacity-70 text-white border-gray-600"
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>
        </div>
      )}

      {/* Mobile Touch Controls */}
      {gameState === 'playing' && (
        <div className="absolute bottom-0 left-0 right-0 h-32 flex md:hidden">
          <button 
            className="flex-1 bg-blue-600 bg-opacity-30 text-white text-2xl font-bold active:bg-opacity-50 border-r border-gray-600"
            onTouchStart={(e) => {
              e.preventDefault();
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
            }}
          >
            ⬅️ LEFT
          </button>
          <button 
            className="flex-1 bg-blue-600 bg-opacity-30 text-white text-2xl font-bold active:bg-opacity-50"
            onTouchStart={(e) => {
              e.preventDefault();
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
            }}
          >
            ➡️ RIGHT
          </button>
        </div>
      )}
    </div>
  );
}
