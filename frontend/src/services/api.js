// Déterminer l'URL de l'API
const getApiUrl = () => {
  // Si REACT_APP_API_URL est défini, l'utiliser
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Sinon, construire l'URL basée sur le hostname actuel
  const protocol = window.location.protocol; // http: ou https:
  const hostname = window.location.hostname; // polysnake.meowsik.com ou localhost
  
  // Si on est sur le domaine de production, utiliser le sous-domaine API
  if (hostname === 'polysnake.meowsik.com') {
    return `${protocol}//api-polysnake.meowsik.com`;
  }
  
  // Sinon, utiliser le port 8081 pour le backend local
  return `${protocol}//${hostname}:8081`;
};

const API_URL = getApiUrl();

export const scoreService = {
  async saveScore(username, score, gameMode) {
    const response = await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, score, gameMode }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save score');
    }
    
    return response.json();
  },

  async getTopScores(gameMode = 'classic') {
    const response = await fetch(`${API_URL}/api/scores/top?gameMode=${gameMode}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch scores');
    }
    
    return response.json();
  },
};
