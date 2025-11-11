import React, { Component } from "react";
import Snake from "./Snake";
import Food from "./Food";
import Bomb from "./Bomb";
import PowerUp from "./PowerUp";
import PowerUpIndicator from "./PowerUpIndicator";
import Menu from "./Menu";
import Leaderboard from "./Leaderboard";
import AnimatedBackground from "./components/AnimatedBackground";
import Settings from "./components/Settings";
import { scoreService } from "./services/api";
import { GAME_MODES, POWER_UPS, POWER_UP_CONFIG, CHAOS_CONFIG, GAME_MODE_OBJECTIVES } from "./constants/gameConstants";


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
      topScores: [],
      settingsOpen: false,
      glowEnabled: true
    };
    this.directionQueue = [];
    this.isGameOver = false;
    this.hasEaten = false;
    this.gameInterval = null;
    this.powerUpInterval = null;
    this.normalSpeed = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  componentDidMount() {
    this.gameInterval = setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
    
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    
    this.loadTopScores();
  }

  componentWillUnmount() {
    if (this.gameInterval) clearInterval(this.gameInterval);
    if (this.powerUpInterval) clearInterval(this.powerUpInterval);
    
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
    this.onSnakeEats();
    this.checkBombCollision();
    this.checkPowerUpCollection();
  }

  onKeyDown = e => {
    e = e || window.event;
    
    if ([37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault();
    }
    
    const lastDirection = this.directionQueue.length > 0 
      ? this.directionQueue[this.directionQueue.length - 1]
      : this.state.direction;
    
    let newDirection = null;
    
    switch (e.keyCode) {
      case 37:
      case 81:
        if (lastDirection !== "RIGHT") {
          newDirection = "LEFT";
        }
        break;
      case 38:
      case 90:
        if (lastDirection !== "DOWN") {
          newDirection = "UP";
        }
        break;
      case 39:
      case 68:
        if (lastDirection !== "LEFT") {
          newDirection = "RIGHT";
        }
        break;
      case 40:
      case 83:
        if (lastDirection !== "UP") {
          newDirection = "DOWN";
        }
        break;
    }
    
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
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return;
    }
    
    const lastDirection = this.directionQueue.length > 0 
      ? this.directionQueue[this.directionQueue.length - 1]
      : this.state.direction;
    
    let newDirection = null;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && lastDirection !== "LEFT") {
        newDirection = "RIGHT";
      } else if (deltaX < 0 && lastDirection !== "RIGHT") {
        newDirection = "LEFT";
      }
    } else {
      if (deltaY > 0 && lastDirection !== "UP") {
        newDirection = "DOWN";
      } else if (deltaY < 0 && lastDirection !== "DOWN") {
        newDirection = "UP";
      }
    }
    
    if (newDirection && this.directionQueue.length < 3) {
      this.directionQueue.push(newDirection);
    }
    
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  };

  moveSnake = () => {
    if (this.state.route !== "game" || this.isGameOver) return;
    
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    
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
    
    if (head[0] >= 34 || head[1] >= 30 || head[0] < 0 || head[1] < 0) {
      this.isGameOver = true;
      this.gameOver();
      return;
    }
    
    if (this.state.activePowerUp !== POWER_UPS.GHOST_MODE) {
      for (let i = 0; i < dots.length - 1; i++) {
        if (head[0] === dots[i][0] && head[1] === dots[i][1]) {
          this.isGameOver = true;
          this.gameOver();
          return;
        }
      }
    }
    
    dots.push(head);
    
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
      
      if (this.state.gameMode === GAME_MODES.CHAOS) {
        if (newFoodCount % CHAOS_CONFIG.BOMB_SPAWN_INTERVAL === 0 && this.state.bombs.length < CHAOS_CONFIG.MAX_BOMBS) {
          const bombPosition = getRandomPosition([
            ...this.state.snakeDots,
            ...this.state.bombs,
            ...this.state.powerUps.map(p => p.position),
            newState.food
          ]);
          newState.bombs = [...this.state.bombs, bombPosition];
        }
        
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
    }
  }
  
  checkBombCollision() {
    if (this.state.gameMode !== GAME_MODES.CHAOS) return;
    if (this.state.activePowerUp === POWER_UPS.GHOST_MODE) return;
    
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
      
      const newPowerUps = [...this.state.powerUps];
      newPowerUps.splice(powerUpIndex, 1);
      this.setState({ powerUps: newPowerUps });
    }
  }
  
  activatePowerUp(type) {
    if (this.powerUpInterval) {
      clearInterval(this.powerUpInterval);
    }
    
    const config = POWER_UP_CONFIG[type];
    
    if (type === POWER_UPS.BOMB_REMOVER) {
      this.setState({ bombs: [], activePowerUp: null, powerUpTimeRemaining: 0 });
      return;
    }
    
    this.setState({
      activePowerUp: type,
      powerUpTimeRemaining: config.duration
    });
    
    if (type === POWER_UPS.SPEED_BOOST) {
      this.normalSpeed = this.state.speed;
      const boostedSpeed = Math.max(this.state.speed * 0.9, 40);
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.moveSnake, boostedSpeed);
    }
    
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
    
    if (this.state.activePowerUp === POWER_UPS.SPEED_BOOST && this.normalSpeed !== null) {
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.moveSnake, this.normalSpeed);
      this.normalSpeed = null; // Reset saved speed
    }
    
    this.setState({
      activePowerUp: null,
      powerUpTimeRemaining: 0
    });
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
    
    if (this.powerUpInterval) {
      clearInterval(this.powerUpInterval);
      this.powerUpInterval = null;
    }
    
    if (this.state.activePowerUp === POWER_UPS.SPEED_BOOST) {
      this.normalSpeed = null; // Reset saved speed
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.moveSnake, initialState.speed);
    }
    
    let message = `GAME OVER, ${this.state.username}! Your score is ${finalScore}`;
    if (this.state.gameMode === GAME_MODES.PAF && finalScore > 35) {
      message = `🎉 FÉLICITATIONS ${this.state.username}! 🎉\n\nVous avez battu M. Paf avec un score de ${finalScore}!\n\n🔑 Code secret: pafsupreme 🔑\n\nNotez bien ce code pour valider votre quête!`;
    }
    
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
      topScores: this.state.topScores,
      settingsOpen: this.state.settingsOpen,
      glowEnabled: this.state.glowEnabled
    });
    this.directionQueue = [];
    
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(this.moveSnake, initialState.speed);
  };


  render() {
    const { route, snakeDots, food, topScores, bombs, powerUps, activePowerUp, powerUpTimeRemaining, gameMode, username, settingsOpen, glowEnabled } = this.state;
    const score = snakeDots.length - 2;
    const isGhostMode = activePowerUp === POWER_UPS.GHOST_MODE;
    
    return (
      <div className={`game-container ${!glowEnabled ? 'no-glow' : ''}`}>
        <AnimatedBackground />
        <Settings 
          isOpen={settingsOpen}
          onClose={() => this.setState({ settingsOpen: false })}
          glowEnabled={glowEnabled}
          onGlowToggle={(enabled) => this.setState({ glowEnabled: enabled })}
        />
        {route === "menu" ? (
          <div>
            <div className="game-title">
              POLYSNAKE
            </div>
            <Menu 
              onRouteChange={this.onRouteChange} 
              onUsernameSet={this.onUsernameSet}
              onGameModeSet={this.onGameModeSet}
              onGameModeChange={this.onGameModeChange}
              initialUsername={username}
              initialGameMode={gameMode}
              onSettingsClick={() => this.setState({ settingsOpen: true })}
            />
            <Leaderboard scores={topScores} gameMode={gameMode} />
          </div>
        ) : (
          <div>
            <PowerUpIndicator 
              activePowerUp={activePowerUp} 
              timeRemaining={powerUpTimeRemaining} 
            />
            <div className="game-title-ingame">
              POLYSNAKE
            </div>
            <div className="game-score">
              SCORE: {score}
            </div>
            {GAME_MODE_OBJECTIVES[gameMode] && (
              <div className="game-objective">
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
