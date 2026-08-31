@mythor/audio / [Exports](modules.md)

# Mythor 

<p>
Mythor is a typescript 2d game framework
</p>
<p align="center">
    <a href="">
      <img alt="MIT Licensed" src="https://img.shields.io/npm/l/@mythor/core.svg?style=flat" />
    </a>
</p>
<hr />

## /!\ Disclaimer /!\
This is a wip project, provided as is, mainly for myself (for now)

## Install
```sh
yarn install
```

## Packages
| Package               | Role                                                    |
|------------------------|---------------------------------------------------------|
| `@mythor/math`         | Vec2, Rect                                              |
| `@mythor/fsm`          | Generic finite state machine, ECS-independent            |
| `@mythor/core`         | ECS kernel (Entity, Component, System, Ecs, Manager)     |
| `@mythor/renderer`     | WebGL renderer, shaders, sprites, camera, postprocessing pipeline (blur, vignette, grayscale, chromatic aberration) and particle systems |
| `@mythor/events`       | Input (keyboard, mouse)                                 |
| `@mythor/physic2d`     | 2D physics (via [planck](https://github.com/shakiba/planck.js)) |
| `@mythor/tiled`        | Tiled map loader                                        |
| `@mythor/game`         | Game loop, Scene management                             |

## Getting started
A minimal scene wiring an entity with rendering, input and physics:

```ts
import { Entity, System, Transform } from '@mythor/core'
import { EventsManager, Key } from '@mythor/events'
import { PhysicSystem, Physic } from '@mythor/physic2d'
import { Renderer, Renderable } from '@mythor/renderer'
import { Game, Scene } from '@mythor/game'

class Move extends System {
  public constructor() {
    super('Move', [Transform, Physic])
  }

  protected onEntityUpdate(entity: Entity): void {
    const events = this.ecs.manager(EventsManager)
    if (events.keyIsDown(Key.ArrowRight)) {
      entity.get(Physic).body?.applyForceToCenter({ x: 10, y: 0 })
    }
  }
}

const scene = new Scene('main', {
  managers: [new EventsManager()],
  systems: [new Renderer(), new PhysicSystem(), new Move()],
  onLoaded: async (ecs) => {
    ecs.create().add(new Transform(), new Physic(), new Renderable())
  },
})

const game = new Game(scene)
game.start()
```

Each package's own README links to its typedoc-generated API reference.

## Examples
[Examples](https://desaintvincent.github.io/mythor/)

## Run
| command    | description                 |
|------------|-----------------------------|
| yarn build | build the application       |
| yarn lint  | lint                        |
| yarn test  | run unit tests              |
| yarn start | locally run the application |

## License

<a href="http://opensource.org/licenses/MIT">MIT</a> © <a href="http://github.com/desaintvincent">desaintvincent</a>
