# SCC CRM Frontend

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`, proxying `/api/*` to `http://localhost:8000` (the FastAPI backend).

## Structure

```
src/
├── api/client.js              # axios instance - all API calls go through here
├── components/
│   ├── layout/                # Sidebar, Topbar, AppLayout - the shell every page uses
│   └── ui/                    # Badge, StatCard, IconStatCard, ProgressBar,
│                               # DonutChart, TrendLineChart, EmptyState
├── pages/                     # One file per route - each has MOCK_ data clearly marked
│   ├── Dashboard.jsx          # fully built - matches the approved mockup
│   ├── Organisations.jsx      # built - table view
│   ├── OrganisationDetail.jsx # built - single relationship view
│   ├── Opportunities.jsx      # built - kanban pipeline
│   ├── Tasks.jsx               # built - checklist view
│   └── Contacts / Engagements / Commitments / Reports / Settings
│                               # placeholders - each teammate builds theirs out
└── App.jsx                    # Route definitions
```

Charts use `recharts`, icons use `lucide-react` - both are in `package.json`.

## Auth

```
src/context/AuthContext.jsx    # user, login(), logout(), changePassword() - source of truth
src/pages/SignIn.jsx           # email + password form, public route
src/components/ProtectedRoute.jsx  # redirects to /signin if no valid session
```

Every route except `/signin` is wrapped in `<ProtectedRoute>` in `App.jsx`. The
JWT is stored in `localStorage` under `token`; `api/client.js` attaches it to
every request automatically and signs the user out if the backend returns 401.

**Demo login** (seeded in `seed.sql`): `elton@simplycomplex.africa` /
`Password123!`. Change-password lives on the Settings page and calls
`POST /api/auth/change-password`.

## How to change the look

Everything visual flows from **`tailwind.config.js`**. Change the hex values under
`theme.extend.colors` and the whole app re-themes — sidebar, badges, buttons, accents.

To change type: edit `fontFamily` in `tailwind.config.js` and swap the Google Fonts
`<link>` in `index.html` to match.

To change layout (e.g. top nav instead of sidebar): edit `AppLayout.jsx` only — pages
don't know or care how the shell is structured.

## Team workflow

Each page has a `// TODO(owner: ...)` comment marking where mock data should be
replaced with a real `api.get(...)` call. Copy the pattern already wired up in
`Dashboard.jsx` (the `/api/health` check) for your own endpoint.

Keep new pages consistent by reusing `Badge`, `StatCard`, and `EmptyState` rather than
writing new one-off styles — that's what keeps 5 people's work looking like one app.
