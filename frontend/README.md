# 🐍 Snake Game - Version Néon

Un jeu Snake moderne avec une esthétique néon vert/cyan et des effets visuels.

## 🎮 Fonctionnalités

- Contrôles au clavier (flèches directionnelles)
- Affichage du score en temps réel
- Design moderne avec effets néon
- Animation pulsante pour la nourriture
- Interface responsive

## 🚀 Lancement avec Docker

### Prérequis
- Docker
- Docker Compose

### Construction et lancement

```bash
# Construire et lancer le conteneur
docker-compose up -d

# Ou avec rebuild
docker-compose up -d --build
```

Le jeu sera accessible sur : **http://localhost:3000**

### Arrêter le conteneur

```bash
docker-compose down
```

## 💻 Développement local

### Prérequis
- Node.js (version 16+)
- npm

### Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm start
```

Le jeu sera accessible sur : **http://localhost:3000**

### Build de production

```bash
npm run build
```

## 🎨 Thème visuel

- **Fond** : Dégradé violet/bleu foncé
- **Serpent** : Dégradé vert néon vers cyan avec effet lumineux
- **Nourriture** : Rose/magenta avec animation pulsante
- **Bordures** : Vert néon avec ombre lumineuse
- **Score** : Texte vert néon avec effet de lueur

## 🕹️ Contrôles

### Flèches directionnelles
- **Flèche Haut** : Déplacer vers le haut
- **Flèche Bas** : Déplacer vers le bas
- **Flèche Gauche** : Déplacer vers la gauche
- **Flèche Droite** : Déplacer vers la droite

### Touches ZQSD
- **Z** : Déplacer vers le haut
- **S** : Déplacer vers le bas
- **Q** : Déplacer vers la gauche
- **D** : Déplacer vers la droite

## 📦 Structure Docker

- **Dockerfile** : Build multi-stage avec Node.js et Nginx
- **docker-compose.yml** : Configuration du service
- **.dockerignore** : Fichiers exclus du build

## 🔧 Technologies

- React 16.8.6
- Docker & Docker Compose
- Nginx (pour la production)
- CSS3 (animations et effets)
