# Cycles architecturaux ECS — Analyse détaillée

> Rédigé le 2026-06-22. Ces 3 cycles sont distincts des 10 cycles précédemment résolus (voir ANALYSIS.md §2 + AGENTS.md).

---

## Contexte

Après résolution des 10 cycles initiaux, madge continue de signaler des cycles dans `@mythor/core`. Trois sont de vrais cycles runtime persistants — tous dans le noyau ECS.

```
Entity  ↔  Ecs
System  ↔  Ecs
Manager ↔  Ecs
```

Ces cycles ne sont **pas des artefacts** comme ceux résolus via `import type`. Chaque edge transporte des appels de méthode ou des accès à des propriétés concrètes.

---

## Cycle 1 — `Entity ↔ Ecs`

### Graphe

```
Entity.ts  ──import Ecs──▶  Ecs.ts  ──import Entity──▶  Entity.ts
```

### Détail des usages

**`Entity.ts` → `Ecs`** (ligne 8 : `import Ecs from './Ecs'`)

| Usage | Type | Lignes |
|---|---|---|
| `private _ecs?: Ecs` | stockage de référence | 15 |
| `public setEcs(ecs: Ecs): void` | paramètre | 37 |
| `this._ecs?.addEntityToCollections(this)` | appel méthode runtime | 66 |
| `this._ecs?.destroyEntity(this)` | appel méthode runtime | 132 |

**`Ecs.ts` → `Entity`** (ligne 1 : `import Entity from './Entity'`)

| Usage | Type | Lignes |
|---|---|---|
| `private readonly _entities: Map<string, Entity>` | type générique | 23 |
| `private readonly _entitiesToCreate: Entity[]` | type | 26 |
| `private readonly _entitiesToDestroy: Entity[]` | type | 27 |
| `new Entity(id)` | instanciation | 162 |
| `entity.setEcs(this)` | appel méthode | 163 |
| `entity._id` | accès propriété | 167–168, 198 |
| `this._entityCollections.addEntity(entity)` | passage arg | 184, 197 |
| `entity` dans destroy/flush | manipulation | multiple |

### Nature du cycle

C'est le cycle classique **"enfant connaît son parent, parent connaît ses enfants"**. `Entity` appelle des méthodes sur `Ecs` (`destroyEntity`, `addEntityToCollections`) — ce ne sont pas des annotations de type, c'est du comportement.

L'edge `Entity → Ecs` est **bidirectionnelle et runtime des deux côtés**. Impossible de supprimer par `import type`.

### Impact actuel

- Aucun crash connu : Node/webpack résout ces cycles via le mécanisme de module laziness.
- Risque réel : si `Ecs` n'est pas encore évalué au moment où `Entity.add()` appelle `this._ecs?.addEntityToCollections(this)`, `addEntityToCollections` serait `undefined`. En pratique, `Ecs` crée l'Entity (donc `Ecs` est déjà évalué), mais l'ordre d'évaluation dépend du point d'entrée du bundler.
- Tree-shaking impossible : importer `Entity` seul tire tout `Ecs`.

### Options de résolution

#### Option A — Interface `IEcs` (recommandée)

Extraire une interface minimale dans un module feuille :

```ts
// packages/core/src/ecs/IEcs.ts  (nouveau fichier, pas de dépendances circulaires)
import type Entity from './Entity'

export interface IEcs {
  addEntityToCollections(entity: Entity): void
  destroyEntity(entity: Entity): void
}
```

`Entity.ts` importe `IEcs` au lieu de `Ecs` — plus de cycle.

```ts
// Entity.ts
import type IEcs from './IEcs'  // ← type only, effacé à la compile
private _ecs?: IEcs
```

`Ecs.ts` implémente l'interface (implicitement ou `class Ecs implements IEcs`).

