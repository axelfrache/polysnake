import React, { Component } from "react";
import Snake from "./Snake";
import Food from "./Food";
import Bomb from "./Bomb";
import PowerUp from "./PowerUp";
import PowerUpIndicator from "./PowerUpIndicator";
import Menu from "./Menu";
import Leaderboard from "./Leaderboard";
import { scoreService } from "./services/api";
import { GAME_MODES, POWER_UPS, POWER_UP_CONFIG, CHAOS_CONFIG, GAME_MODE_OBJECTIVES } from "./constants/gameConstants";

// Version 1.2 - Chaos Mode with bombs and power-ups

// Helper: Generate random position avoiding obstacles
const getRandomPosition = (avoidPositions = []) => {
  let min = 1;
  let maxX = 32;
  let maxY = 28;
  let position;
  
  do {
    let x = Math.floor((Math.random() * (maxX - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (maxY - min + 1) + min) / 2) * 2;
    position = [x, y];
  } while (avoidPositions.some(pos => pos[0] === position[0] && pos[1] === position[1]));
  
  return position;
};

const getRandomFood = (snakeDots = [], bombs = [], powerUps = []) => {
  const avoidPositions = [...snakeDots, ...bombs, ...powerUps.map(p => p.position)];
  return getRandomPosition(avoidPositions);
};

const getRandomPowerUpType = () => {
  const types = Object.values(POWER_UPS);
  return types[Math.floor(Math.random() * types.length)];
};

const initialState = {
  food: getRandomFood(),
  direction: "RIGHT",
  speed: 100,
  route: "menu",
  snakeDots: [[0, 0], [0, 2]],
  bombs: [],
  powerUps: [],
  activePowerUp: null,
  powerUpTimeRemaining: 0,
  foodCount: 0
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      ...initialState,
      username: "",
      gameMode: GAME_MODES.CLASSIC,
      topScores: []
    };
    this.directionQueue = [];
    this.isGameOver = false;
    this.hasEaten = false;
    this.gameInterval = null;
    this.powerUpInterval = null;
    // Touch controls
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  componentDidMount() {
    this.gameInterval = setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
    
    // Touch events for mobile
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    
    this.loadTopScores();
  }

  componentWillUnmount() {
    if (this.gameInterval) clearInterval(this.gameInterval);
    if (this.powerUpInterval) clearInterval(this.powerUpInterval);
    
    // Remove touch listeners
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
  }

  loadTopScores = async () => {
    try {
      const scores = await scoreService.getTopScores(this.state.gameMode);
      this.setState({ topScores: scores });
    } catch (error) {
      console.error("Failed to load scores:", error);
    }
  };

  componentDidUpdate() {
    // La détection de collision est maintenant dans moveSnake()
    // On vérifie juste si le serpent mange et les interactions du Chaos Mode
    this.onSnakeEats();
    this.checkBombCollision();
    this.checkPowerUpCollection();
  }

  onKeyDown = e => {
    e = e || window.event;
    
    // Empêcher le comportement par défaut des flèches (scroll de la page)
    if ([37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault();
    }
    
    // Obtenir la dernière direction (soit de la queue, soit de l'état)
    const lastDirection = this.directionQueue.length > 0 
      ? this.directionQueue[this.directionQueue.length - 1]
      : this.state.direction;
    
    let newDirection = null;
    
    switch (e.keyCode) {
      case 37: // Flèche gauche
      case 81: // Q
        // Empêcher d'aller à gauche si on va à droite
        if (lastDirection !== "RIGHT") {
          newDirection = "LEFT";
        }
        break;
      case 38: // Flèche haut
      case 90: // Z
        // Empêcher d'aller en haut si on va en bas
        if (lastDirection !== "DOWN") {
          newDirection = "UP";
        }
        break;
      case 39: // Flèche droite
      case 68: // D
        // Empêcher d'aller à droite si on va à gauche
        if (lastDirection !== "LEFT") {
          newDirection = "RIGHT";
        }
        break;
      case 40: // Flèche bas
      case 83: // S
        // Empêcher d'aller en bas si on va en haut
        if (lastDirection !== "UP") {
          newDirection = "DOWN";
        }
        break;
    }
    
    // Ajouter la nouvelle direction à la queue (max 3 directions en attente)
    if (newDirection && this.directionQueue.length < 3) {
      this.directionQueue.push(newDirection);
    }
  };

  handleTouchStart = (e) => {
    if (this.state.route !== "game") return;
    
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  };

  handleTouchMove = (e) => {
    if (this.state.route !== "game") return;
    if (!this.touchStartX || !this.touchStartY) return;
    
    e.preventDefault(); // Empêcher le scroll
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    
    // Seuil minimum pour détecter un swipe (30px)
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return;
    }
    
    // Déterminer la direction du swipe
    const lastDirection = this.directionQueue.length > 0 
      ? this.directionQueue[this.directionQueue.length - 1]
      : this.state.direction;
    
    let newDirection = null;
    
    // Swipe horizontal ou vertical ?
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Swipe horizontal
      if (deltaX > 0 && lastDirection !== "LEFT") {
        newDirection = "RIGHT";
      } else if (deltaX < 0 && lastDirection !== "RIGHT") {
        newDirection = "LEFT";
      }
    } else {
      // Swipe vertical
      if (deltaY > 0 && lastDirection !== "UP") {
        newDirection = "DOWN";
      } else if (deltaY < 0 && lastDirection !== "DOWN") {
        newDirection = "UP";
      }
    }
    
    // Ajouter la direction à la queue
    if (newDirection && this.directionQueue.length < 3) {
      this.directionQueue.push(newDirection);
    }
    
    // Réinitialiser les positions de départ pour le prochain swipe
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  };

  moveSnake = () => {
    if (this.state.route !== "game" || this.isGameOver) return;
    
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    
    // Prendre la prochaine direction de la queue, ou garder la direction actuelle
    const direction = this.directionQueue.length > 0 
      ? this.directionQueue.shift()
      : this.state.direction;
    
    switch (direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
    }
    
    // Vérifier les collisions AVANT de mettre à jour le state
    // 1. Collision avec les murs
    if (head[0] >= 34 || head[1] >= 30 || head[0] < 0 || head[1] < 0) {
      this.isGameOver = true;
      this.gameOver();
      return;
    }
    
    // 2. Collision avec soi-même (sauf en mode ghost)
    if (this.state.activePowerUp !== POWER_UPS.GHOST_MODE) {
      for (let i = 0; i < dots.length; i++) {
        if (head[0] === dots[i][0] && head[1] === dots[i][1]) {
          this.isGameOver = true;
          this.gameOver();
          return;
        }
      }
    }
    
    dots.push(head);
    
    // Ne retirer la queue que si on n'a pas mangé
    if (!this.hasEaten) {
      dots.shift();
    }
    this.hasEaten = false;
    
    this.setState({
      snakeDots: dots,
      direction: direction
    });
  };

  onSnakeOutOfBounds() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (this.state.route === "game" && !this.isGameOver) {
      if (head[0] >= 34 || head[1] >= 30 || head[0] < 0 || head[1] < 0) {
        this.isGameOver = true;
        this.gameOver();
      }
    }
  }

  onSnakeCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1] && !this.isGameOver) {
        this.isGameOver = true;
        this.gameOver();
      }
    });
  }

  onSnakeEats() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      const newFoodCount = this.state.foodCount + 1;
      const newState = {
        food: getRandomFood(this.state.snakeDots, this.state.bombs, this.state.powerUps),
        foodCount: newFoodCount
      };
      
      // Chaos Mode: spawn bombs and power-ups
      if (this.state.gameMode === GAME_MODES.CHAOS) {
        // Spawn bomb every BOMB_SPAWN_INTERVAL foods
        if (newFoodCount % CHAOS_CONFIG.BOMB_SPAWN_INTERVAL === 0 && this.state.bombs.length < CHAOS_CONFIG.MAX_BOMBS) {
          const bombPosition = getRandomPosition([
            ...this.state.snakeDots,
            ...this.state.bombs,
            ...this.state.powerUps.map(p => p.position),
            newState.food
          ]);
          newState.bombs = [...this.state.bombs, bombPosition];
        }
        
        // Spawn power-up every POWER_UP_SPAWN_INTERVAL foods
        if (newFoodCount % CHAOS_CONFIG.POWER_UP_SPAWN_INTERVAL === 0 && this.state.powerUps.length === 0) {
          const powerUpPosition = getRandomPosition([
            ...this.state.snakeDots,
            ...this.state.bombs,
            newState.food
          ]);
          newState.powerUps = [{
            position: powerUpPosition,
            type: getRandomPowerUpType()
          }];
        }
      }
      
      this.setState(newState);
      this.hasEaten = true;
      this.increaseSpeed();
    }
  }
  
  checkBombCollision() {
    if (this.state.gameMode !== GAME_MODES.CHAOS) return;
    if (this.state.activePowerUp === POWER_UPS.GHOST_MODE) return; // Ghost mode protects from bombs
    
    const head = this.state.snakeDots[this.state.snakeDots.length - 1];
    const hitBomb = this.state.bombs.some(bomb => bomb[0] === head[0] && bomb[1] === head[1]);
    
    if (hitBomb && !this.isGameOver) {
      this.isGameOver = true;
      this.gameOver();
    }
  }
  
  checkPowerUpCollection() {
    if (this.state.gameMode !== GAME_MODES.CHAOS) return;
    
    const head = this.state.snakeDots[this.state.snakeDots.length - 1];
    const powerUpIndex = this.state.powerUps.findIndex(
      pu => pu.position[0] === head[0] && pu.position[1] === head[1]
    );
    
    if (powerUpIndex !== -1) {
      const powerUp = this.state.powerUps[powerUpIndex];
      this.activatePowerUp(powerUp.type);
      
      // Remove collected power-up
      const newPowerUps = [...this.state.powerUps];
      newPowerUps.splice(powerUpIndex, 1);
      this.setState({ powerUps: newPowerUps });
    }
  }
  
  activatePowerUp(type) {
    // Clear previous power-up timer
    if (this.powerUpInterval) {
      clearInterval(this.powerUpInterval);
    }
    
    const config = POWER_UP_CONFIG[type];
    
    // Instant effects
    if (type === POWER_UPS.BOMB_REMOVER) {
      this.setState({ bombs: [], activePowerUp: null, powerUpTimeRemaining: 0 });
      return;
    }
    
    // Timed effects
    this.setState({
      activePowerUp: type,
      powerUpTimeRemaining: config.duration
    });
    
    // Apply speed boost (légère accélération)
    if (type === POWER_UPS.SPEED_BOOST) {
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.moveSnake, Math.max(this.state.speed * 0.75, 40));
    }
    
    // Start countdown timer
    this.powerUpInterval = setInterval(() => {
      const newTime = this.state.powerUpTimeRemaining - 100;
      
      if (newTime <= 0) {
        this.deactivatePowerUp();
      } else {
        this.setState({ powerUpTimeRemaining: newTime });
      }
    }, 100);
  }
  
  deactivatePowerUp() {
    if (this.powerUpInterval) {
      clearInterval(this.powerUpInterval);
      this.powerUpInterval = null;
    }
    
    // Restore normal speed if speed boost was active
    if (this.state.activePowerUp === POWER_UPS.SPEED_BOOST) {
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.moveSnake, this.state.speed);
    }
    
    this.setState({
      activePowerUp: null,
      powerUpTimeRemaining: 0
    });
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 20
      });
    }
  }

  onRouteChange = () => {
    this.isGameOver = false;
    this.hasEaten = false;
    this.setState({
      route: "game"
    });
  };

  onUsernameSet = (username) => {
    this.setState({ username });
  };
  
  onGameModeSet = (gameMode) => {
    this.setState({ gameMode });
  };
  
  onGameModeChange = async (gameMode) => {
    // Mettre à jour le mode et recharger le leaderboard correspondant
    this.setState({ gameMode });
    try {
      const scores = await scoreService.getTopScores(gameMode);
      this.setState({ topScores: scores });
    } catch (error) {
      console.error("Failed to load scores:", error);
    }
  };

  gameOver = async () => {
    const finalScore = this.state.snakeDots.length - 2;
    
    // Vérifier si le défi de M. Paf est réussi
    let message = `GAME OVER, ${this.state.username}! Your score is ${finalScore}`;
    if (this.state.gameMode === GAME_MODES.PAF && finalScore > 35) {
      message = `🎉 FÉLICITATIONS ${this.state.username}! 🎉\n\nVous avez battu M. Paf avec un score de ${finalScore}!\n\n🔑 Code secret: pafsupreme 🔑\n\nNotez bien ce code pour valider votre quête!`;
    }
    
    // Sauvegarder le score une seule fois
    if (this.state.username && finalScore > 0) {
      try {
        await scoreService.saveScore(this.state.username, finalScore, this.state.gameMode);
        await this.loadTopScores();
        alert(message);
      } catch (error) {
        console.error("Failed to save score:", error);
        alert(`GAME OVER! Your score is ${finalScore}\n\nError saving score: ${error.message || 'Server error'}`);
      }
    } else {
      alert(message);
    }
    
    this.setState({
      ...initialState,
      username: this.state.username,
      gameMode: this.state.gameMode,
      topScores: this.state.topScores
    });
    this.directionQueue = [];
  };


  render() {
    const { route, snakeDots, food, topScores, bombs, powerUps, activePowerUp, powerUpTimeRemaining, gameMode, username } = this.state;
    const score = snakeDots.length - 2;
    const isGhostMode = activePowerUp === POWER_UPS.GHOST_MODE;
    
    return (
      <div>
        {route === "menu" ? (
          <div>
            <div style={{ 
              textAlign: 'center', 
              fontSize: '56px', 
              fontWeight: 'bold', 
              marginTop: '30px',
              marginBottom: '20px', 
              color: '#00ff88',
              textShadow: '0 0 20px rgba(0, 255, 136, 1), 0 0 40px rgba(0, 255, 136, 0.6), 0 0 60px rgba(0, 255, 136, 0.4)',
              fontFamily: '"Courier New", Courier, monospace',
              letterSpacing: '8px'
            }}>
              POLYSNAKE
            </div>
            <Menu 
              onRouteChange={this.onRouteChange} 
              onUsernameSet={this.onUsernameSet}
              onGameModeSet={this.onGameModeSet}
              onGameModeChange={this.onGameModeChange}
              initialUsername={username}
              initialGameMode={gameMode}
            />
            <Leaderboard scores={topScores} gameMode={gameMode} />
          </div>
        ) : (
          <div>
            <PowerUpIndicator 
              activePowerUp={activePowerUp} 
              timeRemaining={powerUpTimeRemaining} 
            />
            <div style={{ 
              textAlign: 'center', 
              fontSize: '48px', 
              fontWeight: 'bold', 
              marginTop: '15px',
              marginBottom: '5px', 
              color: '#00ff88',
              textShadow: '0 0 20px rgba(0, 255, 136, 1), 0 0 40px rgba(0, 255, 136, 0.6)',
              fontFamily: '"Courier New", Courier, monospace',
              letterSpacing: '6px'
            }}>
              POLY SNAKE
            </div>
            <div style={{ 
              textAlign: 'center', 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginBottom: '10px', 
              color: '#00d9ff',
              textShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.5)',
              fontFamily: '"Courier New", Courier, monospace',
              letterSpacing: '2px'
            }}>
              SCORE: {score}
            </div>
            {GAME_MODE_OBJECTIVES[gameMode] && (
              <div style={{ 
                textAlign: 'center', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                marginBottom: '10px', 
                color: '#ff0080',
                textShadow: '0 0 10px rgba(255, 0, 128, 0.8)',
                fontFamily: '"Courier New", Courier, monospace',
                letterSpacing: '1px'
              }}>
                {GAME_MODE_OBJECTIVES[gameMode]}
              </div>
            )}
            <div className="game-area">
              <Snake snakeDots={snakeDots} isGhostMode={isGhostMode} />
              <Food dot={food} />
              {gameMode === GAME_MODES.CHAOS && bombs.map((bomb, i) => (
                <Bomb key={`bomb-${i}`} dot={bomb} />
              ))}
              {gameMode === GAME_MODES.CHAOS && powerUps.map((powerUp, i) => (
                <PowerUp key={`powerup-${i}`} dot={powerUp.position} type={powerUp.type} />
              ))}
            </div>
            <Leaderboard scores={topScores} gameMode={gameMode} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
