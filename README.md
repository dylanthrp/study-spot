# Study Spot

Static, hash-routed study site for UM-Dearborn. No production bundler or backend is required.

## Local preview

Run `npm run preview`, then open `http://127.0.0.1:4173/#/u/dylan`.
This uses Python's local HTTP server on loopback only. Dashboard assets are also compatible with GitHub Pages subpaths.

## Browser tests

1. `npm ci`
2. `npx playwright install chromium`
3. `npm test`

Playwright starts the preview server automatically if needed. Tests use isolated browser storage; they do not change live users' data. The current suite covers the dashboard and navigation, not the entire legacy study engine.

With the preview server running, `node scripts/capture-dashboard.cjs` saves desktop/mobile screenshots to `.hermes/previews/` (ignored by Git).

## Dashboard implementation

- `dashboard.js`: dashboard shell, course navigation, search, folders and recent visits.
- `dashboard.css`: cream/Michigan dashboard styling, responsive layouts and reduced motion.
- `index.html`: roommate landing, hash router and existing course views. Passes selected student identity into the physics hub.
- `phys150-data.js`: existing study content, unchanged by this dashboard redesign.

The dashboard follows the supplied reference's sidebar/search/content composition while retaining Study Spot branding and colors. Expert Solutions, Study Groups and Notifications are excluded. Advertising, subscription upsells and Ask Quizlet are not copied. The right-hand slot shows the student's academic profile.

## Data and scope

Dashboard recent visits and folders use `studyspot_dashboard:<student>:recent` and `studyspot_dashboard:<student>:folders`. They persist in that browser only and are not cloud accounts or private authentication boundaries. Course visits are not presented as completed study or mastery. Old shared flashcard/recall storage is not migrated or renamed in this UI pass.

The dashboard uses the existing course list, without its hardcoded completion percentages or note counts. Courses without material are labeled accordingly. Charlie, Wyatt and Christian's inherited schedules still need confirmation. Cooper's accounting link opens the existing separate study app.

Games shows an explicit not-yet-available state. Other study-tool links open existing materials; this redesign does not repair the previously audited Recall lifecycle, answer checking, shared study grades, physics content, or Markdown/math rendering. Physics is labeled content-review-pending on the new dashboard. Do not treat the new UI tests as certification of those legacy engines or course content.

No automatic deployment is configured. Review the local preview before publishing.
