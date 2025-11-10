// Utiliser une URL relative si on est sur le même domaine, sinon utiliser l'URL configurée
const API_URL = process.env.REACT_APP_API_URL || window.location.origin.replace(':3001', ':8081');

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
