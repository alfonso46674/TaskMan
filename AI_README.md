# AI README

This guide orients AI assistants and contributors to TaskMan's structure, data flow, and conventions so you can make safe, fast changes.

## Repository Overview
TaskMan is a desktop-focused task manager that pairs a Vue 3 SPA with an Electron wrapper and an Express API backed by a SQLite database. The Electron shell starts the API locally and loads the Vue UI; the same API can run standalone for web development.

## Technology Stack
- **Runtime:** Node.js (Electron-powered desktop build) and browser for the Vue SPA
- **Frontend:** Vue 3, Vue Router, Vuex, Vuetify (nightly), Bootstrap 5, Font Awesome, Lodash
- **Backend:** Express 4 with CORS and body parsing middleware
- **Database:** SQLite via `better-sqlite3`
- **Desktop shell:** Electron (managed through `vue-cli-plugin-electron-builder`)
- **Build tooling:** Vue CLI 5, Babel, ESLint, `cross-env`, `nodemon`

## Code Organization
- **Frontend root:** `src/`
  - `main.js` bootstraps Vue, router, store, icons.
  - `App.vue` hosts the router view.
  - `routes/router.js` defines dashboard (`/`), new task (`/newTask`), and task detail (`/task/:id`) routes.
  - `store/` contains Vuex modules: `newtask.store.js`, `dashboard.store.js`, `task.store.js`, composed in `store.js`.
  - `components/` holds routed views and form components (see Component hierarchy below).
  - `config/env_variables.js` centralizes API host/port (`url`, `port`).
- **Backend root:** `server/`
  - `server.js` builds the Express app, applies middleware, mounts the router, and exposes `/test`.
  - `router/index.js` mounts task routes at `/api/task`.
  - `router/task.js` implements task CRUD endpoints.
  - `db/task_db.js` handles all SQLite access and schema creation via `better-sqlite3` helpers.
- **Desktop shell:** `src/background.js` launches the Express server and loads the UI for Electron builds.

## Data Flow
1. **Draft creation:** `StepsToTakeComponent` (Vue) builds an array of `{ id, value }` step objects in the `newTask` Vuex module.
2. **Submission:** `newTask` dispatches `POST /api/task/new`, which maps `{ id, value }` to database columns `stepNumber` and `stepValue` per row.
3. **Persistence:** `task_db.js` writes rows to the `Tasks` table; one row per step with shared task metadata.
4. **Retrieval:** Dashboard fetches `GET /api/task/all`; task view fetches `GET /api/task?uid=`. Both return `steps` arrays shaped `{ stepNumber, stepValue }`.
5. **Editing:** `task.store.js` manages the current task. `StepsComponent` edits steps; updates go through `PUT /api/task/updateTask`, which calls `updateTask` and `updateStep` helpers.
6. **Display:** Dashboard tables and task detail components render Vuex-backed state, keeping UI and DB aligned.

## Component Hierarchy and Responsibilities
- **Dashboard:**
  - `TaskDashboard.vue` (routed) loads dashboard data.
  - `TableComponent.vue` renders sortable/searchable table and links to task detail.
- **Task creation:**
  - `NewTaskForm.vue` (routed) collects title/priority and embeds steps.
  - `FormComponents/StepsToTake/StepsToTakeComponent.vue` manages dynamic draft steps (`{ id, value }`).
- **Task detail:**
  - `TaskComponent.vue` (routed) displays task metadata and steps.
  - `FormComponents/StepsComponent/StepsComponent.vue` edits persisted steps (`{ stepNumber, stepValue }`).

## Vuex Store Architecture
- **`newtask.store.js`:** Holds draft fields (`title`, `priority`, `steps`), exposes `currentNumberOfSteps`, and posts new tasks via Axios.
- **`dashboard.store.js`:** Fetches task list for the dashboard (`getTasksData`) and exposes it via `currentTaskData`.
- **`task.store.js`:** Holds a selected task, exposes `steps` and `currentNumberOfSteps`, and provides mutations to add/remove/edit steps client-side.
- **Composition:** `store/store.js` registers all modules for app-wide use.

## Backend API Surface
- `GET /api/task/all` — fetch all tasks with steps.
- `GET /api/task?uid=:uid` — fetch a single task by UID.
- `POST /api/task/new` — create a task (expects `{ title, priority, steps: [{ id, value }] }`).
- `PUT /api/task/updateTask` — update task metadata and optional steps (uses `{ uid, title, priority, status, steps?: [{ stepNumber, stepValue }] }`).

## Database Schema & Helpers
- **Table:** `Tasks` with columns `uid`, `title`, `priority`, `stepNumber`, `stepValue`, `status`, `dateToDisplay`, `dateTimeStamp`, `lastModifiedDateToDisplay`, `lastModifiedDateTimeStamp`.
- **Helpers in `task_db.js`:**
  - `createTaskTable()` ensures the table exists.
  - `addTaskToDB(task)` writes each step as a row.
  - `getTask(uid)` and `getAllTasks()` read tasks and attach `steps` arrays.
  - `getMaxUid()` returns the highest UID to generate the next.
  - `updateTask(data)` updates task-level fields and timestamps.
  - `updateStep(uid, stepNumber, stepValue)` updates individual step text.
  - `getDatabaseColumns(tableName)` introspects schema columns.

## Development Guidelines
- Prefer Vue 3 composition API patterns already used in components.
- Keep step objects consistent: `{ id, value }` on draft flows (`newTask`), `{ stepNumber, stepValue }` on persisted flows (`task`).
- Update `env_variables.js` instead of hardcoding URLs in stores or components.
- Follow existing mutation/action naming (`set*`, `add*`, `remove*`, `edit*`) when extending stores.
- Keep API contracts aligned with database schema; adjust both when introducing new fields.

## Integration Guidelines
- When adding new endpoints, register them under `server/router/index.js` and document the contract.
- Add Vuex state slices for new views so components remain thin and declarative.
- Reuse shared config (`env_variables.js`) for HTTP calls to avoid environment drift.
- For new components, co-locate subcomponents under feature folders (e.g., `components/Task/FormComponents`).

## Testing Strategy
- Manual verification via running both the API (`npm run server`) and UI (`npm run serve` or `npm run electron:serve`).
- No automated test suite is present; validate flows by creating/updating tasks and confirming persisted steps match expectations.
- Linting is available via `npm run lint` (ESLint + Vue3 essential rules).

## Common Patterns
- **Axios data loading:** actions dispatch Axios calls, then commit mutations (`dashboard.getTasksData`, `task.getTaskById`).
- **Step editing:** components emit mutations directly for immediate Vuex updates (`editStepObject`, `addStepObject`, `removeStepObject`).
- **Timestamping:** backend sets creation and last-modified fields in `task_db.js` during create/update.

## Troubleshooting
- **API unreachable:** ensure `npm run server` is running (listens on `0.0.0.0:4674`) and `env_variables.js` points to the same host/port.
- **Missing tasks/steps:** confirm the `Tasks` table exists (`createTaskTable()` is called inside `POST /api/task/new`). Use `getDatabaseColumns('Tasks')` for quick schema checks.
- **CORS errors:** verify the API is started with CORS enabled (`server.js` applies `cors()` globally).
- **Electron devtools missing:** reinstall via `vue-cli-plugin-electron-builder` devtools setup in `background.js`.

## Deployment Process
- **Web:** `npm run build` produces static assets. Serve them with your preferred web server; configure the API host/port accordingly.
- **Desktop:** `npm run electron:build` packages the Electron app. The build bundles the Express server and SQLite access, exposing the same API at runtime.
