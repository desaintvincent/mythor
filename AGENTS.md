# AGENTS.md — Mythor

TypeScript 2D game framework. Yarn workspaces + Lerna monorepo.

## Language

All code comments and human-facing text (UI strings, example descriptions, commit messages, docs) must always be written in English, regardless of the language used in the conversation.

## Package manager

**Yarn 1 (classic).** Do not use `npm` or `pnpm`. `yarn install` also runs `lerna bootstrap` via `postinstall`.

## Packages

| Package | Role |
|---------|------|
| `@mythor/math` | Vec2, Rect — no deps, leaf package |
| `@mythor/core` | ECS kernel (Entity, Component, System, Ecs, Manager) — depends on math |
| `@mythor/assets` | Shared asset loading/preloading — depends on core |
| `@mythor/renderer` | WebGL renderer, shaders, sprites, camera — depends on core+math |
| `@mythor/events` | Input (keyboard, mouse) — depends on core+math+renderer |
| `@mythor/physic2d` | 2D physics via planck-js — depends on core+math |
| `@mythor/tiled` | Tiled map loader — depends on core+math+physic2d+renderer |
| `@mythor/audio` | Web Audio API wrapper (Manager + Component + System) — depends on core+math+assets |
| `@mythor/game` | Game loop, Scene management — depends on core+events+math+renderer |
| `@mythor/ui` | UI primitives (Button + Panel/Label/Button factories) — depends on core+renderer+events+math |
| `@mythor/examples` | Webpack dev app, private, not published |
| `@mythor/eslint-config` | Shared ESLint + Prettier rules |

Dependency order matters for build: `math → core → assets → renderer/physic2d → events/tiled/audio → game`.

## Commands (from repo root)

```sh
yarn install        # install + lerna bootstrap
yarn build          # build all packages (lerna run build)
yarn test           # jest across all packages (ts-jest, node env)
yarn lint           # eslint all packages, --max-warnings 0
yarn start          # tsc --watch all libs + webpack-dev-server for examples (parallel)
yarn doc            # typedoc for each package → packages/*/docs/
yarn clean          # rm lib/dist/docs in all packages + lerna clean
```

Run a **single package** script: `yarn workspace @mythor/core build`

Run **focused tests** (only math has tests): `yarn test --testPathPattern=math`

## Build output

- Library packages: `packages/<name>/lib/` (compiled by `tsc`, entrypoint declared in `main`)
- Examples: `packages/examples/dist/` (webpack)
- Docs: `packages/<name>/docs/` (typedoc markdown, committed to main)

## TypeScript

- Root `tsconfig.json`: target ES5, module commonjs, `experimentalDecorators` + `emitDecoratorMetadata` enabled, `noImplicitAny: false`
- Each package extends root tsconfig, outputs to `./lib`
- Test files (`*.spec.ts`) excluded from `tsc` compilation (jest handles them via ts-jest)

## Tests

- `@mythor/math`: `packages/math/__tests__/Vec2.spec.ts`
- `@mythor/core`: `packages/core/__tests__/` (Entity, Ecs, System, Manager specs)
- Jest config: `ts-jest` preset, `testEnvironment: node`
- CI runs `yarn test --coverage` on PR
- Run focused: `yarn test --testPathPattern=core`

## @mythor/core — architecture notes

**ECS flow:** `Ecs.create()` → `Entity` → `entity.add(components)` → `EntityCollection.addEntity()` → dispatched to matching `MapList`s → Systems iterate their list on `update()`.

**Singletons (module-level state, persists across tests in same process):**
- `ComponentRegistry` — singleton via `static instance`. Assigns bit signatures to Component subclasses (`1 << bits++`). Jest isolates per file (separate workers), so safe within one file.
- `SignableMap.constructorRegistries` — static Map keyed by name (`"system"`, `"manager"`). Persists across `Ecs` instances in the same file.

**Signatures:** Each unique `Component`/`System`/`Manager` constructor class gets a unique integer signature (power of 2). Assigned once, stable. Entity filter = bitwise OR of component signatures. Max 31 unique types per registry type before overflow.

**Writing tests for core:**
- Define Component subclasses at describe/module scope (not inside `it()`), reuse within file.
- Each test file gets a fresh module environment (Jest worker isolation).
- Use fresh `Ecs` instances per test — entity collections are per-instance.
- `System.init()` must be called (via `ecs.init()`) before entities can be tracked.
- `entity.destroy()` + `ecs.update()` needed to actually remove entity (queue-based).
- `System` with 0 components throws on `init()`.

## Commit convention

Conventional commits enforced by commitlint. Scope must be a package name or `root`:
```
feat(core): add new component
fix(renderer): fix shader
chore(root): update deps
```
PR titles follow the same format (checked in CI).

## CI / Release

- PRs: build + lint + test run on every PR
- Merge to `main`: lerna bumps versions (independent, conventional-commits), publishes to npm, deploys examples to gh-pages, regenerates and commits docs
- No manual publish step needed; the deploy workflow handles everything