**Avantages :** propre, testable (mock `IEcs` trivial), zero coût runtime.  
**Inconvénients :** introduit un niveau d'indirection. Si `Entity` a besoin d'autres méthodes `Ecs` plus tard, il faut étendre `IEcs`.

#### Option B — Callback injection

Au lieu que `Entity` appelle `ecs.destroyEntity(this)`, passer des callbacks à la construction ou via `setEcs` :

```ts
// Entity reçoit des fonctions, pas une référence Ecs
entity.setCallbacks({
  destroy: (e: Entity) => ecs.destroyEntity(e),
  addToCollections: (e: Entity) => ecs.addEntityToCollections(e),
})
```

**Avantages :** découplage total, plus facile à tester.  
**Inconvénients :** verbose, modification de l'API publique (`setEcs` disparaît ou change de signature).

#### Option C — Inversion : `Ecs` gère le cycle de vie, `Entity` devient passif

`Entity.destroy()` deviendrait `ecs.destroyEntity(entity)` — `Entity` ne connaît plus `Ecs`. C'est une inversion de contrôle plus profonde.

**Avantages :** `Entity` devient une pure value object sans dépendances externes.  
**Inconvénients :** breaking change dans l'API publique. Tous les sites `entity.destroy()` doivent changer. Détruit l'ergonomie ECS fluent.

### Verdict

**Option A (IEcs) est pertinente à moyen terme.** La refacto est chirurgicale (1 nouveau fichier, 3 lignes changées dans `Entity.ts`), ne casse pas l'API publique, rend `Entity` unittestable sans `Ecs`.

**Priorité : moyen terme — pas urgent.** Le cycle ne cause pas de bugs avérés aujourd'hui. À faire lors d'une phase "hardening architecture" ou si on ajoute des tests d'intégration Entity isolés.

---

## Cycle 2 — `System ↔ Ecs`

### Graphe

```
System.ts  ──import Ecs──▶  Ecs.ts  ──import System──▶  System.ts
```

### Détail des usages

**`System.ts` → `Ecs`** (ligne 1 : `import Ecs from './Ecs'`)

| Usage | Type | Lignes |
|---|---|---|
| `public ecs: Ecs` | champ public | 15 |
| `public async init(ecs: Ecs): Promise<void>` | paramètre | 59 |
| `this.ecs = ecs` | assignation | 60 |
| `this.ecs.systems.has(systemConstructor)` | accès propriété + méthode | 101 |
| `this.ecs.managers.has(managerConstructor)` | accès propriété + méthode | 106 |
| `this.ecs.createList(...)` | appel méthode | 69–77 |
| `protected async onSystemInit(ecs: Ecs)` | paramètre override hook | 123 |

**`Ecs.ts` → `System`** (ligne 3 : `import System from './System'`)

| Usage | Type | Lignes |
|---|---|---|
| `private readonly _systems: SignableMap<System>` | type générique | 20 |
| `new SignableMap<System>('system', ...)` | type générique | 36 |
| `System[]` dans `registerSystems(...)` | paramètre | 126 |
| `this._systems.forEachAsync(async (system) => { await system.init(this) })` | itération + appel | 72–74 |
| `system.update(...)`, `system.disabled()`, etc. | appels méthode | 99–106 |

### Nature du cycle

C'est le pattern **"compositeur connaît les composants, composants connaissent le compositeur"**. `System` a besoin d'`Ecs` pour : (1) stocker la référence au moment de l'init, (2) valider ses dépendances (`checkDependencies`), (3) créer sa liste d'entités.

L'usage dans `checkDependencies` est particulièrement couplé : `System` inspecte directement les registres internes de `Ecs` (`ecs.systems.has(...)`, `ecs.managers.has(...)`).

### Impact actuel

Identique au cycle 1 : pas de crash mais risque d'ordre d'évaluation et obstacle au tree-shaking.

