# @mythor/persistence

> @mythor/persistence is part of the <a href="https://github.com/desaintvincent/mythor">Mythor</a> project


<p>
@mythor/persistence exports the SaveManager, useful to save/load ECS state to
a storage backend (localStorage by default).
</p>
<p align="center">
    <a href="">
      <img alt="MIT Licensed" src="https://img.shields.io/npm/l/@mythor/persistence.svg?style=flat" />
    </a>
    <a href="https://www.npmjs.com/package/@mythor/persistence">
      <img alt="NPM Status" src="https://img.shields.io/npm/v/@mythor/persistence.svg?style=flat" />
    </a>
</p>
<hr />

## Usage

Components opt in to persistence by implementing `Serializable`:

```ts
import { Component } from '@mythor/core'
import { Serializable } from '@mythor/persistence'

interface CoinsData {
  amount: number
}

class Coins extends Component implements Serializable<CoinsData> {
  public amount: number

  public constructor(amount = 0) {
    super()
    this.amount = amount
  }

  public serialize(): CoinsData {
    return { amount: this.amount }
  }
}
```

Register a factory for each serializable component type, then save/load:

```ts
import { SaveManager } from '@mythor/persistence'

const saveManager = new SaveManager()
saveManager.registerComponent(
  Coins,
  (data) => new Coins((data as CoinsData).amount)
)

await saveManager.save('slot1')
await saveManager.load('slot1')
```

## A few links to help you get started
- [Examples](https://desaintvincent.github.io/mythor/)
<br />

## License

<a href="http://opensource.org/licenses/MIT">MIT</a> © <a href="http://github.com/desaintvincent">desaintvincent</a>
