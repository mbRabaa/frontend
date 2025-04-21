
# TunisBus - Application de Réservation de Billets de Bus

## Description du Projet

TunisBus est une application web permettant aux utilisateurs de réserver des billets de bus en ligne pour leurs voyages à travers la Tunisie. L'application est conçue selon une architecture microservices pour une meilleure évolutivité et maintenance.

## Architecture Microservices

Le projet est organisé selon l'architecture microservices suivante:

```
tunisbus-voyage-microservices/
├── frontend/                 # Application frontend React
├── microservice-reservation/ # Microservice pour la gestion des réservations
│   ├── backend/              # Backend Node.js
│   └── database/             # Base de données PostgreSQL
├── microservice-paiement/    # Microservice pour la gestion des paiements
│   ├── backend/              # Backend Node.js
│   └── database/             # Base de données PostgreSQL
└── api-gateway/              # API Gateway pour la communication entre les services
```

### Frontend

Le frontend est développé avec React, TypeScript et Tailwind CSS. Il offre une interface utilisateur intuitive pour:
- Rechercher des trajets disponibles
- Effectuer des réservations
- Gérer les paiements
- Consulter les informations sur les services

### Microservice Réservation

Ce microservice gère:
- La création de nouvelles réservations
- La modification des réservations existantes
- L'annulation des réservations
- La consultation des détails des trajets disponibles

### Microservice Paiement

Ce microservice s'occupe de:
- Traiter les paiements par carte bancaire
- Gérer les virements bancaires
- Émettre des confirmations de paiement
- Gérer les remboursements en cas d'annulation

### API Gateway

L'API Gateway sert de point d'entrée unique pour toutes les requêtes clients et se charge de:
- Router les requêtes vers les microservices appropriés
- Gérer l'authentification et l'autorisation
- Assurer la communication entre les différents microservices

## Fonctionnalités Principales

- **Recherche de Trajets**: Recherche par origine, destination et date
- **Réservation de Billets**: Formulaire simple pour réserver un ou plusieurs sièges
- **Paiement en Ligne**: Options de paiement sécurisées (carte de crédit, carte de débit, virement)
- **Gestion des Réservations**: Possibilité de consulter, modifier ou annuler des réservations
- **Interface Multilingue**: Support pour le français, l'anglais et l'arabe

## Installation et Exécution

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Microservice Réservation

```bash
cd microservice-reservation/backend
npm install
npm start
```

### Microservice Paiement

```bash
cd microservice-paiement/backend
npm install
npm start
```

### API Gateway

```bash
cd api-gateway
npm install
npm start
```

## Déploiement avec Docker

```bash
docker-compose up --build
```

## Technologies Utilisées

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Base de données**: PostgreSQL
- **Conteneurisation**: Docker
- **API Gateway**: Express Gateway

## Contribution

Les contributions sont les bienvenues. Veuillez consulter le guide de contribution avant de soumettre une pull request.

## Licence

[Spécifiez votre licence]
```
"# frontend" 
