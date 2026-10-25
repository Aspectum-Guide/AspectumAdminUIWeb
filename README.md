# @aspectum/admin-ui-web

React UI kit for the Aspectum admin apps (content studio, Master controller). Raw JSX, no build
step; Tailwind v4 utilities for styling, `--aspectum-*` CSS variables for theming.

- Peer dependencies: `react` / `react-dom` ^18.2, `lucide-react` ^1.59.
- Tests: `npm ci && npm test` (vitest + jsdom). CI runs them on every push and PR.

## Installing in an app

The repository is public; pin a commit (or a release tag) over https:

```json
"@aspectum/admin-ui-web": "git+https://github.com/Aspectum-Guide/AspectumAdminUIWeb.git#<sha-or-tag>"
```

npm rewrites such a dependency to `git+ssh://` in `package-lock.json`, which fails without SSH keys
(Docker, CI). After `npm install`, change `resolved` back to `git+https://...` and make sure the
image has `git` (`apk add git`). A git submodule + npm workspace also works (the studio admin does
that); then clone with `--recurse-submodules`.

In the app's CSS:

```css
@layer theme, base, app, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import '@aspectum/admin-ui-web/theme.css';
@import 'tailwindcss/utilities.css' layer(utilities);
@source '../node_modules/@aspectum/admin-ui-web/src';
```

Tailwind does not scan `node_modules`, so the `@source` line is required; without it the kit's
utility classes are not generated.

## The one rule: app CSS goes in a layer below `utilities`

The kit is styled with utilities (`mx-auto`, `px-4`, `fixed`, `items-center`, ...), which live in
the `utilities` cascade layer. **Unlayered CSS always beats layered CSS**, so an app rule such as
`* { margin: 0; padding: 0 }` or `a { color: ... }` outside a layer silently cancels the matching
utilities: dialogs lose `mx-auto` and slide to the left, links and buttons lose padding and
colors. Keep the app's global styles inside `@layer app { ... }` (declared above, below
`utilities`). Component-level styles (styled-components, CSS modules) can stay unlayered when they
are meant to override the kit.

Apps with a dark palette re-map the `--aspectum-*` variables on `:root` after importing
`theme.css`.

## Releases

Version in `package.json`, tags `vX.Y.Z` on `main`. Consumers pin by tag or SHA; bump the version
with any behavior change.
