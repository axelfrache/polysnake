# 🐍 Poly Snake - Full Stack Game

Un jeu Snake moderne avec leaderboard, backend Spring Boot, frontend React et base de données PostgreSQL.

## 🎮 Fonctionnalités

- **Jeu Snake** avec contrôles clavier (flèches + ZQSD)
- **Leaderboard en temps réel** affichant les 10 meilleurs scores
- **Système de username** pour identifier les joueurs
- **Backend REST API** avec Spring Boot et PostgreSQL
- **Design néon moderne** avec effets visuels
- **Déploiement Docker** complet

## 🏗️ Architecture

```
polysnake/
├── backend/          # Spring Boot API (Java 21)
├── frontend/         # React App
├── docker-compose.yml # Orchestration complète
└── .env.example      # Variables d'environnement
```

## 🚀 Lancement rapide

### Prérequis
- Docker & Docker Compose
- (Optionnel) Java 21 + Maven pour développement backend
- (Optionnel) Node.js 16+ pour développement frontend

### Avec Docker (Recommandé)

```bash
# Cloner le projet
cd /home/frachea/Documents/code/integration/polysnake

# Copier et configurer les variables d'environnement
cp .env.example .env

# Lancer tous les services
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f
```

**Accès :**
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8080
- **PostgreSQL** : localhost:5432

### Arrêter les services

```bash
docker-compose down

# Avec suppression des volumes (données)
docker-compose down -v
```

## 💻 Développement local

### Backend

```bash
cd backend

# Lancer PostgreSQL séparément
docker run -d \
  --name polysnake-postgres \
  -e POSTGRES_DB=polysnake \
  -e POSTGRES_USER=polysnake \
  -e POSTGRES_PASSWORD=polysnake \
  -p 5432:5432 \
  postgres:16-alpine

# Lancer le backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm start

# Build de production
npm run build
```

## 📡 API Endpoints

### Scores

#### Sauvegarder un score
```http
POST /api/scores
Content-Type: application/json

{
  "username": "player1",
  "score": 42
}
```

#### Récupérer le top 10
```http
GET /api/scores/top
```

**Réponse :**
```json
[
  {
    "id": 1,
    "username": "player1",
    "score": 42,
    "createdAt": "2025-11-10T10:30:00"
  }
]
```

## 🎨 Technologies

### Backend
- **Spring Boot 3.5.7** - Framework Java
- **Java 21** - Langage
- **PostgreSQL 16** - Base de données
- **Lombok** - Réduction de boilerplate
- **Spring Security** - Configuration CORS
- **Spring Data JPA** - ORM

### Frontend
- **React 16.8.6** - Framework UI
- **CSS3** - Animations et effets néon
- **Fetch API** - Communication avec le backend

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **Nginx** - Serveur web (production frontend)
- **Maven** - Build backend

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Database
DB_NAME=polysnake
DB_USER=polysnake
DB_PASSWORD=polysnake_secure_password
DB_PORT=5432

# Backend
BACKEND_PORT=8080

# Frontend
FRONTEND_PORT=3000
REACT_APP_API_URL=http://localhost:8080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://polysnake.meowsik.com
```

### Déploiement sur VM distante

1. **Configurer les variables d'environnement** :
```env
REACT_APP_API_URL=https://api.polysnake.meowsik.com
CORS_ALLOWED_ORIGINS=https://polysnake.meowsik.com
```

2. **Lancer avec Docker Compose** :
```bash
docker-compose up -d --build
```

3. **Configurer un reverse proxy (Nginx/Traefik)** pour :
   - `polysnake.meowsik.com` → Frontend (port 3000)
   - `api.polysnake.meowsik.com` → Backend (port 8080)

## 🕹️ Contrôles du jeu

### Flèches directionnelles
- **↑** : Haut
- **↓** : Bas
- **←** : Gauche
- **→** : Droite

### Touches ZQSD
- **Z** : Haut
- **S** : Bas
- **Q** : Gauche
- **D** : Droite

## 📊 Base de données

### Table `scores`

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | Clé primaire |
| username | VARCHAR(50) | Nom du joueur |
| score | INTEGER | Score obtenu |
| created_at | TIMESTAMP | Date de création |

## 🐛 Dépannage

### Le backend ne se connecte pas à PostgreSQL

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Vérifier les logs
docker-compose logs postgres
docker-compose logs backend
```

### Le frontend ne peut pas contacter le backend

Vérifier la variable `REACT_APP_API_URL` dans `.env` et reconstruire :
```bash
docker-compose up -d --build frontend
```

### Erreur CORS

Vérifier que l'origine du frontend est dans `CORS_ALLOWED_ORIGINS` :
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://polysnake.meowsik.com
```

## 📝 License

MIT

## 👨‍💻 Auteur

Axel Frache - [@axelfrache](https://github.com/axelfrache)
