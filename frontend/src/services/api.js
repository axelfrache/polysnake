// Déterminer l'URL de l'API
const getApiUrl = () => {
  // Si REACT_APP_API_URL est défini, l'utiliser
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Sinon, construire l'URL basée sur le hostname actuel
  const protocol = window.location.protocol; // http: ou https:
  const hostname = window.location.hostname; // polysnake.meowsik.com ou localhost
  
  // Utiliser le port 8081 pour le backend
  return `${protocol}//${hostname}:8081`;
};

const API_URL = getApiUrl();

export const scoreService = {
  async saveScore(username, score) {
    const response = await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, score }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save score');
    }
    
    return response.json();
  },

  async getTopScores() {
    const response = await fetch(`${API_URL}/api/scores/top`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch scores');
    }
    
    return response.json();
  },
};
