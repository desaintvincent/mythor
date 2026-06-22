# Analyse Mythor

> Généré le 2026-06-22. Base : graphify (1 334 nœuds, 1 839 edges, 101 communautés) + lecture source.

---

## Ce que c'est

Framework de jeu 2D TypeScript en monorepo (Yarn + Lerna), construit autour d'une architecture **ECS** (Entity-Component-System). Stack : WebGL natif, physique via planck-js, support maps Tiled. Destiné à être publié comme set de bibliothèques npm indépendantes.

~9 700 lignes de TS réparties sur 8 packages, 254 fichiers.

---

## Architecture — points forts

- **ECS propre.** `Entity`, `Component`, `System`, `Manager`, `Ecs` forment un noyau cohérent. Le pattern `Signable`/`Constructor` pour le registre de types est élégant.
- **Renderer WebGL custom.** 7 shaders distincts (Circle, FillRect, FillTriangle, Lines, Sprite, Text, Particles), QuadTree pour le culling spatial, TextureManager, font rendering.
- **Intégration Tiled complète.** `generateEntitiesFromTiled` + décomposition de polygones convexes pour les colliders physiques.
- **Pipeline CI solide.** Build + lint + test sur PR, publication npm automatique sur `main`, déploiement examples sur gh-pages, versioning conventionnel.

---

## Problèmes

### 🔴 Critique

#### 1. Couverture de tests : quasi nulle

- [x] ✅ Résolu — 65 tests écrits (Entity, Ecs, System, Manager, Vec2)

Un seul test dans tout le repo — 10 lignes dans `Vec2.spec.ts` qui vérifient une seule chose.
Pour un framework publié, c'est la principale menace : chaque refactor casse silencieusement le cœur ECS, le renderer, la physique.

**Action :** écrire des tests unitaires minimaux pour `@mythor/core` : `Ecs.addSystem`, `Entity.addComponent`, `getSignature`, cycles de vie ECS.

---

#### 2. Cycles d'import circulaires (10 détectés)

- [ ] À traiter

**Core :**
```
Component → Entity → ComponentRegistry → Component
```

**Renderer (× 7) :**
```
Renderer.ts → [Circle|FillRect|Lines|Sprite|Text|…].ts → Shader.ts → Renderer.ts
```

**Renderer (× 2) à 4 nœuds :**
```
TextureManager → Renderer → Text shader → generateFontTexture → TextureManager
Renderer → Text → Sprite → Shader → Renderer
```

Les cycles dans le renderer sont silencieux au runtime mais empêchent le tree-shaking et peuvent causer des `undefined` à l'init si l'ordre de résolution change.

**Fix renderer :** introduire une interface `IShader` dans un module séparé ; `Renderer` dépend de l'interface, les shaders l'implémentent sans importer `Renderer`.

**Fix core :** `ComponentRegistry` ne devrait pas importer `Component` directement — travailler avec `Constructor<Component>` comme type générique.

---

### 🟠 Important

#### 3. TypeScript sans filets

- [ ] À traiter

```json
"noImplicitAny": false,
"strict": false,       // absent = désactivé
"strictNullChecks": false  // absent = désactivé
```

Pour un framework qui wrappe des APIs WebGL (où `getContext()` peut retourner `null`), l'absence de `strictNullChecks` est dangereuse. Les utilisateurs downstream héritent de ces failles de typage.

**Action :** activer `"strict": true` package par package en commençant par `@mythor/math` (leaf, aucune dépendance).

---

#### 4. `log()` est le nœud #1 de betweenness centrality (0.191)

- [ ] À traiter

`log()` est un simple `console.log` coloré. Pourtant il est importé directement dans : core (3 fichiers), renderer (`Shader.ts`, `TextureManager.ts`), game (`SceneManager.ts`), tiled (2 fichiers).

C'est lui qui crée les bridges entre les 4 communautés les plus distantes du graphe. Symptôme : **un utilitaire de debug pilote le couplage inter-packages**.

**Action :** rendre `log` injectable via `EcsOptions` ou `GameMakerOptions` — permettre à l'utilisateur de router les logs vers son propre système.

---

#### 5. `Renderer` est une God class (408 lignes, 25 edges)

- [ ] À traiter

`Renderer.ts` gère : init canvas WebGL, registry des shaders, QuadTree, Camera, API de dessin impérative (`drawLine`, `drawCircle`…), particle systems, textes.

**Action :** split naturel en `ShaderRegistry`, `DrawAPI` (facade), `RendererCore` (WebGL init + loop).

---

#### 6. Cible ES5 obsolète

- [ ] À traiter

```json
"target": "ES5",
"lib": ["es2017", "dom"]
```

