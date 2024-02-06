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
DATABASE_URL=""
```

#### Dossier `web/`

```
VITE_API_BASE_URL=""
```

### Démarrage des serveurs en mode développement 🚀

```zsh
npm run dev
```