De plus, `public ecs: Ecs` dans `System` est **non-null assignable** uniquement après `init()`. Avant init, tout système qui accède à `this.ecs` dans son constructeur crasherait silencieusement. Ce n'est pas lié au cycle mais c'est un problème de design connexe.

### Options de résolution

#### Option A — Interface `IEcs` partagée (recommandée, en cohérence avec Cycle 1)

L'interface `IEcs` du cycle 1 peut être étendue pour couvrir les besoins de `System` :

```ts
// packages/core/src/ecs/IEcs.ts
export interface IEcs {
  // Pour Entity
  addEntityToCollections(entity: Entity): void
  destroyEntity(entity: Entity): void
  // Pour System
  systems: { has(c: Constructor<System>): boolean }
  managers: { has(c: Constructor<Manager>): boolean }
  createList(options: ArrayListOptions<Entity>, listConstructor?: Constructor<IList<Entity>>): IList<Entity>
}
```

`System.ts` importe `IEcs` au lieu de `Ecs` — plus de cycle.

**Avantages :** unification de la solution avec Cycle 1, l'interface grandit avec les besoins.  
**Inconvénients :** l'interface commence à être large. Si elle reflète tout `Ecs`, elle perd son utilité de séparation.

#### Option B — Dependency injection explicite via constructeur

Passer les services nécessaires directement au `System` au lieu d'une référence `Ecs` complète :

```ts
abstract class System extends Signable {
  protected systems: ISystemRegistry
  protected managers: IManagerRegistry
  protected createList: CreateListFn
  // ...
  public async init(
    systemRegistry: ISystemRegistry,
    managerRegistry: IManagerRegistry,
    createList: CreateListFn
  ): Promise<void>
}
```

**Avantages :** plus extensible, testable sans instancier `Ecs`.  
**Inconvénients :** breaking change significatif. Tous les systèmes utilisateurs qui overrident `onSystemInit(ecs: Ecs)` doivent changer. Perte de l'accès direct à `ecs.system(SomeSystem)` dans les overrides.

#### Option C — Découpler `checkDependencies` de `System`

Seul `checkDependencies` accède aux registres `Ecs`. Cette logique pourrait vivre dans `Ecs.init()` :

```ts
// Ecs.ts
await this.systems.forEachAsync(async (system) => {
  this.checkSystemDependencies(system)  // ← Ecs vérifie lui-même
  await system.init(this)
})
```

`System` garde `public ecs: Ecs` et `init(ecs: Ecs)`, mais ne vérifie plus ses propres dépendances — il fait confiance à `Ecs` pour l'avoir fait avant. Cycle reste présent mais responsabilités mieux distribuées.

### Verdict

**Non urgent.** Le cycle `System ↔ Ecs` est inhérent à l'architecture ECS : un système a besoin d'accéder à l'orchestrateur pour créer ses listes d'entités et valider ses dépendances. C'est du couplage fonctionnel, pas accidentel.

**Option A (IEcs) est la meilleure approche à long terme.** Mais l'interface deviendrait vite un miroir de `Ecs`, réduisant son intérêt. À n'envisager que si on écrit des tests unitaires `System` sans instancier `Ecs`.

---

## Cycle 3 — `Manager ↔ Ecs`

### Graphe

```
Manager.ts  ──import Ecs──▶  Ecs.ts  ──import Manager──▶  Manager.ts
```

### Détail des usages

**`Manager.ts` → `Ecs`** (ligne 1 : `import Ecs from './Ecs'`)

| Usage | Type | Lignes |
|---|---|---|
| `protected readonly ecs: Ecs` | champ protégé | 6 |
| `public async init(ecs: Ecs): Promise<void>` | paramètre | 18 |
| `public postUpdate(ecs: Ecs): void` | paramètre | 22 |
| `public update(ecs: Ecs, ...)` | paramètre | 26 |

