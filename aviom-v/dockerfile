# Étape 1 : Utiliser une image officielle de Node.js
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /usr/src

# Copier uniquement package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances sans générer de fichiers inutiles
RUN npm install

# Copier tout le projet
COPY . .

# Construire l'application React avec Vite
RUN npm run build

# Étape 2 : Utiliser une image plus légère pour l'exécution
FROM node:18-alpine

WORKDIR /usr/src

# Copier uniquement le build final de Vite (le répertoire dist)
COPY --from=builder /usr/src/dist ./dist

# Installer un serveur web léger (serve)
RUN npm install -g serve

# Exposer le port 5173 pour l'application
EXPOSE 5173

# Lancer l'application avec Serve
CMD ["serve", "-s", "dist", "-l", "5173"]
