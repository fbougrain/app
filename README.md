Application de Notes Collaboratives
Une application web moderne de prise de notes collaborative construite avec Next.js, PostgreSQL et Docker. Cette application permet aux utilisateurs de créer, éditer, partager et collaborer sur des notes en temps réel.

🚀 Fonctionnalités
Authentification sécurisée : Système d'inscription et de connexion avec JWT
Gestion des notes : Créer, éditer, visualiser et supprimer des notes
Collaboration : Partager des notes avec d'autres utilisateurs
Partage public : Générer des liens publics pour partager des notes
Interface responsive : Fonctionne parfaitement sur desktop et mobile
Thème sombre/clair : Interface adaptable selon les préférences
Base de données PostgreSQL : Stockage fiable et performant
Containerisation Docker : Déploiement facile et reproductible
📋 Prérequis
Option 1 : Avec Docker (Recommandé)
Docker
Docker Compose
Option 2 : Développement local
Node.js 18+
PostgreSQL 13+
npm ou yarn
🛠️ Installation
Méthode 1 : Avec Docker
Cloner le projet

git clone <url-du-repo>
cd collaborativenotesapp
Lancer avec Docker Compose

docker-compose up --build
Accéder à l'application

Application : http://localhost:3000
Admin base de données : http://localhost:8080
Méthode 2 : Développement local
Installer les dépendances

npm install
Configurer les variables d'environnement

Créer un fichier .env.local à la racine :

DATABASE_URL=postgresql://notes_user:notes_password@localhost:5432/notes_db
JWT_SECRET=votre-clé-secrète-jwt-très-sécurisée
Configurer PostgreSQL

# Créer la base de données et l'utilisateur
psql -U postgres -c "CREATE DATABASE notes_db;"
psql -U postgres -c "CREATE USER notes_user WITH PASSWORD 'notes_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE notes_db TO notes_user;"

# Exécuter les scripts de base de données
psql -U notes_user -d notes_db -f scripts/create-database.sql
psql -U notes_user -d notes_db -f scripts/seed-database.sql
Lancer le serveur de développement

npm run dev
🎯 Utilisation
Première connexion
Accédez à http://localhost:3000
Cliquez sur "S'inscrire" pour créer un compte
Connectez-vous avec vos identifiants
Commencez à créer vos premières notes !
Fonctionnalités principales
Tableau de bord : Vue d'ensemble de toutes vos notes
Créer une note : Bouton "+" pour ajouter une nouvelle note
Éditer : Cliquez sur une note pour l'éditer
Partager : Utilisez le bouton de partage pour collaborer
Liens publics : Générez des liens accessibles sans connexion
📁 Structure du projet
collaborativenotesapp/
├── app/                    # Pages et API routes (App Router)
│   ├── api/               # Routes API
│   │   ├── auth/         # Authentification
│   │   ├── notes/        # Gestion des notes
│   │   └── public/       # Accès public
│   ├── auth/             # Pages d'authentification
│   ├── dashboard/        # Tableau de bord
│   ├── notes/            # Pages des notes
│   └── public/           # Pages publiques
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants UI (shadcn/ui)
│   ├── note-card.tsx     # Carte de note
│   ├── share-dialog.tsx  # Dialog de partage
│   └── theme-provider.tsx # Fournisseur de thème
├── hooks/                # Hooks React personnalisés
├── lib/                  # Utilitaires et helpers
├── scripts/              # Scripts de base de données
├── styles/               # Styles CSS globaux
├── docker-compose.yml    # Configuration Docker
├── Dockerfile           # Image Docker
└── README.md            # Ce fichier
🔧 Scripts disponibles
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
🐳 Commandes Docker
# Lancer les services
docker-compose up

# Lancer en arrière-plan
docker-compose up -d

# Reconstruire les images
docker-compose up --build

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f
🗄️ Administration de la base de données
Avec Docker, accédez à Adminer sur http://localhost:8080 :

Système : PostgreSQL
Serveur : postgres
Utilisateur : notes_user
Mot de passe : notes_password
Base de données : notes_db
🔒 Sécurité
Authentification JWT sécurisée
Validation des données côté serveur
Protection CSRF
Hashage des mots de passe avec bcrypt
Variables d'environnement pour les secrets
🚀 Déploiement
Vercel (Recommandé)
Connectez votre repo GitHub à Vercel
Configurez les variables d'environnement
Déployez automatiquement
Docker en production
# Build pour la production
docker build -t notes-app .

# Lancer le conteneur
docker run -p 3000:3000 notes-app
🛠️ Technologies utilisées
Frontend : Next.js 14, React, TypeScript
Styling : Tailwind CSS, shadcn/ui
Backend : Next.js API Routes
Base de données : PostgreSQL
Authentification : JWT
Containerisation : Docker, Docker Compose
ORM : SQL natif avec pg
🤝 Contribution
Forkez le projet
Créez une branche pour votre fonctionnalité (git checkout -b feature/AmazingFeature)
Committez vos changements (git commit -m 'Add some AmazingFeature')
Poussez vers la branche (git push origin feature/AmazingFeature)
Ouvrez une Pull Request
📝 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

🐛 Résolution de problèmes
Problèmes courants
Port déjà utilisé

# Vérifier les ports utilisés
lsof -i :3000
lsof -i :5432

# Arrêter les processus si nécessaire
kill -9 <PID>
Problème de connexion à la base de données

Vérifiez que PostgreSQL est démarré
Vérifiez les variables d'environnement
Vérifiez les permissions utilisateur
Erreurs Docker

# Nettoyer les conteneurs
docker-compose down
docker system prune

# Reconstruire complètement
docker-compose up --build --force-recreate
📞 Support
Pour toute question ou problème :

Ouvrez une issue sur GitHub
Consultez la documentation
Vérifiez les logs avec docker-compose logs
Développé avec ❤️ en utilisant Next.js et PostgreSQL
