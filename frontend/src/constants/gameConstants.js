// Game Modes
export const GAME_MODES = {
  CLASSIC: 'classic',
  CHAOS: 'chaos',
  PAF: 'paf'
};

export const GAME_MODE_LABELS = {
  [GAME_MODES.CLASSIC]: 'Classic Mode',
  [GAME_MODES.CHAOS]: 'Chaos Mode',
  [GAME_MODES.PAF]: 'Défi de M. Paf'
};

export const GAME_MODE_OBJECTIVES = {
  [GAME_MODES.PAF]: 'Objectif: Battre M. Paf à son propre jeu'
};

// Power-up types
export const POWER_UPS = {
  SPEED_BOOST: 'speed_boost',
  BOMB_REMOVER: 'bomb_remover',
  GHOST_MODE: 'ghost_mode'
};

// Power-up configurations
export const POWER_UP_CONFIG = {
  [POWER_UPS.SPEED_BOOST]: {
    duration: 7000, // 7 seconds
    icon: '⚡',
    color: '#FFD700',
    name: 'Speed Boost',
    effect: 'Increased speed'
  },
  [POWER_UPS.BOMB_REMOVER]: {
    duration: 0, // Instant effect
    icon: '💣',
    color: '#9B59B6',
    name: 'Bomb Remover',
    effect: 'Removes all bombs'
  },
  [POWER_UPS.GHOST_MODE]: {
    duration: 5000, // 5 seconds
    icon: '👻',
    color: '#00FFFF',
    name: 'Ghost Mode',
    effect: 'Pass through obstacles'
  }
};

// Spawn probabilities (out of 100)
export const SPAWN_PROBABILITY = {
  FOOD: 100,
  BOMB: 15, // 15% chance per food spawn
  POWER_UP: 8  // 8% chance per food spawn
};

// Chaos mode configuration
export const CHAOS_CONFIG = {
  MAX_BOMBS: 5,
  BOMB_SPAWN_INTERVAL: 3, // Spawn bomb every 3 food items
  POWER_UP_SPAWN_INTERVAL: 5 // Spawn power-up every 5 food items
};
