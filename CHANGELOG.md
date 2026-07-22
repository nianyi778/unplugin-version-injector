# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.3.1] - 2026-07-22

### Fixed

- Removed the `import.meta.url` reference from the webpack 4 fallback path, so bundling
  no longer emits an `empty-import-meta` warning under an es2015 target. `webpack-sources`
  is now resolved from the webpack project root. No runtime behavior change.

## [2.3.0] - 2026-07-22

### Added

- **`nonce` option** — adds a CSP nonce to the injected inline `<script>` tags
  (rendered as `nonce="..."`), so injection keeps working on sites with a strict
  `script-src` Content-Security-Policy.

### Fixed

- **Build time is now computed once per build** and shared across all HTML assets, so
  multi-page (MPA) builds get a consistent timestamp; it refreshes on each watch rebuild
  via the `buildStart` hook. (The previous caching mechanism was effectively dead code.)
- **`<head>` matching no longer matches `<header>`** — a whitespace-boundary regex is used,
  so nothing is injected into a `<header>` element when no `<head>` exists.
- **String `include` entries now match on an origin/path boundary** — e.g.
  `'https://api.example.com'` no longer matches `https://api.example.com.evil.com`,
  preventing the version header from leaking to look-alike domains.

## [2.2.1] - 2026-07-17

### Changed

- **Fail-safe injection** — the plugin never breaks the build or the host app due to
  bad configuration or unexpected errors:
  - Invalid request-header names now emit a warning and fall back to the defaults
    instead of throwing (which previously aborted the build).
  - `include` accepts only strings / `RegExp`; any other value is ignored.
  - Any error during HTML processing is caught and the **original HTML is returned
    unchanged**.
  - The injected runtime scripts (console banner + `fetch`/`XHR` patch) are each
    wrapped in `try/catch`, so they can never throw into the host page.

### Docs

- Documented all `requestHeaders` scenarios (including monorepo + cross-origin) and
  fixed the `formatDate` type in the README.

## [2.2.0] - 2026-07-17

### Added

- **Rspack** and **Rolldown** support (five bundlers total: Vite, Webpack 4/5, Rspack,
  Rollup, Rolldown).
- **`requestHeaders`** option — patches `fetch` / `XMLHttpRequest` to attach
  `X-Client-Version` and `X-Client-Build-Time` headers so requests can be traced to a
  client build in backend logs. Same-origin only by default; cross-origin is opt-in via
  `include` (string prefix or `RegExp`).
- `formatDate` now also accepts a dayjs-style pattern string (e.g. `YYYY-MM-DD HH:mm:ss`)
  with no extra dependency.
- Full TypeScript type exports and a proper `exports` map (ESM + CJS); unit test suite.

### Fixed

- Added the missing `resetBuildTime` method.

### Performance

- Cache the `package.json` lookup.

## [2.1.1] - 2025-06-05

### Fixed

- Console banner style fixes.

## [2.1.0] - 2025-06-04

### Added

- Inject the project name (`<meta name="project">`) and theme-aware console styling
  (auto light / dark).

## [2.0.0] - 2025-04-18

### Changed

- **BREAKING** — import from the per-bundler subpath, e.g.
  `require('unplugin-version-injector/webpack')` (also `/vite`, `/rspack`, `/rollup`,
  `/rolldown`). The package root no longer exposes bundler methods directly.
- Flat `dist/` output with ESM + CJS builds and a full `exports` map.

[Unreleased]: https://github.com/nianyi778/unplugin-version-injector/compare/v2.3.1...HEAD
[2.3.1]: https://github.com/nianyi778/unplugin-version-injector/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/nianyi778/unplugin-version-injector/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/nianyi778/unplugin-version-injector/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/nianyi778/unplugin-version-injector/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/nianyi778/unplugin-version-injector/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/nianyi778/unplugin-version-injector/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/nianyi778/unplugin-version-injector/releases/tag/v2.0.0
