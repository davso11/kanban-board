### Prérequis ⚠️

Outils nécessaires au démarrage :

- [GIT](https://git-scm.com/)
- [Docker](https://docs.docker.com/engine/install/)

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

### Démarrage du serveur de développement 🚀

```zsh
docker-compose up [-d] [--build]
```

Synchroniser le schema prisma et la base de données

```zsh
pnpm db:push
```