Note : dans la classe de base `Manager`, le champ `ecs` est déclaré mais jamais assigné (le `@ts-expect-error` dans `Ecs.registerManagers` fait l'assignation de façon non typée). Dans les sous-classes concrètes (ex: `TextureManager`, `PhysicManager`), `this.ecs.system(...)` est utilisé extensivement.

**`Ecs.ts` → `Manager`** (ligne 9 : `import Manager from './Manager'`)

| Usage | Type | Lignes |
|---|---|---|
| `private readonly _managers: SignableMap<Manager>` | type générique | 21 |
| `Manager[]` dans `registerManagers(...)` | paramètre | 136 |
| `manager.init(this)`, `manager.update(this, ...)`, `manager.postUpdate(this)` | appels méthode | 77, 97, 110 |
| `managerInstance.ecs = this` (via `@ts-expect-error`) | assignation directe | 144 |

### Particularité : le `@ts-expect-error`

```ts
// Ecs.ts ligne 142-144
// @ts-expect-error
managerInstance.ecs = this
```

`ecs` est `protected readonly` dans `Manager` — TypeScript interdit l'assignation depuis l'extérieur. `Ecs` contourne la protection via un commentaire suppression. C'est un **code smell** qui indique que le design actuel force une bidirectionnalité non exprimable proprement en TypeScript.

L'injection de `this` se fait dans `registerManagers` (au moment de l'enregistrement) et non dans `init()` — ce qui signifie que `this.ecs` est disponible dans les sous-classes dès `registerManagers`, avant même que `init()` soit appelé.

### Nature du cycle

Identique à `System ↔ Ecs` mais avec un problème de design supplémentaire : l'assignation de `ecs` bypasse TypeScript. Le `@ts-expect-error` masque une tension architecturale réelle.

### Options de résolution

#### Option A — Passer `Ecs` via `init()` (déprécier l'assignation directe)

Retirer `protected readonly ecs: Ecs` de la classe de base `Manager`. Passer `ecs` uniquement comme paramètre de `init()`, `update()`, `postUpdate()`. Les sous-classes qui ont besoin de `ecs` après init le stockent elles-mêmes.

```ts
// Manager base class — plus de champ ecs
abstract class Manager extends Signable {
  public async init(ecs: Ecs): Promise<void> {}
  public update(ecs: Ecs, ...): void {}
  public postUpdate(ecs: Ecs): void {}
}

// Sous-classe concrète — stockage explicite si besoin
class TextureManager extends Manager {
  private _ecs!: Ecs  // non-null assertion OK ici car init() est toujours appelé
  public async init(ecs: Ecs): Promise<void> {
    this._ecs = ecs
    // ...
  }
}
```

Supprime le `@ts-expect-error` dans `Ecs.registerManagers`.

**Avantages :** supprime le code smell, design plus honnête.  
**Inconvénients :** breaking change pour toutes les sous-classes qui utilisent `this.ecs` (ex: `TextureManager`, `PhysicManager`). Chaque sous-classe doit implémenter son propre stockage.

#### Option B — Interface `IEcs` (cohérent avec cycles 1 et 2)

Même approche : `Manager` importe `IEcs` au lieu de `Ecs`. Le cycle disparaît côté `Manager`. Résout aussi le `@ts-expect-error` si `IEcs` expose un setter ou un pattern d'initialisation.

#### Option C — Injecter `ecs` dans le constructeur `Manager`

```ts
abstract class Manager extends Signable {
  constructor(name: string, ecs: Ecs) {
    this._ecs = ecs
  }
}
```

Rend la dépendance explicite. Mais `Manager` doit être instancié avant `Ecs.registerManagers` — nécessite que l'utilisateur passe `ecs` à la construction, ce qui complique l'ergonomie.

### Verdict

**Non urgent mais le `@ts-expect-error` devrait être adressé.** C'est le seul cycle des 3 qui contient un contournement TypeScript actif, pas juste un cycle de module.

