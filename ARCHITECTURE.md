# TaskMan Architecture

TaskMan combines a Vue 3 front end with an Electron shell and a lightweight Express API backed by `better-sqlite3`. This document explains the key modules, data flow, and how the pieces fit together.

## Overview
- **Frontend:** Vue single-page application that renders task views and communicates with the API via Axios.
- **Backend:** Express server exposing task routes under `/api/task`, persisting data to an on-disk SQLite database.
- **Desktop shell:** Electron starts the Express server and loads the Vue app, enabling an all-in-one desktop experience.

## Backend

### Server setup
- `server/server.js` configures Express with JSON parsing, URL encoding, and CORS, then mounts the router tree. A simple health endpoint (`/test`) is available for connectivity checks. The server listens when `NODE_ENV` is set to `serverTest` or when started from Electron.

### Routing
- `server/router/index.js` registers the task routes at `/api/task`.
- `server/router/task.js` implements the task endpoints:
  - `GET /api/task/all` returns all tasks.
  - `GET /api/task?uid=:uid` returns a specific task.
  - `POST /api/task/new` creates a task with a UID, title, priority, steps array, status, and timestamps.

### Data model
`server/db/task_db.js` stores tasks in a SQLite `Tasks` table. Each row represents a step on a task and includes metadata that ties the steps back to a single UID:

| Column | Purpose |
| --- | --- |
| `uid` | Unique integer identifier for a task. |
| `title` | Task title (repeated per step row). |
| `priority` | Numeric priority set by the client. |
| `step` | Text for an individual step. |
| `status` | Status string (currently defaults to `Active`). |
| `dateToDisplay` / `dateTimeStamp` | Creation date string and timestamp. |
| `lastModifiedDateToDisplay` / `lastModifiedDateTimeStamp` | Last modified date string and timestamp. |

### Database layer
- `server/db/task_db.js` orchestrates SQLite operations using `better-sqlite3` helpers.
  - `createTaskTable()` ensures the `Tasks` table exists with columns for UIDs, metadata, and individual steps.
  - `addTaskToDB()` inserts each step row for a task while preserving timestamps and status.
  - `getTask(uid)` and `getAllTasks()` query task records and attach their associated steps.
  - `getMaxUid()` returns the highest UID to issue the next task identifier.

### Request flow
1. The frontend issues Axios calls to the Express API (e.g., `GET /api/task/all`).
2. Express routes delegate to `task_db.js` helpers to read or write SQLite rows.
3. Responses return JSON objects with task metadata and their ordered `steps` arrays.

### Process topology
- In Electron, `src/background.js` imports the Express server and starts it inside the Electron lifecycle before creating the browser window. In standalone API mode, `npm run server` invokes `nodemon` with `NODE_ENV=serverTest` to boot the same server.

## Frontend

### Entry points
- `src/main.js` creates the Vue app, registers Vue Router and Vuex, installs Font Awesome icons, and mounts the app root.
- `src/App.vue` renders the router outlet used by the routed task views.

### Routing and state
- `src/routes/router.js` switches between the dashboard, task creation form, and individual task pages. It uses hash history in Electron builds and HTML5 history in the browser.
- `src/store/store.js` provides the Vuex store that backs state shared across components.

### UI stack
- Styling and layout are provided by Bootstrap 5. Icons are supplied by Font Awesome. State management and navigation are handled by Vuex and Vue Router, respectively.

## Electron shell
- `src/background.js` uses `vue-cli-plugin-electron-builder` to manage Electron. It registers the custom `app://` protocol for production builds, starts the Express server on `0.0.0.0:4674`, and loads the Vue application URL (dev server in development, packaged files in production). The script also installs Vue DevTools during development.

## Running the system
1. Install dependencies with `npm install`.
2. For web development, run `npm run serve` and (optionally) `npm run server` to start the API separately.
3. For desktop development, run `npm run electron:serve` to launch Electron with the embedded API.
4. Build artifacts with `npm run build` (web) or `npm run electron:build` (desktop).
