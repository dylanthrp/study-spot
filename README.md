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

The dashboard uses the existing course list, without its hardcoded completion percentages or note counts. Courses without material are labeled accordingly. Dylan confirmed Charlie has his exact schedule: Charlie now reads the same course collection as Dylan, while dashboard folders and history remain student-scoped. Wyatt and Christian's inherited schedules still need confirmation. Cooper's accounting link opens the existing separate study app.

Games shows an explicit not-yet-available state. Other study-tool links open existing materials; this redesign does not repair the previously audited Recall lifecycle, answer checking, shared study grades, physics content, or Markdown/math rendering. Physics is labeled content-review-pending on the new dashboard. Do not treat the new UI tests as certification of those legacy engines or course content.

No automatic deployment is configured. Review the local preview before publishing.

## Calc III classroom

Open `#/u/dylan/MATH-215` or `#/u/charlie/MATH-215`. Both use the same original section-aligned lessons and practice, without changing the legacy physics engine.

- `calc3-data.js`: eight guided lessons, worked examples, twelve original multiple-choice questions, explanations, and references. Scope: Stewart §§12.3–12.4 plus vector prerequisites, not the whole semester or the instructor's actual quiz.
- `calc3.js` / `calc3.css`: step-by-step reveal, vector-angle playground, annotated SVG references, quiz feedback with missed-question retry, printable formula sheet, and notebook.
- `assets/calc3-projection.svg` / `assets/calc3-cross.svg`: original mathematical reference diagrams.
- Notebook key: `studyspot_calc3:<student>:notes:v1`. Browser-local plaintext, not authenticated or cloud-synced. Notes can be downloaded; storage failures are reported. Quiz attempts reset when leaving or refreshing the practice page. Scratch work is neither saved nor automatically graded.
- Run `node scripts/verify-calc3.cjs` for independent numeric/answer-key checks, then `npm test` for browser coverage. The arithmetic verifier checks the authored parameters and selected choices; it is not an arbitrary-expression grading engine.
- With the preview server running, `node scripts/capture-calc3.cjs` captures desktop/mobile screenshots under ignored `.hermes/previews/`.

Public Stewart contents establish section numbering; the linked LibreTexts pages are open aligned explanations rather than proprietary Stewart pages. No video research or invented assignment dates are included.

## Appearance settings

The gear beside the dashboard profile (or at the right of the shared course header) opens Settings. Light is the default. Dark uses the verified Cooper accounting-deck palette: `#0f1115` background, `#181c24` cards, `#1f2531` raised surfaces, `#e7eaf0` text, and Michigan maize accents.

`settings.js` loads before styles to restore `studyspot_theme_v1` without a light-theme flash. This is a browser-wide preference, shared across student selection and course routes, not a cloud account setting. Changing appearance does not rerender the course or clear quiz work. Storage failures show a warning while still applying the theme for the current visit. Native dialog behavior provides keyboard containment, Escape dismissal, and focus return.

`settings.css` styles the controls; `dark-theme.css` scopes alternate colors to `html[data-theme="dark"]`. Original math reference images remain light for legibility. `node scripts/capture-settings.cjs` captures local dark-mode previews. The separately hosted accounting deck is a color reference, not modified by Study Spot settings.
