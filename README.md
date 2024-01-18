### Prérequis ⚠️

Outils nécessaires au démarrage :

- [Docker](https://docs.docker.com/engine/install/)
- [Node.js](https://nodejs.org/en)
- [GIT](https://git-scm.com/)

Note: S'assurer d'avoir `Docker Compose` au moins à la version `v2.22`.

```zsh
docker-compose --version
```

### Cloner le dépôt 🧬

```zsh
git clone https://github.com/davso11/kanban-board.git
```

### Variables d'environnement

Créer un fichier `.env` dans les dossiers `api/` et `web/` et renseigner les champs suivant :

#### Dossier `api/`

```
MYSQL_USER=""
MYSQL_PORT=""
MYSQL_ROOT_PASSWORD=""
MYSQL_DATABASE=""
DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_ROOT_PASSWORD}@127.0.0.1:${MYSQL_PORT}/${MYSQL_DATABASE}"
```

#### Dossier `web/`

```
VITE_API_BASE_URL=""
```

### Démarrage des serveurs en mode développement 🚀

```zsh
npm run dev
```

### Synchroniser le schema prisma et la base de données

Se déplacer dans le dossier `api/` et exécuter la commande suivante :

```zsh
npm run db:push
```
