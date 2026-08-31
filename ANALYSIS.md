# Analyse Mythor

> Généré le 2026-06-22. Base : graphify (1 334 nœuds, 1 839 edges, 101 communautés) + lecture source.
> Mis à jour le 2026-08-31 : revue du code courant et migration des actions ouvertes vers ROADMAP.md.

---

## Objectif et usage de ce fichier

Ce fichier est un **journal de travail évolutif**, pas un rapport figé.

**Objectif long terme :** faire de Mythor un framework de jeu 2D TypeScript robuste, maintenable et publiable — code propre, bien testé, sans dette technique cachée, avec une architecture cohérente qui tient à l'échelle.

**Comment ce fichier évolue :**
- Chaque nouvelle découverte (bug structurel, opportunité d'amélioration, dette technique) est ajoutée.
- Chaque étape réalisée est marquée ✅ avec les détails du fix.
- Le travail se fait **une étape à la fois**, en se concentrant sur un problème précis avant de passer au suivant.
- De nouvelles étapes peuvent apparaître au fil des investigations — le fichier grandit avec la compréhension du code.

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

## Follow-up work moved to ROADMAP.md

Tracked follow-up work now lives in [ROADMAP.md](./ROADMAP.md). This file stays as a historical analysis log.

Verified resolved in this refresh: test coverage, import cycles, strict mode, ES2017 target, decorators, planck 1.x, `Ecs.create()`, and `Ecs.stop()`.

See [docs/ecs-architectural-cycles.md](./docs/ecs-architectural-cycles.md) for the ECS cycle analysis that was already split out.

## Chiffres clés

| Métrique | Valeur |
|---|---|
| Lignes TS | ~9 700 |
| Tests | 65 (4 fichiers : Vec2, Entity, Ecs, System, Manager) |
| Cycles résolus | 11 (10 accidentels + cycle Entity↔Ecs) |
| Cycles architecturaux ECS | 2 (System↔Ecs, Manager↔Ecs — intentionnels) |
| God nodes (>15 edges) | 10 |
| Betweenness #1 | `log()` — 0.191 |
| Cohésion max (fonctionnel) | 0.12 |
| `noImplicitAny` | true (per-package strict) |
| `strictNullChecks` | true (per-package strict) |

Roadmap details moved to [ROADMAP.md](./ROADMAP.md).
