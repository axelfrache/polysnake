import React, { Component } from "react";
import Snake from "./Snake";
import Food from "./Food";
import Menu from "./Menu";
import Leaderboard from "./Leaderboard";
import { scoreService } from "./services/api";

// Version 1.1 - Bug fix: collision detection après manger un food

const getRandomFood = (snakeDots = []) => {
  let min = 1;
  let maxX = 32; // 17 cases * 2 - 2
  let maxY = 28; // 15 cases * 2 - 2
  let food;
  
  // Générer une position jusqu'à ce qu'elle ne soit pas sur le serpent
  do {
    let x = Math.floor((Math.random() * (maxX - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (maxY - min + 1) + min) / 2) * 2;
    food = [x, y];
  } while (snakeDots.some(dot => dot[0] === food[0] && dot[1] === food[1]));
  
  return food;
};

const initialState = {
  food: getRandomFood(),
  direction: "RIGHT",
  speed: 100,
  route: "menu",
  snakeDots: [[0, 0], [0, 2]]
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      ...initialState,
      username: "",
      topScores: []
    };
    this.directionQueue = [];
    this.isGameOver = false;
    this.hasEaten = false;
  }

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
    this.loadTopScores();
  }

  loadTopScores = async () => {
    try {
      const scores = await scoreService.getTopScores();
      this.setState({ topScores: scores });
    } catch (error) {
      console.error("Failed to load scores:", error);
    }
  };

  componentDidUpdate() {
    // La détection de collision est maintenant dans moveSnake()
    // On vérifie juste si le serpent mange
    this.onSnakeEats();
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
    
    // 2. Collision avec soi-même
    for (let i = 0; i < dots.length; i++) {
      if (head[0] === dots[i][0] && head[1] === dots[i][1]) {
        this.isGameOver = true;
        this.gameOver();
        return;
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
      this.setState({
        food: getRandomFood(this.state.snakeDots)
      });
      this.hasEaten = true;
      this.increaseSpeed();
    }
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

  gameOver = async () => {
    const finalScore = this.state.snakeDots.length - 2;
    
    // Sauvegarder le score une seule fois
    if (this.state.username && finalScore > 0) {
      try {
        await scoreService.saveScore(this.state.username, finalScore);
        await this.loadTopScores();
        alert(`GAME OVER, ${this.state.username}! Your score is ${finalScore}`);
      } catch (error) {
        console.error("Failed to save score:", error);
        alert(`GAME OVER! Your score is ${finalScore}\n\nError saving score: ${error.message || 'Server error'}`);
      }
    } else {
      alert(`GAME OVER, ${this.state.username}! Your score is ${finalScore}`);
    }
    
    this.setState({
      ...initialState,
      username: this.state.username,
      topScores: this.state.topScores
    });
    this.directionQueue = [];
  };


  render() {
    const { route, snakeDots, food, topScores } = this.state;
    const score = snakeDots.length - 2;
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
              POLY SNAKE
            </div>
            <Menu onRouteChange={this.onRouteChange} onUsernameSet={this.onUsernameSet} />
            <Leaderboard scores={topScores} />
          </div>
        ) : (
          <div>
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
            <div className="game-area">
              <Snake snakeDots={snakeDots} />
              <Food dot={food} />
            </div>
            <Leaderboard scores={topScores} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
