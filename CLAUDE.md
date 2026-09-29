# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node >= 20.

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b` type-check, then Vite build to `dist/`
- `npm run lint` — ESLint (type-aware; slow-ish because it uses the TS project service)
- `npm test` — Vitest in watch mode; `npm test -- --run` for a single run (what CI uses)
- `npm test -- --run src/pages/Search/__tests__/Search.test.tsx` — run one file
- `npm test -- --run -t "should render a search form"` — run tests matching a name
- `npm run coverage` — Vitest with v8 coverage

CI (`.github/workflows/deploy.yml`) runs lint → tests → build on every push to `main` and deploys `dist/` to GitHub Pages. A lint or test failure blocks the deploy.

## Architecture

React 19 + TypeScript SPA that searches the public GitHub REST API (unauthenticated, so rate limits apply) and shows repository details.

**Routing & hosting.** `main.tsx` wraps the app in a `HashRouter` (required for GitHub Pages; Vite `base` is `/github-search/`). Routes live in `src/router/index.tsx`: `/` → Search, `/repo/:owner/:name` → Repository, `*` → NotFound. The router calls `useFocusMainOnRouteChange`, which moves focus to the page's `<main>` on every navigation — so every page must render a `<main>` element.

**State via context providers**, one folder per domain under `src/context/<domain>/` containing `<Domain>Context`, `<Domain>Provider`, a `types/` folder, `*.constants.ts` default value, and an `index.ts` barrel.
- `NotificationProvider` (outermost, in `App.tsx`) renders the toast and exposes `notify(message, type, timeout?)` via the `useNotification` hook. Providers report API errors through `notify` rather than exposing error state.
- `SearchProvider` (app-wide, in `App.tsx`) holds search results/term/filter, so results survive navigating to a repo and back.
- `RepositoryProvider` is mounted per-page inside `pages/Repository/index.tsx`, not globally; `RepositoryMain` reads `:owner/:name` from the URL and calls `handleFetch`.

**Stale-response handling.** Both `SearchProvider.handleSearch` and `RepositoryProvider.handleFetch` abort the previous in-flight request with an `AbortController` stored in a ref, and after every `await` check `abortControllerRef.current !== controller` before touching state (including in `catch`/`finally`). Preserve this pattern when adding new fetch paths.

**API layer.** `src/api/index.ts` wraps `fetch` and maps the raw `RepositoryApiResponse` (full GitHub shape in `src/api/types`) down to the app's slimmer `SearchResultType` / `RepositoryType`. Note the renames (`private` → `isPrivate`, `owner` object → `owner` login string + `owner_url`). Rate-limit responses (403/429 with `x-ratelimit-remaining: 0`) get a dedicated error message.

**Pages** live in `src/pages/<Page>/` with their own CSS and a `components/` subfolder for page-specific components; shared components are in `src/components/` (exported via barrel `index.ts`, styles in `components/styles/`). Repository sub-components (`Header`, `Details`, etc.) read `RepositoryContext` directly rather than taking props.

## Conventions

- Path aliases: `@/` → `src/`, `@mocks/` → `src/test/__mocks__/` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- ESLint enforces: no semicolons, single quotes (double in JSX), alphabetized `import/order` with no blank lines between groups, and jsx-a11y recommended rules. Run `npm run lint` after edits.
- `verbatimModuleSyntax` is on — use `import type` for type-only imports.

## Testing

- Tests must be in `__tests__/` folders named `*.test.ts(x)` next to the code (that's the Vitest `include` glob — tests elsewhere won't run). Vitest globals and jest-dom matchers are enabled.
- Tests run with `TZ=UTC` and `LANG=en-US` pinned in `vite.config.ts` so date formatting is deterministic; don't rely on local timezone.
- Components are tested by rendering them inside `<XContext.Provider value={...}>` with fixtures from `@mocks/contexts` (`mockSearchContext`, `mockRepositoryContext`) and `MemoryRouter`, rather than using the real providers. Providers themselves are tested via consumer components in `@mocks/consumers`. API tests stub `global.fetch`.
- Elements are queried by `data-testid`, which components forward from props.
