# Implementation Plan

**Goal**: Add a secure admin backend to the existing learning platform without breaking existing functionality.

## User Review Required

- **Admin credentials**: We have received an admin email (`muhammadziyomashrabjonov544@gmail.com`). We need a password for the admin account. Do you want to use a default password (e.g., `admin123`) or provide a custom one?
- **Publish/Unpublish workflow**: Confirm whether the `published` flag should be a boolean column in the `courses`, `lessons`, and `tests` tables, and whether unpublished items should be hidden from the public UI.

## Open Questions

> [!IMPORTANT] 
> 1. **Admin password** – Please provide a password or confirm using a temporary default.
> 2. **Database location** – The current SQLite file is `server/database.sqlite`. Should we keep the same path after migration?
> 3. **Backup strategy** – Do you want the backup file to be named `database.backup.sqlite` in the same folder?

## Proposed Changes

---
### 1. Backup & Migration
- **[NEW]** `server/backup.cjs` – Script that copies `database.sqlite` to a timestamped backup before running migration.
- **[MODIFY]** `server/migrate.cjs` – Updated to read from the existing `script.js` (already done) and insert data into SQLite tables (`admins`, `courses`, `topics`, `exercises`, etc.).
- **[NEW]** `server/db.cjs` – Helper to initialise SQLite, create tables if missing, and expose `db` instance.
- **[NEW]** `server/migrate.test.cjs` – Simple test that runs the migration and logs row counts before/after.

---
### 2. Admin Authentication & Protected Routes
- **[NEW]** `server/auth.cjs` – Express middleware for session‑based login, password hashing with `bcrypt`, and `requireAdmin` guard.
- **[MODIFY]** `server/server.cjs` – Add routes:
  - `POST /api/admin/login` – Returns a session cookie.
  - `POST /api/admin/logout`.
  - CRUD endpoints under `/api/admin/courses`, `/api/admin/lessons`, `/api/admin/tests` protected by `requireAdmin`.
- **[NEW]** `server/middleware/cors.cjs` – Enable CORS for the frontend.

---
### 3. Admin Panel UI (frontend)
- **[NEW]** `src/admin/` – React (or vanilla) components for login, dashboard, course/lesson/test editor.
- Re‑use existing CSS tokens; add a responsive admin layout with a side navigation drawer.
- Forms will POST JSON to the new protected API endpoints.
- Add a visual form for test questions (question, options, correct answer) with add/edit/delete actions.

---
### 4. Integration with Existing Frontend
- Add a conditional check for `admin` flag in the main UI: when an admin is logged in, show an “Admin Panel” button linking to `/admin.html`.
- Ensure existing routes (`npm run dev`, `npm run build`) still serve the public site unchanged.

---
### 5. Verification Plan
- **Automated**: Run `node server/backup.cjs && node server/migrate.cjs && node server/migrate.test.cjs` – verify row counts before/after.
- **Manual**: Start the server (`npm run dev`), open `/admin.html`, log in with the provided email and password, create a new lesson via the UI, then refresh the public page to confirm the new lesson appears.
- **Safety**: Backup file is never overwritten; migration is idempotent (uses `INSERT OR REPLACE`).

## Verification Plan

### Automated Tests
- `npm run test:migration` – runs the backup + migration script and asserts that the number of `topics` rows increased.

### Manual Verification
- Log in to admin panel, create a dummy lesson, publish it, and confirm visibility.
- Unpublish an existing lesson and verify it disappears from the public view.
- Edit a test question via the UI and ensure the changes persist after a server restart.

---
**Note**: No existing lesson or test data will be deleted; all CRUD operations affect only new rows or updates.
