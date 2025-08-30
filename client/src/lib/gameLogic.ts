export interface Car {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  moveLeft: boolean;
  moveRight: boolean;
}

export interface Collectible {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  collected: boolean;
}

export interface CollisionResult {
  enemyHit: boolean;
  collectibleCollected: boolean;
}

export class GameLogic {
  public player: Car;
  public enemies: Car[] = [];
  public collectibles: Collectible[] = [];
  public score: number = 0;
  public roadOffset: number = 0;
  
  private canvasWidth: number;
  private canvasHeight: number;
  private enemySpawnTimer: number = 0;
  private collectibleSpawnTimer: number = 0;
  private baseEnemySpeed: number = 2;
  private roadSpeed: number = 5;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    
    const playerWidth = Math.min(canvasWidth * 0.1, 60);
    const playerHeight = playerWidth * 1.5;
    
    this.player = {
      x: canvasWidth / 2 - playerWidth / 2,
      y: canvasHeight - playerHeight - 50,
      width: playerWidth,
      height: playerHeight,
      speed: 5,
      moveLeft: false,
      moveRight: false
    };
  }

  update(): void {
    this.updatePlayer();
    this.updateEnemies();
    this.updateCollectibles();
    this.updateRoad();
    this.spawnEnemies();
    this.spawnCollectibles();
    this.updateScore();
  }

  private updatePlayer(): void {
    const roadWidth = Math.min(this.canvasWidth * 0.8, 400);
    const roadStartX = (this.canvasWidth - roadWidth) / 2;
    const roadEndX = roadStartX + roadWidth;

    if (this.player.moveLeft && this.player.x > roadStartX + 10) {
      this.player.x -= this.player.speed;
    }
    if (this.player.moveRight && this.player.x + this.player.width < roadEndX - 10) {
      this.player.x += this.player.speed;
    }
  }

  private updateEnemies(): void {
    // Calculate current difficulty multiplier
    const difficultyMultiplier = 1 + Math.floor(this.score / 100) * 0.2;
    
    this.enemies.forEach(enemy => {
      enemy.y += enemy.speed * difficultyMultiplier;
    });

    // Remove enemies that are off screen
    this.enemies = this.enemies.filter(enemy => enemy.y < this.canvasHeight + 50);
  }

  private updateCollectibles(): void {
    this.collectibles.forEach(collectible => {
      if (!collectible.collected) {
        collectible.y += collectible.speed;
      }
    });

    // Remove collectibles that are off screen or collected
    this.collectibles = this.collectibles.filter(
      collectible => collectible.y < this.canvasHeight + 50 && !collectible.collected
    );
  }

  private updateRoad(): void {
    this.roadOffset += this.roadSpeed;
    if (this.roadOffset > 40) {
      this.roadOffset = 0;
    }
  }

  private spawnEnemies(): void {
    this.enemySpawnTimer++;
    
    // Spawn rate increases with difficulty
    const spawnRate = Math.max(60 - Math.floor(this.score / 50) * 5, 30);
    
    if (this.enemySpawnTimer >= spawnRate) {
      this.enemySpawnTimer = 0;
      this.spawnEnemy();
    }
  }

  private spawnCollectibles(): void {
    this.collectibleSpawnTimer++;
    
    // Spawn collectibles less frequently
    if (this.collectibleSpawnTimer >= 180) { // Every 3 seconds at 60fps
      this.collectibleSpawnTimer = 0;
      if (Math.random() < 0.3) { // 30% chance to spawn
        this.spawnCollectible();
      }
    }
  }

  private spawnEnemy(): void {
    const roadWidth = Math.min(this.canvasWidth * 0.8, 400);
    const roadStartX = (this.canvasWidth - roadWidth) / 2;
    
    const enemyWidth = Math.min(this.canvasWidth * 0.08, 50);
    const enemyHeight = enemyWidth * 1.5;
    
    // Choose random lane (3 lanes)
    const laneWidth = roadWidth / 3;
    const lane = Math.floor(Math.random() * 3);
    const enemyX = roadStartX + lane * laneWidth + (laneWidth - enemyWidth) / 2;

    const enemy: Car = {
      x: enemyX,
      y: -enemyHeight,
      width: enemyWidth,
      height: enemyHeight,
      speed: this.baseEnemySpeed + Math.random() * 2,
      moveLeft: false,
      moveRight: false
    };

    this.enemies.push(enemy);
  }

  private spawnCollectible(): void {
    const roadWidth = Math.min(this.canvasWidth * 0.8, 400);
    const roadStartX = (this.canvasWidth - roadWidth) / 2;
    
    const collectibleSize = Math.min(this.canvasWidth * 0.04, 30);
    
    // Choose random position across the road
    const collectibleX = roadStartX + Math.random() * (roadWidth - collectibleSize);

    const collectible: Collectible = {
      x: collectibleX,
      y: -collectibleSize,
      width: collectibleSize,
      height: collectibleSize,
      speed: this.baseEnemySpeed,
      collected: false
    };

    this.collectibles.push(collectible);
  }

  private updateScore(): void {
    this.score += 1; // Increment score over time
  }

  checkCollisions(): CollisionResult {
    let enemyHit = false;
    let collectibleCollected = false;

    // Check enemy collisions
    for (const enemy of this.enemies) {
      if (this.isColliding(this.player, enemy)) {
        enemyHit = true;
        // Remove the enemy that was hit
        const index = this.enemies.indexOf(enemy);
        this.enemies.splice(index, 1);
        break;
      }
    }

    // Check collectible collisions
    for (const collectible of this.collectibles) {
      if (!collectible.collected && this.isColliding(this.player, collectible)) {
        collectible.collected = true;
        collectibleCollected = true;
        this.score += 50; // Bonus points for collecting
        break;
      }
    }

    return { enemyHit, collectibleCollected };
  }

  private isColliding(obj1: { x: number; y: number; width: number; height: number }, 
                     obj2: { x: number; y: number; width: number; height: number }): boolean {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }
}