## Circular imports — known patterns

**10 cycles détectés** dans le repo (voir ANALYSIS.md §2 pour le détail complet et les fixes).

### Règle fondamentale : `import type` pour les annotations pures

Si un module A est importé dans B **uniquement** pour typer un paramètre de méthode, un champ ou un retour de fonction (aucun accès runtime : pas de `new A()`, pas d'appel de méthode, pas d'accès à une propriété statique), utiliser **`import type A`**. TypeScript efface ces imports à la compilation — aucun edge dans le graphe de modules runtime.

```ts
// ❌ crée un edge runtime même si A n'est jamais instancié
import Renderer from '../../systems/Renderer'
public async init(renderer: Renderer): Promise<void> {}

// ✅ effacé à la compilation, zéro cycle
import type Renderer from '../../systems/Renderer'
public async init(renderer: Renderer): Promise<void> {}
```

---

### Les 3 familles de cycles — état actuel

#### A. Core — `Component ↔ Entity ↔ ComponentRegistry` (cycle 1)

**Fichiers :**
- `packages/core/src/ecs/Component.ts` → importe `Entity` pour le champ `_entity: Entity`
- `packages/core/src/ecs/Entity.ts` → importe `Component` + `ComponentRegistry`
- `packages/core/src/registries/ComponentRegistry.ts` → importe `Component` comme générique

**Fixes appliqués (tous résolus) :**
- `Component.ts` : `import type Entity from './Entity'` ✅
- `ComponentRegistry.ts` : `extends ConstructorRegistry<Signable>` ✅

**Règle à maintenir :** ne jamais ajouter d'import runtime de `Entity` dans `Component.ts`. Le composant ne fait qu'*être porté* par une entité — il ne lui parle pas.

---

#### B. Renderer — `Shader.ts → Renderer.ts` (cycles 2–8 + 10, soit 9 cycles)

**Fichier coupable :** `packages/renderer/src/webgl/shaders/Shader.ts`

**Pattern à ne pas reproduire :**
```ts
// Shader.ts — NE PAS FAIRE (import runtime dans le sens contraire du flux)
import Renderer from '../../systems/Renderer'
public async init(renderer: Renderer): Promise<void> {}
```

**Pattern correct (fix appliqué ✅) :**
```ts
import type Renderer from '../../systems/Renderer'
public async init(renderer: Renderer): Promise<void> {}
```

**Pourquoi c'est fragile :** `Renderer.ts` instancie tous les shaders → chaque shader hérite de `Shader` → `Shader` importe `Renderer` → cycle. Avec `import type`, le cycle disparaît au runtime.

**Cas particulier `ParticlesRender.ts` :** ce shader importe aussi `Renderer` directement dans son propre fichier (pour accéder à `renderer.shapes` dans son `init()` overridé). Cet import runtime est **intentionnel et justifié** — ne pas le supprimer. Si le couplage devient gênant, extraire une interface `IRenderer` avec seulement `{ gl, shapes }`.

**Règle à maintenir :** si tu ajoutes un nouveau shader qui hérite de `Shader`, ne jamais importer `Renderer` en runtime depuis ce shader (sauf si tu as besoin de propriétés concrètes comme `ParticlesRender`). Si tu as besoin du type uniquement, `import type`.

---

#### C. Renderer — `TextureManager ↔ generateFontTexture` (cycle 9)

**Chaîne :** `TextureManager → Renderer → Text → generateFontTexture → TextureManager`

**Cause :** `loadTexture` est une fonction libre colocalisée avec la classe `TextureManager` dans le même fichier. `generateFontTexture` n'a besoin que de `loadTexture`, mais importer depuis `TextureManager.ts` charge tout le module (qui lui-même dépend de `Renderer`).

**Fix appliqué ✅ :** `loadTexture` extrait dans `packages/renderer/src/util/loadTexture.ts`. `TextureManager.ts` et `generateFontTexture.ts` importent depuis ce module. `TextureManager` ré-exporte `loadTexture` pour compatibilité API.

**Règle à maintenir :** ne jamais mettre une fonction utilitaire standalone dans le même fichier qu'une classe qui crée des dépendances lourdes. Si une fonction peut être importée isolément, elle mérite son propre module.

---

### Résumé des fixes appliqués ✅

| Fix | Fichier | Cycles tués |
|---|---|---|
| `import type Renderer` | `Shader.ts` | 2–8, 10 (×9) |
| Extraire `loadTexture` | `TextureManager.ts` + `generateFontTexture.ts` | 9 |
| `ConstructorRegistry<Signable>` | `ComponentRegistry.ts` | 1 (partiel) |
| `import type Entity` | `Component.ts` | 1 (complet) |

---

## Linting

Each package runs `eslint . --max-warnings 0` using `@mythor/eslint-config` (extends prettier). Zero warnings allowed — CI will fail.
