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
  - `PUT /api/task/updateTask` updates an existing task (title, priority, status, and any provided steps) and refreshes the task's last-modified timestamp.

### Data model
`server/db/task_db.js` stores tasks in a SQLite `Tasks` table. Each row represents a single step of a task and includes metadata that ties the steps back to a UID:

| Column | Purpose |
| --- | --- |
| `uid` | Unique integer identifier for a task. |
| `title` | Task title (repeated per step row). |
| `priority` | Numeric priority set by the client. |
| `stepNumber` | Position of the step within the task. |
| `stepValue` | Text for an individual step. |
| `status` | Status string (currently defaults to `Active`). |
| `dateToDisplay` / `dateTimeStamp` | Creation date string and timestamp. |
| `lastModifiedDateToDisplay` / `lastModifiedDateTimeStamp` | Last modified date string and timestamp. |

### Database layer
- `server/db/task_db.js` orchestrates SQLite operations using `better-sqlite3` helpers.
  - `createTaskTable()` ensures the `Tasks` table exists with the columns listed above.
  - `addTaskToDB()` inserts each step row for a task while preserving timestamps and status.
  - `getTask(uid)` and `getAllTasks()` query task records and attach their associated steps.
  - `getMaxUid()` returns the highest UID to issue the next task identifier.
  - `updateStep(uid, stepNumber, stepValue)` updates the text of a single step on a task.
  - `updateTask(data)` updates task-level attributes such as title, priority, status, and last-modified timestamps.
  - `getDatabaseColumns(tableName)` returns the list of columns for a given table, used for schema introspection.

### Request flow
1. The frontend issues Axios calls to the Express API (e.g., `GET /api/task/all`).
2. Express routes delegate to `task_db.js` helpers to read or write SQLite rows.
3. Responses return JSON objects with task metadata and their ordered `steps` arrays (each entry shaped as `{ stepNumber, stepValue }`).

### Process topology
- In Electron, `src/background.js` imports the Express server and starts it inside the Electron lifecycle before creating the browser window. In standalone API mode, `npm run server` invokes `nodemon` with `NODE_ENV=serverTest` to boot the same server.

## Frontend

### Entry points
- `src/main.js` creates the Vue app, registers Vue Router and Vuex, installs Font Awesome icons, and mounts the app root.
- `src/App.vue` renders the router outlet used by the routed task views.

### Routing and state
- `src/routes/router.js` switches between the dashboard, task creation form, and individual task pages. It uses hash history in Electron builds and HTML5 history in the browser.
- `src/store/store.js` composes the Vuex modules that back state shared across components:
  - `newtask.store.js` manages the in-progress task draft, including title, priority, and step objects shaped as `{ id, value }`.
  - `dashboard.store.js` loads aggregated task data for the dashboard table.
  - `task.store.js` holds a selected task's details and step array shaped as `{ stepNumber, stepValue }` for viewing and editing.

### UI stack
- Styling and layout are provided by Bootstrap 5. Icons are supplied by Font Awesome. State management and navigation are handled by Vuex and Vue Router, respectively.

### Component structure
- `src/components/Dashboard/TaskDashboard.vue` is the root dashboard view and uses `TableComponent` to render the task list.
- `src/components/Dashboard/TableComponent.vue` renders the sortable, searchable tasks table and links to task detail routes.
- `src/components/NewTask/NewTaskForm.vue` renders the task creation form and embeds `StepsToTakeComponent` to manage draft steps.
- `src/components/NewTask/FormComponents/StepsToTake/StepsToTakeComponent.vue` maintains the steps draft list (array of `{ id, value }`).
- `src/components/Task/TaskComponent.vue` displays a specific task and mounts `StepsComponent` for its steps.
- `src/components/Task/FormComponents/StepsComponent/StepsComponent.vue` renders and edits persisted steps shaped as `{ stepNumber, stepValue }`.

### Configuration
- `src/config/env_variables.js` centralizes the API host and port (`url` and `port`) used by Axios requests.

## Step data flow
- **Creation (frontend):** `StepsToTakeComponent` builds an array of step objects shaped `{ id, value }` inside the `newTask` Vuex module.
- **API contract:** `POST /api/task/new` receives the steps array and persists each entry as a row with matching `stepNumber` and `stepValue` columns.
- **Retrieval:** `GET /api/task/all` and `GET /api/task?uid=` return tasks with `steps` arrays shaped `{ stepNumber, stepValue }`.
- **Editing:** `task.store.js` manages the `{ stepNumber, stepValue }` array for a selected task; `PUT /api/task/updateTask` updates task metadata and any provided steps via `updateTask`/`updateStep` helpers.

## Electron shell
- `src/background.js` uses `vue-cli-plugin-electron-builder` to manage Electron. It registers the custom `app://` protocol for production builds, starts the Express server on `0.0.0.0:4674`, and loads the Vue application URL (dev server in development, packaged files in production). The script also installs Vue DevTools during development.

## Running the system
1. Install dependencies with `npm install`.
2. For web development, run `npm run serve` and (optionally) `npm run server` to start the API separately.
3. For desktop development, run `npm run electron:serve` to launch Electron with the embedded API.
4. Build artifacts with `npm run build` (web) or `npm run electron:build` (desktop).
