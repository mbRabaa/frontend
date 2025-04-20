# Étape 1 : Construire l'application
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Créer l'image finale avec Nginx
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 (par défaut utilisé par Nginx)
EXPOSE 80

# Lancer Nginx pour servir l'application
CMD ["nginx", "-g", "daemon off;"]
