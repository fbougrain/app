# Application de Gestion de Notes Collaboratives

Une application web moderne pour créer, organiser et partager des notes avec support Markdown, authentification JWT, et fonctionnalités collaboratives.

## 🚀 Fonctionnalités

### Authentification
- Inscription et connexion sécurisées
- Authentification JWT avec tokens persistants
- Gestion des sessions utilisateur

### Gestion des Notes
- ✅ Création, modification et suppression de notes
- ✅ Support complet du Markdown
- ✅ Système de tags pour l'organisation
- ✅ Trois niveaux de visibilité :
  - 🔒 **Privé** : Visible par vous uniquement
  - 👥 **Partagé** : Partagé avec des utilisateurs spécifiques
  - 🌍 **Public** : Accessible via lien public

### Recherche et Filtrage
- Recherche par titre, contenu ou tags
- Filtrage par statut de visibilité
- Interface avec onglets pour navigation rapide

### Partage Collaboratif
- Partage de notes avec d'autres utilisateurs par email
- Génération de liens publics avec tokens uniques
- Gestion des permissions de partage

### Interface Utilisateur
- Design responsive (desktop/mobile)
- Éditeur Markdown avec aperçu en temps réel
- Notifications de succès/erreur
- Interface moderne avec Tailwind CSS

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI modernes
- **Lucide React** - Icônes

### Backend
- **Next.js API Routes** - API REST intégrée
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage des mots de passe
- **UUID** - Génération d'identifiants uniques

### Base de Données
- **PostgreSQL** - Base de données relationnelle (production)
- **Simulation en mémoire** - Pour la démo (développement)

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Docker et Docker Compose (pour la version conteneurisée)

### Installation locale

1. **Cloner le repository**
   \`\`\`bash
   git clone <repository-url>
   cd collaborative-notes-app
   \`\`\`

2. **Installer les dépendances**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurer les variables d'environnement**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Modifier le fichier \`.env.local\` :
   \`\`\`
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   DATABASE_URL=postgresql://username:password@localhost:5432/notes_db
   \`\`\`

4. **Lancer l'application**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Accéder à l'application**
   Ouvrir [http://localhost:3000](http://localhost:3000)

### Installation avec Docker

1. **Lancer avec Docker Compose**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Accéder aux services**
   - Application : [http://localhost:3000](http://localhost:3000)
   - Adminer (DB admin) : [http://localhost:8080](http://localhost:8080)

## 🗄️ Base de Données

### Configuration PostgreSQL

1. **Créer la base de données**
   \`\`\`bash
   psql -U postgres -c "CREATE DATABASE notes_db;"
   \`\`\`

2. **Exécuter les scripts de création**
   \`\`\`bash
   psql -U postgres -d notes_db -f scripts/create-database.sql
   psql -U postgres -d notes_db -f scripts/seed-database.sql
   \`\`\`

### Structure des Tables

- **users** : Informations des utilisateurs
- **notes** : Contenu des notes avec métadonnées
- **note_shares** : Relations de partage entre notes et utilisateurs

## 🧪 Tests

### Comptes de test
Après avoir exécuté le script de seed :

- **Email** : alice@example.com | **Mot de passe** : password123
- **Email** : bob@example.com | **Mot de passe** : password123  
- **Email** : claire@example.com | **Mot de passe** : password123

### Scénarios de test

1. **Authentification**
   - Inscription d'un nouvel utilisateur
   - Connexion avec les comptes existants
   - Gestion des erreurs (email déjà utilisé, mot de passe incorrect)

2. **Gestion des notes**
   - Création d'une note avec Markdown
   - Modification et suppression
   - Ajout et suppression de tags

3. **Partage**
   - Partage d'une note avec un autre utilisateur
   - Génération d'un lien public
   - Test d'accès aux notes partagées

4. **Recherche**
   - Recherche par titre, contenu et tags
   - Filtrage par statut de visibilité

## 🚀 Déploiement

### Variables d'environnement de production

\`\`\`bash
NODE_ENV=production
JWT_SECRET=your-super-secure-secret-key
DATABASE_URL=postgresql://user:password@host:port/database
\`\`\`

### Commandes de build

\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 Structure du Projet

\`\`\`
collaborative-notes-app/
├── app/                          # Pages et API routes (App Router)
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentification
│   │   ├── notes/                # CRUD des notes
│   │   └── public/               # Accès public aux notes
│   ├── auth/                     # Pages d'authentification
│   ├── dashboard/                # Tableau de bord principal
│   ├── notes/                    # Pages de gestion des notes
│   └── public/                   # Pages publiques
├── components/                   # Composants réutilisables
│   ├── ui/                       # Composants UI de base (shadcn)
│   ├── note-card.tsx            # Carte d'affichage des notes
│   └── share-dialog.tsx         # Dialog de partage
├── scripts/                      # Scripts SQL
│   ├── create-database.sql      # Création des tables
│   └── seed-database.sql        # Données de test
├── docker-compose.yml           # Configuration Docker
├── Dockerfile                   # Image Docker de l'app
└── README.md                    # Documentation
\`\`\`

## 🔧 API Endpoints

### Authentification
- \`POST /api/auth/register\` - Inscription
- \`POST /api/auth/login\` - Connexion

### Notes
- \`GET /api/notes\` - Liste des notes de l'utilisateur
- \`POST /api/notes\` - Créer une note
- \`GET /api/notes/[id]\` - Récupérer une note
- \`PUT /api/notes/[id]\` - Modifier une note
- \`DELETE /api/notes/[id]\` - Supprimer une note

### Partage
- \`POST /api/notes/[id]/share\` - Partager avec un utilisateur
- \`DELETE /api/notes/[id]/share\` - Supprimer un partage
- \`POST /api/notes/[id]/public\` - Rendre public
- \`DELETE /api/notes/[id]/public\` - Supprimer le lien public

### Public
- \`GET /api/public/[token]\` - Accéder à une note publique

## 🔒 Sécurité

- Authentification JWT avec expiration
- Hachage des mots de passe avec bcrypt
- Validation des permissions sur toutes les routes
- Protection CSRF intégrée à Next.js
- Validation des entrées utilisateur

## 🎯 Fonctionnalités Avancées

- **Markdown** : Support complet avec aperçu en temps réel
- **Responsive** : Interface adaptée mobile et desktop  
- **Recherche** : Recherche full-text dans titre, contenu et tags
- **Partage** : Système de permissions granulaire
- **Notifications** : Feedback utilisateur avec toasts
- **Accessibilité** : Respect des standards WCAG

## 📝 Licence

Ce projet est développé dans le cadre d'un exercice technique.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit les changements (\`git commit -m 'Add some AmazingFeature'\`)
4. Push vers la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, créer une issue sur le repository GitHub.
\`\`\`