**Recommandation court terme :** extraire l'assignation de `ecs` dans `Manager.init()` officiellement (Option A, partial). Supprimer le `@ts-expect-error`. Cela ne résout pas le cycle mais améliore la qualité du code sans breaking change.

---

## Résumé comparatif

| Cycle | Type | Edges runtime | Contournement actif | Bugs avérés | Pertinence du fix |
|---|---|---|---|---|---|
| `Entity ↔ Ecs` | Architectural | Oui (2 appels Entity→Ecs) | Non | Non | Moyen terme — Interface IEcs |
| `System ↔ Ecs` | Architectural | Oui (fort couplage) | Non | Non | Long terme — Interface IEcs étendue |
| `Manager ↔ Ecs` | Architectural + code smell | Oui | Oui (`@ts-expect-error`) | Non | Court terme (le `@ts-expect-error`) / moyen terme (cycle) |

---

## Plan de résolution unifié

### Étape 1 — Court terme : supprimer le `@ts-expect-error` dans `Ecs.ts`

Refactorer `Manager` pour que `ecs` soit assigné dans `init()` officiellement. Pas de breaking change public.

```diff
// Manager.ts
- protected readonly ecs: Ecs
+ protected ecs!: Ecs  // sera assigné dans init

  public async init(ecs: Ecs): Promise<void> {
+   this.ecs = ecs
  }
```

```diff
// Ecs.ts registerManagers
- // @ts-expect-error
- managerInstance.ecs = this
```

Sous-classes qui overrident `init()` et appellent `super.init(ecs)` obtiennent `this.ecs` automatiquement.

### Étape 2 — Moyen terme : extraire `IEcs`

Créer `packages/core/src/ecs/IEcs.ts` avec les méthodes consommées par `Entity`, `System`, `Manager` :

```ts
import type Entity from './Entity'
import type System from './System'
import type Manager from './Manager'
import type { Constructor } from '../collections/Signable'
import type IList from '../lists/IList'
import type { ArrayListOptions } from '../lists/List'

export interface IEcs {
  addEntityToCollections(entity: Entity): void
  destroyEntity(entity: Entity): void
  systems: { has(c: Constructor<System>): boolean }
  managers: { has(c: Constructor<Manager>): boolean }
  createList(options: ArrayListOptions<Entity>, listConstructor?: Constructor<IList<Entity>>): IList<Entity>
}
```

`Entity.ts`, `System.ts`, `Manager.ts` importent `IEcs` au lieu de `Ecs`. `Ecs` implémente `IEcs` explicitement (`class Ecs implements IEcs`).

**Résultat :** les 3 cycles disparaissent du graphe de modules runtime.

### Étape 3 — Long terme : tests unitaires isolés

Avec `IEcs` en place, chaque classe est testable avec un mock minimal :

```ts
const mockEcs: IEcs = {
  addEntityToCollections: jest.fn(),
  destroyEntity: jest.fn(),
  systems: { has: jest.fn(() => true) },
  managers: { has: jest.fn(() => true) },
  createList: jest.fn(),
}
```

Tests `Entity`, `System`, `Manager` sans instancier `Ecs` — isolés, rapides, robustes.

---

## Conclusion

Ces 3 cycles sont **différents en nature** de ceux résolus précédemment :

- Les 10 cycles résolus étaient **accidentels** : `import type` suffisait (type-only) ou extraction d'une fonction utilitaire.
- Ces 3 cycles sont **architecturaux** : ils reflètent un design bidirectionnel intentionnel (Entity↔Ecs, System↔Ecs, Manager↔Ecs).

**Ils ne causent pas de bugs avérés aujourd'hui.** La résolution complète nécessite l'introduction d'une interface `IEcs` — refacto chirurgicale mais à planifier correctement pour ne pas casser l'API publique.

**Priorité recommandée :** traiter le `@ts-expect-error` dans `Manager` en premier (basse friction, haute valeur), puis `IEcs` lors d'une phase d'architecture dédiée.
