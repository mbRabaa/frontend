# Étape de build
FROM node:18 AS builder
WORKDIR /app

# 1. Copie des fichiers de dépendances 
COPY package*.json ./

# 2. Installation des dépendances Y COMPRIS les devDependencies
RUN npm install --include=dev

# 3. Copie du reste du code source
COPY . .

# 4. Construction de l'application
RUN npm run build

# Étape de production
FROM nginx:alpine

# 5. Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 6. Copie des fichiers construits depuis le builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]