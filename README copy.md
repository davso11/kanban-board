### Prérequis ⚠️

Outils nécessaires au démarrage :

- [Docker](https://docs.docker.com/engine/install/)
- [Node.js](https://nodejs.org/en)
- [GIT](https://git-scm.com/)

### Cloner le dépôt 🧬

```zsh
git clone https://github.com/davso11/kanban-board.git
```

### Variables d'environnement

Créer 03 fichiers `.env`. Un à la racine et un autre dans les dossiers `api/` et `web/` et renseigner les champs suivant :

#### A la racine

```
MYSQL_PORT="3306"
MYSQL_ROOT_PASSWORD="root"
MYSQL_DATABASE="kanban-board"

API_PORT="3000"
NODE_ENV="development"

WEB_PORT="5173"
```

#### Dossier `api/`

```
DATABASE_URL=""
```

#### Dossier `web/`

```
VITE_API_BASE_URL=""
```

### Démarrage des serveurs en mode développement 🚀

```zsh
npm run start
```
