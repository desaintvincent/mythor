import { Ecs, getConstructor, getSignature, Manager } from '@mythor/core'
import STATS from 'stats.js'
import { EventsManager, Key } from '@mythor/events'

const objectToTable = (
  objs: Array<Record<string, string | number>>
): string => {
  return `
  <table>
    <thead>
        <tr>
            ${Object.keys(objs[0] ?? [])
              .map((key) => `<th style="padding: 5px">${key}</th>`)
              .join('\n')}
        </tr>
    </thead>
    <tbody>
        ${objs
          .map(
            (obj) => `
            <tr>
                ${Object.values(obj)
                  .map(
                    (value) =>
                      `<td style="padding: 5px">${value.toString()}</td>`
                  )
                  .join('\n')}
            </tr>
        `
          )
          .join('\n')}
    </tbody>
  </table>
  `
}

const box = (name: string, content: string): string => `
  <div>
    <h3>${name}</h3>
    <div>${content}</div>
  </div>
`

interface SystemStats extends Record<string, string | number> {
  name: string
  time: string
  id: number
  list: number | string
}

interface ManagerStats extends Record<string, string | number> {
  id: number
  name: string
}
interface ListStats extends Record<string, string | number> {
  id: string
  components: string
}

interface ComponentStats extends Record<string, string | number> {
  id: number
  name: string
}

export type StatisticsManagerOptions = {
  debugElementId: string
}

class StatisticsManager extends Manager {
  private count = 0
  private readonly stats: Stats
  private readonly entityPanel
  private readonly elem?: HTMLElement
  private display = false

  public constructor(params?: StatisticsManagerOptions) {
    super('StatisticsManager')
    this.count = 0

    this.stats = new STATS()
    this.stats.dom.style.left = 'auto'
    this.stats.dom.style.right = '0'

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.entityPanel = this.stats.addPanel(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      new STATS.Panel('Entities', '#0ff', '#002')
    )
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom)
    const elem = document.getElementById(params?.debugElementId ?? 'statistics')
    if (elem) {
      this.elem = elem
    }
  }

  private toggleDisplay(): void {
    this.count = -1
    this.display = !this.display

    if (!this.display && this.elem) {
      this.elem.innerHTML = ''
    }
  }

  public postUpdate(): void {
    this.stats.end()
  }

  public update(ecs: Ecs): void {
    if (!ecs.managers.has(EventsManager)) {
      return
    }
    if (ecs.manager(EventsManager).keyPressed(Key.F3)) {
      this.toggleDisplay()
    }
    this.entityPanel.update(ecs.getEntityNumber(), 2000)
    this.stats.begin()
    this.count++
    if (!this.elem || !this.display || this.count % 20) {
      return
    }
    this.count = 0

    const systemStats = this.getSystemStats(ecs)
    const managerStats = this.getManagerStats(ecs)
    const componentStats = this.getComponentStats(ecs)
    const listStats = this.getListStats(ecs)
    this.elem.innerHTML =
      box('Managers:', objectToTable(managerStats)) +
      box('Systems:', objectToTable(systemStats)) +
      box('Lists:', objectToTable(listStats)) +
      box('Components:', objectToTable(componentStats))
  }

  private getComponentStats(ecs: Ecs): ComponentStats[] {
    return ecs.entityCollections.componentRegistry.constructors.map(
      (constructor) => ({
        id: constructor.signature ?? -1,
        name: constructor.name,
      })
    )
  }

  private getManagerStats(ecs: Ecs): ManagerStats[] {
    return ecs.managers
      .map((m) => ({
        id: getSignature(getConstructor(m)),
        name: m.name,
      }))
      .sort((a, b) => (a.id < b.id ? -1 : 1))
  }

  private getListStats(ecs: Ecs): ListStats[] {
    return Object.entries(ecs.entityCollections.lists)
      .map(
        ([id, list]) =>
          ({
            id,
            components:
              list.constructors
                .map((c) => c.name)
                .sort((a, b) => (a < b ? -1 : 1))
                .join(', ') ?? '',
          } as ListStats)
      )
      .sort((a, b) => (a.id < b.id ? -1 : 1))
  }

  private getSystemStats(ecs: Ecs): SystemStats[] {
    return [
      ...ecs.systems
        .map((system) => ({
          id: getSignature(getConstructor(system)),
          name: system.name,
          list: system.getEntities().signature,
          time: `${system.duration.toFixed(2)} ms`,
        }))
        .sort((a, b) => (a.id < b.id ? -1 : 1)),
      {
        name: 'Total',
        id: 0,
        list: '',
        time: `${ecs.duration.toFixed(2)} ms`,
      },
    ]
  }
}

export default StatisticsManager