Cibler ES5 en 2026 n'a plus de sens pour un framework WebGL (WebGL2 nécessite Chrome 56+ qui supporte ES2017+). Le build transpile inutilement les arrow functions, generators, etc.

**Action :** passer `"target": "ES2017"` dans la root tsconfig.

---

#### 7. Decorators pre-standard

- [ ] À traiter

```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

API de décorateurs TS legacy (Angular-style). TypeScript 5.x a implémenté les décorateurs TC39 standard. Si les décorateurs sont utilisés dans l'ECS, prévoir une migration — la compat n'est pas garantie à terme.

**Action :** auditer l'usage des décorateurs dans le code source, planifier migration vers décorateurs TC39.

---

### 🟡 Mineur / Qualité

#### 8. Typo dans l'API publique : `Agregate` → `Aggregate`

- [ ] À traiter

`packages/tiled/src/Agregate.ts` — le fichier et la classe interne s'appellent `Agregate` (une seule `g`). Le type exporté `AggregateCollider` est correct mais la source est typosée.

**Action :** renommer fichier + classe + références internes. Breaking change semver major.

---

#### 9. `planck-js` ^0.3.31 — deux générations de retard

- [ ] À traiter

planck-js 1.x apporte une API TypeScript propre, meilleures perfs, bugs résolus. La migration nécessite des ajustements d'API mais est faisable par package.

**Action :** migrer `@mythor/physic2d` vers planck-js 1.x.

---

#### 10. `strictNullChecks` incohérent entre packages

- [ ] À traiter

`packages/tiled/tsconfig.json` active `"strictNullChecks": true` isolément, les autres non. Incohérence qui peut masquer des bugs à l'interface entre packages.

**Action :** harmoniser avec le point 3 (activation globale de `strict`).

---

#### 11. Convention `_prefix` pour les privés

- [ ] À traiter

```ts
private readonly _systems: SignableMap<System>
```

TypeScript moderne préfère `#privateField` (vrai privé à l'exécution) ou au moins `private` sans prefix. `_` est une convention de contournement TS 2.x.

**Action :** migrer vers `#field` ou supprimer les underscores (cosmétique, low priority).

---

#### 13. `Ecs.create()` — signature de type incorrecte

- [ ] À traiter

```ts
public create(id = undefined): Entity {  // TypeScript infère id: undefined
```

`id = undefined` sans annotation de type → TS infère `id: undefined`. Passer une string au call site est une erreur de compilation malgré que le runtime fonctionne.

**Fix :** `public create(id?: string): Entity`

---

#### 14. `Ecs.stop()` n'appelle pas `manager.clear()`

- [ ] À traiter

`stop()` vide la `SignableMap` interne (`_managers.clear()`) mais n'itère pas les managers pour appeler leur hook `clear()`. Les managers ayant du state interne (pools, buffers) ne sont pas nettoyés correctement.

**Fix :**
```ts
public stop(): void {
  this._managers.forEach((manager) => manager.clear())
  this._systems.forEach((system) => system.clear())
  this._systems.clear()
  this._managers.clear()
  // ...
}
```

---

#### 12. `AggregateCollider` / `Agregate.ts` — responsabilités multiples

- [ ] À traiter

`Agregate.ts` (174 lignes) fait : décomposition polygonale, parsing Tiled ET gestion d'état de loading. Cohésion communauté : 0.07 (37 nœuds, la plus basse).

**Action :** extraire `LoadingStateManager` et la logique de décomposition dans des modules séparés.

---

## Chiffres clés

| Métrique | Valeur |
|---|---|
| Lignes TS | ~9 700 |
| Tests | 65 (4 fichiers : Vec2, Entity, Ecs, System, Manager) |
| Cycles d'import | 10 |
| God nodes (>15 edges) | 10 |
| Betweenness #1 | `log()` — 0.191 |
| Cohésion max (fonctionnel) | 0.12 |
| `noImplicitAny` | false |
| `strictNullChecks` | false (global) |

---

## Roadmap suggérée

### Court terme (sans breaking changes)
1. Activer `strictNullChecks` + `noImplicitAny` sur `@mythor/math` d'abord
2. Tests unitaires ECS core minimaux ✅
3. Casser le cycle `Component → Entity → ComponentRegistry`
4. Passer target à `ES2017`

### Moyen terme
5. `log()` injectable via options
6. Découper `Renderer.ts` → `ShaderRegistry` + `DrawAPI`
7. Corriger les 7 cycles renderer via interface `IShader`
8. Migrer planck-js vers 1.x

### Long terme
9. `"strict": true` complet sur tous les packages
10. Migrer vers décorateurs TC39 standard (TS 5.x)
11. Tests d'intégration renderer (headless WebGL)
12. Renommer `Agregate` → `Aggregate` (semver major)
