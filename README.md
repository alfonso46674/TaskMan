# TaskMan

TaskMan is a Vue 3 + Electron desktop application with an Express/SQLite backend for managing personal tasks. Users can create tasks with titles, priorities, and step-by-step checklists while keeping timestamps for creation and last modification. The project demonstrates how to combine a Vue front end, an Electron shell, and a lightweight Express API backed by `better-sqlite3`.

## Purpose and features
- Create tasks with titles, priority values, and ordered steps stored in SQLite.
- Track creation and last-modified timestamps for every task.
- Fetch all tasks or a single task by UID through the Express API.
- Run the Vue experience as a web app or as an Electron-packaged desktop app.

## Tech stack
- **Frontend:** Vue 3 SPA with Vue Router, Vuex state management, Bootstrap 5 for styling, and Font Awesome icons. HTTP is handled with Axios.
- **Backend:** Express with CORS and JSON parsing. Routes live under `server/router`, and persistence uses `better-sqlite3` in `server/db`.
- **Desktop shell:** Electron via `vue-cli-plugin-electron-builder`, with `src/background.js` booting the API server and loading the Vue app.

## Repository layout
- `src/` – Vue app entry points, router, store, and components.
- `server/` – Express server (`server.js`), routers, and SQLite helpers (`db/task_db.js`).
- `public/` – Static assets packaged with the Vue app.
- `vue.config.js` – Electron Builder configuration and dev server tweaks.
- `background.js` – Alias to `src/background.js` used by Electron Builder.

## Quick start

### Prerequisites
- Node.js 14+ and npm.

### Install dependencies
```bash
npm install
```

### Run the Vue dev server
```bash
npm run serve
```
The app will be served by `vue-cli-service` with hot module replacement.

### Run the Express API locally
```bash
npm run server
```
This starts `server/server.js` with `nodemon`, exposing the task routes at `http://localhost:4674/api/task`.

### Run the Electron app in development
```bash
npm run electron:serve
```
This launches Electron with the Vue dev server and starts the embedded Express API from `background.js`.

### Build for production (web)
```bash
npm run build
```
Builds the Vue frontend for static deployment.

### Build the Electron desktop app
```bash
npm run electron:build
```
Packages the application as a desktop binary and starts the bundled Express server when launched.

### Lint
```bash
npm run lint
```

## Architecture overview
See [ARCHITECTURE.md](ARCHITECTURE.md) for details on the backend, frontend, and data flow.
